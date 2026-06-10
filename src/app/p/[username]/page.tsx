import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type {
  PublicCardData,
  Card,
  Badge,
  LinktreeLink,
  PortfolioLink,
  Profile,
  StatusEnum,
} from '@/lib/types/database'
import { CardContainer } from '@/components/card/CardContainer'
import { SleepingCard } from '@/components/card/SleepingCard'
import { PublicShareBar } from '@/components/card/PublicShareBar'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 0
export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ username: string }>
}

function getMockCardData(username: string): PublicCardData & { status: StatusEnum } {
  const mockProfiles: Record<string, PublicCardData & { status: StatusEnum }> = {
    'dra-maria': {
      status: 'ativo',
      card: {
        id: 'card-001',
        user_id: 'user-001',
        foto_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
        nome: 'Dra. Maria Helena Costa',
        titulo: 'Cardiologista | Ecocardiografista',
        formacao: [
          { grau: 'Medicina', instituicao: 'Universidade de São Paulo (USP)', ano: '2010' },
          { grau: 'Residência em Cardiologia', instituicao: 'InCor — HCFMUSP', ano: '2013' },
          { grau: 'Fellowship em Ecocardiografia', instituicao: 'InCor — HCFMUSP', ano: '2015' },
          { grau: 'Doutorado em Cardiologia', instituicao: 'FMUSP', ano: '2019' },
        ],
        especialidades: ['Cardiologia', 'Ecocardiografia', 'Insuficiência Cardíaca', 'Cardio-Oncologia'],
        contatos: {
          telefone: '+5511999887766',
          whatsapp: '+5511999887766',
          email: 'dra.maria@clinicacardio.com.br',
        },
        redes_sociais: {
          linkedin: 'https://linkedin.com/in/dramariacosta',
          instagram: 'https://instagram.com/dramariacosta',
          site: 'https://clinicacardio.com.br',
        },
        layout: 'moderno',
        customizacao: {
          cor_primaria: '#6366f1',
          cor_fundo: '#131318',
        },
        nfc_ativo: true,
        status: 'ativo',
        deleted_at: null,
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2026-05-20T14:30:00Z',
      },
      profile: {
        username: 'dra-maria',
        plano: 'completo',
      },
      badges: [
        { id: 'badge-001', user_id: 'user-001', label: 'CRM-SP 154.892', codigo: 'CRM', ativo: true, created_at: '2025-01-15T10:00:00Z' },
        { id: 'badge-002', user_id: 'user-001', label: 'RQE 42.315 — Cardiologia', codigo: 'RQE', ativo: true, created_at: '2025-01-15T10:00:00Z' },
        { id: 'badge-003', user_id: 'user-001', label: 'TSEC — Ecocardiografia', codigo: 'TSEC', ativo: true, created_at: '2025-01-15T10:00:00Z' },
      ],
      linktree_links: [
        { id: 'link-001', user_id: 'user-001', label: 'Agende sua Consulta', url: 'https://doctoralia.com.br/dra-maria', ordem: 1, ativo: true, created_at: '2025-01-15T10:00:00Z' },
        { id: 'link-002', user_id: 'user-001', label: 'Artigos Publicados', url: 'https://scholar.google.com/citations?user=dra-maria', ordem: 2, ativo: true, created_at: '2025-01-15T10:00:00Z' },
        { id: 'link-003', user_id: 'user-001', label: 'Canal no YouTube', url: 'https://youtube.com/@dramariacosta', ordem: 3, ativo: true, created_at: '2025-01-15T10:00:00Z' },
      ],
      portfolio_links: [
        { id: 'port-001', user_id: 'user-001', label: 'Currículo Lattes', url: 'https://lattes.cnpq.br/dra-maria', tipo: 'outro', created_at: '2025-01-15T10:00:00Z' },
      ],
    },
    'dormindo': {
      status: 'dormindo',
      card: {
        id: 'card-002',
        user_id: 'user-002',
        foto_url: null,
        nome: 'Dr. Perfil Dormindo',
        titulo: null,
        formacao: [],
        especialidades: [],
        contatos: {},
        redes_sociais: {},
        layout: 'minimalista',
        customizacao: {},
        nfc_ativo: false,
        status: 'dormindo',
        deleted_at: null,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      },
      profile: { username: 'dormindo', plano: 'simples' },
      badges: [],
      linktree_links: [],
      portfolio_links: [],
    },
  }

  const defaultData: PublicCardData & { status: StatusEnum } = {
    status: 'ativo',
    card: {
      id: 'card-default',
      user_id: 'user-default',
      foto_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
      nome: `Dr. ${username.charAt(0).toUpperCase()}${username.slice(1).replace(/-/g, ' ')}`,
      titulo: 'Clínico Geral | Médico da Família',
      formacao: [
        { grau: 'Medicina', instituicao: 'Universidade Federal de Minas Gerais (UFMG)', ano: '2015' },
        { grau: 'Residência em Clínica Médica', instituicao: 'Hospital das Clínicas — UFMG', ano: '2018' },
      ],
      especialidades: ['Clínica Médica', 'Medicina de Família', 'Saúde Preventiva'],
      contatos: {
        telefone: '+5531988776655',
        whatsapp: '+5531988776655',
        email: `contato@${username}.med.br`,
      },
      redes_sociais: {
        linkedin: `https://linkedin.com/in/${username}`,
        instagram: `https://instagram.com/${username}`,
      },
      layout: 'minimalista',
      customizacao: {
        cor_primaria: '#6366f1',
        cor_fundo: '#131318',
      },
      nfc_ativo: false,
      status: 'ativo',
      deleted_at: null,
      created_at: '2025-06-01T10:00:00Z',
      updated_at: '2026-06-01T10:00:00Z',
    },
    profile: {
      username,
      plano: 'medio',
    },
    badges: [
      { id: 'badge-def-001', user_id: 'user-default', label: `CRM-MG 198.456`, codigo: 'CRM', ativo: true, created_at: '2025-06-01T10:00:00Z' },
    ],
    linktree_links: [
      { id: 'link-def-001', user_id: 'user-default', label: 'Agende sua Consulta', url: 'https://doctoralia.com.br', ordem: 1, ativo: true, created_at: '2025-06-01T10:00:00Z' },
    ],
    portfolio_links: [],
  }

  if (username === 'apagado') {
    return { ...defaultData, status: 'apagado' }
  }

  return mockProfiles[username] ?? defaultData
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params
  const data = getMockCardData(username)

  if (data.status !== 'ativo') {
    return {
      title: 'Perfil Indisponível',
      description: 'Este perfil não está disponível no momento.',
    }
  }

  const { card } = data

  return {
    title: `${card.nome} — ${card.titulo ?? 'Profissional de Saúde'}`,
    description: `Cartão digital profissional de ${card.nome}. ${card.especialidades.join(', ')}. Acesse contatos, formação acadêmica e certificações verificadas.`,
    openGraph: {
      type: 'profile',
      locale: 'pt_BR',
      siteName: 'One Blank Page',
      title: `${card.nome} — ${card.titulo ?? 'Profissional de Saúde'}`,
      description: `Cartão digital profissional de ${card.nome}. ${card.especialidades.join(', ')}.`,
      url: `https://oneblankpage.com.br/p/${username}`,
      images: card.foto_url
        ? [{ url: card.foto_url, width: 400, height: 400, alt: card.nome }]
        : [],
    },
    twitter: {
      card: 'summary',
      title: card.nome,
      description: card.titulo ?? 'Profissional de Saúde',
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function PublicCardPage({ params }: PageProps) {
  const { username } = await params
  
  const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('SEU-PROJETO')
  let data = getMockCardData(username)

  if (!isPlaceholder) {
    try {
      const supabase = await createClient()
      const { data: profile } = (await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()) as { data: any }

      if (profile) {
        const { data: card } = (await supabase
          .from('cards')
          .select('*')
          .eq('user_id', profile.id)
          .single()) as { data: any }

        if (card && card.status !== 'apagado') {
          const { data: badges } = (await supabase
            .from('badges')
            .select('*')
            .eq('user_id', profile.id)
            .eq('ativo', true)) as { data: any[] | null }

          const { data: linktree_links } = (await supabase
            .from('linktree_links')
            .select('*')
            .eq('user_id', profile.id)
            .eq('ativo', true)
            .order('ordem', { ascending: true })) as { data: any[] | null }

          const { data: portfolio_links } = (await supabase
            .from('portfolio_links')
            .select('*')
            .eq('user_id', profile.id)) as { data: any[] | null }

          // Ensure strict JSON conversions
          const rawFormacao = Array.isArray(card.formacao) ? card.formacao : JSON.parse((card.formacao as any) || '[]')
          const rawEspecialidades = Array.isArray(card.especialidades) ? card.especialidades : JSON.parse((card.especialidades as any) || '[]')
          const rawContatos = (typeof card.contatos === 'object' && card.contatos) ? card.contatos : JSON.parse((card.contatos as any) || '{}')
          const rawRedesSociais = (typeof card.redes_sociais === 'object' && card.redes_sociais) ? card.redes_sociais : JSON.parse((card.redes_sociais as any) || '{}')
          const rawCustomizacao = (typeof card.customizacao === 'object' && card.customizacao) ? card.customizacao : JSON.parse((card.customizacao as any) || '{}')

          data = {
            status: card.status,
            profile: {
              username: profile.username,
              plano: profile.plano,
            },
            card: {
              ...card,
              formacao: rawFormacao,
              especialidades: rawEspecialidades,
              contatos: rawContatos,
              redes_sociais: rawRedesSociais,
              customizacao: rawCustomizacao,
            },
            badges: badges || [],
            linktree_links: linktree_links || [],
            portfolio_links: portfolio_links || [],
          }
        } else if (card?.status === 'apagado') {
          data = { ...data, status: 'apagado' }
        }
      }
    } catch (err) {
      console.error('Error fetching Supabase data, falling back to mock:', err)
    }
  }

  if (data.status === 'apagado') {
    notFound()
  }

  if (data.status === 'dormindo') {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-surface-0 p-4">
        <SleepingCard nome={data.card.nome} />
      </main>
    )
  }

  const publicCardData: PublicCardData = {
    card: data.card,
    profile: data.profile,
    badges: data.badges,
    linktree_links: data.linktree_links,
    portfolio_links: data.portfolio_links,
  }

  return (
    <main className="min-h-dvh flex items-center justify-center bg-surface-0 p-4 sm:p-6">
      <div className="w-full max-w-md flex flex-col items-center animate-fade-in">
        <CardContainer data={publicCardData} showQrCode={false} />
        <PublicShareBar username={username} />
      </div>
    </main>
  )
}
