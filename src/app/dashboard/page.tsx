'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import {
  Eye,
  MousePointerClick,
  Download,
  Edit3,
  QrCode,
  Share2,
  TrendingUp,
  ExternalLink,
  Copy,
  Check,
  Moon,
  Sun,
  ArrowUpRight,
  Sparkles,
  Globe,
  Phone,
  Mail,
  Calendar,
  History,
  Clock,
  BarChart3,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StatusEnum, PlanoEnum, LayoutEnum } from '@/lib/types/database'

// Mock data removed: Real data is fetched via Supabase

const mockStats = {
  visualizacoes: 0,
  cliques: 0,
  qrcodes: 0,
  tendencia_visualizacoes: 0,
  tendencia_cliques: 0,
  tendencia_qrcodes: 0,
}

// Click Evolution Chart Data Points
const evolutionData = {
  '7d': [
    { label: 'Dom', val: 0 }, { label: 'Seg', val: 0 }, { label: 'Ter', val: 0 },
    { label: 'Qua', val: 0 }, { label: 'Qui', val: 0 }, { label: 'Sex', val: 0 }, { label: 'Sáb', val: 0 },
  ],
  '30d': [
    { label: 'Semana 1', val: 0 }, { label: 'Semana 2', val: 0 },
    { label: 'Semana 3', val: 0 }, { label: 'Semana 4', val: 0 },
  ],
  '90d': [
    { label: 'Mês 1', val: 0 }, { label: 'Mês 2', val: 0 }, { label: 'Mês 3', val: 0 },
  ],
}

// Top Links Click Frequencies
const linksClickData: Record<string, { label: string; val: number }[]> = {
  '7d': [],
  '30d': [],
}

// Top Social Networks Click Frequencies
const socialsClickData: Record<string, { label: string; val: number }[]> = {
  '7d': [],
  '30d': [],
}

// Card modification logs
const mockModificationLogs: any[] = []

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

export default function DashboardPage() {
  const [cardStatus, setCardStatus] = useState<StatusEnum>('ativo')
  const [copied, setCopied] = useState(false)
  const [clickPeriod, setClickPeriod] = useState<'7d' | '30d' | '90d'>('7d')
  const [linkPeriod, setLinkPeriod] = useState<'7d' | '30d'>('30d')
  const [socialPeriod, setSocialPeriod] = useState<'7d' | '30d'>('30d')
  
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [mockUser, setMockUser] = useState<any>(null)
  const [mockCard, setMockCard] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient() as any
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session?.user) return

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileError) {
          console.error("Profile error:", profileError)
          setErrorMsg(`Erro ao buscar perfil: ${profileError.message}`)
          setIsLoading(false)
          return
        }

        const { data: cardData } = await supabase
          .from('cards')
          .select('*')
          .eq('user_id', session.user.id)
          .single()

        const profile = profileData as any
        const card = cardData as any

        if (profile) {
          setMockUser({
            nome: profile.nome || 'Usuário',
            username: profile.username || '',
            plano: (profile.plano as PlanoEnum) || 'simples',
            dataContratacao: new Date(profile.created_at).toLocaleDateString('pt-BR'),
            fimAnuidade: new Date(new Date(profile.created_at).setFullYear(new Date(profile.created_at).getFullYear() + 1)).toLocaleDateString('pt-BR'),
          })
        }

        if (card) {
          setMockCard({
            nome: card.titulo ? profile.nome : (profile.nome || 'Sem Nome'),
            titulo: card.titulo || 'Adicione um título',
            foto_url: card.foto_url,
            status: (card.status as StatusEnum) || 'ativo',
            layout: (card.layout as LayoutEnum) || 'moderno',
            especialidades: card.especialidades || [],
            contatos: card.contatos || {},
            customizacao: card.customizacao || { cor_primaria: '#6366f1' },
          })
          setCardStatus((card.status as StatusEnum) || 'ativo')
        } else {
          setMockCard({
            nome: profile?.nome || 'Usuário',
            titulo: 'Configure seu cartão digital',
            foto_url: null,
            status: 'ativo' as StatusEnum,
            layout: 'moderno' as LayoutEnum,
            especialidades: ['Adicione suas especialidades'],
            contatos: {},
            customizacao: { cor_primaria: '#6366f1' },
          })
        }
      } catch (err: any) {
        setErrorMsg(`Erro inesperado: ${err.message}`)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${mockUser?.username || ''}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available
    }
  }

  const toggleStatus = async () => {
    const newStatus = cardStatus === 'ativo' ? 'dormindo' : 'ativo'
    setCardStatus(newStatus)
    
    const supabase = createClient() as any
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      await (supabase.from('cards').update as any)({ status: newStatus }).eq('user_id', session.user.id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    )
  }

  if (errorMsg) {
    return (
      <div className="flex h-full min-h-[400px] w-full flex-col items-center justify-center p-4">
        <div className="max-w-md rounded-xl bg-error/10 p-6 border border-error/20 text-center">
          <h2 className="text-xl font-bold text-error mb-2">Erro ao carregar dados</h2>
          <p className="text-text-secondary text-sm mb-4">{errorMsg}</p>
          <button 
            onClick={() => window.location.reload()}
            className="rounded-lg bg-surface-200 px-4 py-2 text-sm text-text-primary hover:bg-surface-300"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  if (!mockUser || !mockCard) return null

  const handleExportCSV = () => {
    const today = new Date().toISOString().split('T')[0]
    const filename = `relatorio_estatisticas_${today}.csv`

    // Generate CSV content
    const csvRows = [
      ['Indicador', 'Valor', 'Tendencia/Status'],
      ['Data de Exportacao', today, ''],
      ['Profissional', mockUser.nome, ''],
      ['Plano Contratado', mockUser.plano.toUpperCase(), ''],
      ['Status do Cartao', cardStatus.toUpperCase(), ''],
      ['Visualizacoes Totais', mockStats.visualizacoes.toString(), `${mockStats.tendencia_visualizacoes}%`],
      ['Links Clicados', mockStats.cliques.toString(), `${mockStats.tendencia_cliques}%`],
      ['QR Codes Baixados', mockStats.qrcodes.toString(), `${mockStats.tendencia_qrcodes}%`],
    ]

    // Convert rows to CSV string (with UTF-8 BOM for Excel support)
    const csvContent = '\uFEFF' + csvRows.map(row => row.map(val => `"${val}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    
    // Trigger download
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const stats = [
    {
      label: 'Total de Visualizações',
      value: mockStats.visualizacoes.toLocaleString('pt-BR'),
      icon: Eye,
      trend: mockStats.tendencia_visualizacoes,
      color: 'text-brand-400',
      bgColor: 'bg-brand-500/10',
    },
    {
      label: 'Links Clicados',
      value: mockStats.cliques.toLocaleString('pt-BR'),
      icon: MousePointerClick,
      trend: mockStats.tendencia_cliques,
      color: 'text-accent-400',
      bgColor: 'bg-accent-500/10',
    },
    {
      label: 'QR Codes Baixados',
      value: mockStats.qrcodes.toLocaleString('pt-BR'),
      icon: Download,
      trend: mockStats.tendencia_qrcodes,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
  ]

  const quickActions = [
    {
      label: 'Editar Cartão',
      description: 'Atualize suas informações',
      icon: Edit3,
      href: '/dashboard/card',
      color: 'text-brand-400',
      bgColor: 'bg-brand-500/10',
    },
    {
      label: 'Baixar QR Code',
      description: 'PNG ou SVG de alta qualidade',
      icon: QrCode,
      href: '/dashboard/qrcode',
      color: 'text-accent-400',
      bgColor: 'bg-accent-500/10',
    },
    {
      label: 'Compartilhar Link',
      description: 'Copie ou envie seu perfil',
      icon: Share2,
      href: '#',
      onClick: handleCopyLink,
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10',
    },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
              Olá, {mockUser.nome.split(' ')[0]}! 👋
            </h1>
            <p className="text-text-tertiary mt-1">
              Aqui está o resumo do seu perfil profissional.
            </p>
          </div>

          {/* Action Header controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 border bg-white/5 border-white/10 text-brand-300 hover:bg-white/10 hover:text-brand-200"
            >
              <Download className="h-4 w-4" />
              <span>Exportar Estatísticas</span>
            </button>

            <div className="flex items-center gap-2.5">
              <span className="text-sm text-text-secondary">Status:</span>
              <button
                onClick={toggleStatus}
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 border',
                  cardStatus === 'ativo'
                    ? 'bg-success/10 border-success/25 text-success'
                    : 'bg-warning/10 border-warning/25 text-warning'
                )}
              >
                {cardStatus === 'ativo' ? (
                  <>
                    <Sun className="h-4 w-4" />
                    <span>Ativo</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    <span>Dormindo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats cards */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="glass-card rounded-2xl p-5 relative overflow-hidden group"
              >
                {/* Background glow */}
                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl bg-brand-500/10" />

                <div className="relative z-10 flex items-start justify-between">
                  <div className={cn('rounded-xl p-2.5', stat.bgColor)}>
                    <Icon className={cn('h-5 w-5', stat.color)} />
                  </div>
                  <div
                    className={cn(
                      'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                      stat.trend >= 0
                        ? 'bg-success/10 text-success'
                        : 'bg-error/10 text-error'
                    )}
                  >
                    <TrendingUp
                      className={cn(
                        'h-3 w-3',
                        stat.trend < 0 && 'rotate-180'
                      )}
                    />
                    {Math.abs(stat.trend)}%
                  </div>
                </div>

                <div className="relative z-10 mt-4">
                  <p className="text-3xl font-bold text-text-primary tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-sm text-text-tertiary mt-1">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card preview */}
          <motion.div variants={item} className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-brand-400" />
                  Pré-visualização do Cartão
                </h2>
                <Link
                  href="/dashboard/card"
                  className="flex items-center gap-1 text-sm text-brand-400 hover:text-brand-300 transition-colors"
                >
                  Editar
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Mini card preview */}
              <div className="relative rounded-xl overflow-hidden gradient-card border border-white/[0.06] p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  {/* Avatar */}
                  {mockCard.foto_url ? (
                    <img
                      src={mockCard.foto_url}
                      alt={mockCard.nome}
                      className="h-20 w-20 rounded-xl object-cover ring-2 ring-brand-500/20"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl gradient-brand text-white text-2xl font-bold ring-2 ring-brand-500/20">
                      {mockCard.nome.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </div>
                  )}

                  <div className="text-center sm:text-left flex-1">
                    <h3 className="text-xl font-bold text-text-primary">
                      {mockCard.nome}
                    </h3>
                    <p className="text-sm text-text-secondary mt-0.5">
                      {mockCard.titulo}
                    </p>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                      {mockCard.especialidades.map((esp: string) => (
                        <span
                          key={esp}
                          className="rounded-full bg-brand-500/10 border border-brand-500/20 px-3 py-0.5 text-xs font-medium text-brand-300"
                        >
                          {esp}
                        </span>
                      ))}
                    </div>

                    {/* Contact previews */}
                    <div className="flex flex-wrap gap-3 mt-4 justify-center sm:justify-start">
                      {mockCard.contatos.telefone && (
                        <span className="flex items-center gap-1.5 text-xs text-text-tertiary">
                          <Phone className="h-3.5 w-3.5" />
                          {mockCard.contatos.telefone}
                        </span>
                      )}
                      {mockCard.contatos.email && (
                        <span className="flex items-center gap-1.5 text-xs text-text-tertiary">
                          <Mail className="h-3.5 w-3.5" />
                          {mockCard.contatos.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Layout badge */}
                <div className="absolute top-3 right-3">
                  <span className="rounded-md bg-surface-300/60 border border-surface-400/30 px-2 py-0.5 text-[10px] font-medium text-text-tertiary uppercase tracking-wider">
                    {mockCard.layout}
                  </span>
                </div>
              </div>

              {/* Profile link section */}
              <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1 flex items-center gap-2 rounded-xl bg-surface-200/50 border border-white/[0.06] px-4 py-2.5">
                  <Globe className="h-4 w-4 text-text-tertiary shrink-0" />
                  <span className="text-sm text-text-secondary truncate">
                    {profileUrl}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyLink}
                    className={cn(
                      'glass-button rounded-xl px-4 py-2.5 text-sm font-medium flex items-center gap-2 transition-all',
                      copied ? 'text-success' : 'text-brand-300'
                    )}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copiar
                      </>
                    )}
                  </button>
                  <Link
                    href={`/p/${mockUser.username}`}
                    target="_blank"
                    className="glass-button rounded-xl px-4 py-2.5 text-sm font-medium text-brand-300 flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Abrir
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick actions */}
          <motion.div variants={item} className="space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">
              Ações Rápidas
            </h2>

            <div className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon
                const Wrapper = action.href === '#' ? 'button' : Link
                const wrapperProps =
                  action.href === '#'
                    ? { onClick: action.onClick, type: 'button' as const }
                    : { href: action.href }

                return (
                  <motion.div
                    key={action.label}
                    whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  >
                    {/* @ts-expect-error — polymorphic wrapper */}
                    <Wrapper
                      {...wrapperProps}
                      className="flex w-full items-center gap-4 glass-card rounded-xl p-4 group cursor-pointer text-left"
                    >
                      <div className={cn('rounded-lg p-2.5', action.bgColor)}>
                        <Icon className={cn('h-5 w-5', action.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary group-hover:text-brand-300 transition-colors">
                          {action.label}
                        </p>
                        <p className="text-xs text-text-tertiary mt-0.5">
                          {action.description}
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-text-tertiary group-hover:text-brand-400 transition-colors shrink-0" />
                    </Wrapper>
                  </motion.div>
                )
              })}
            </div>

            {/* Upgrade prompt (shown for non-completo plans) */}
            {mockUser.plano !== 'completo' && (
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="relative overflow-hidden rounded-2xl p-5 gradient-brand"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-white" />
                    <span className="text-sm font-semibold text-white">
                      Faça upgrade
                    </span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">
                    Desbloqueie links ilimitados, NFC, portfólio e muito mais
                    com o Plano Completo.
                  </p>
                  <button className="mt-3 w-full rounded-lg bg-white/20 backdrop-blur-sm border border-white/25 px-4 py-2 text-sm font-medium text-white hover:bg-white/30 transition-colors">
                    Ver planos
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Row 4: Click Evolution & Top Frequencies */}
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Click Evolution Chart */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-brand-400" />
                Evolução de Cliques Totais
              </h2>
              {/* Period Selector Filter */}
              <div className="flex bg-surface-200 border border-white/5 rounded-lg p-0.5 self-start sm:self-auto">
                {(['7d', '30d', '90d'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setClickPeriod(period)}
                    className={cn(
                      'px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200',
                      clickPeriod === period
                        ? 'bg-brand-500 text-white shadow'
                        : 'text-text-secondary hover:text-text-primary'
                    )}
                  >
                    {period === '7d' ? '7 Dias' : period === '30d' ? '30 Dias' : '90 Dias'}
                  </button>
                ))}
              </div>
            </div>

            {/* Click Evolution SVG Chart Plot */}
            <div className="h-[200px] flex items-end justify-between gap-1 w-full pt-4 font-mono text-[10px] text-text-tertiary">
              {evolutionData[clickPeriod].map((pt, idx) => {
                const maxVal = Math.max(...evolutionData[clickPeriod].map(p => p.val), 10)
                const pct = (pt.val / maxVal) * 100
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-semibold text-brand-300 text-xs mb-1">
                      {pt.val}
                    </span>
                    <div className="w-full max-w-[32px] bg-white/5 border border-white/10 rounded-t-lg h-full flex items-end overflow-hidden">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${pct}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="w-full bg-gradient-to-t from-brand-600 to-accent-500 rounded-t-md group-hover:brightness-110 transition-all duration-300"
                      />
                    </div>
                    <span className="truncate max-w-[64px] text-center">{pt.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top Links & Socials Frequency Charts */}
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary">
                  Cliques por Mídia
                </h2>
                <div className="flex bg-surface-200 border border-white/5 rounded-md p-0.5">
                  {(['7d', '30d'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => {
                        setLinkPeriod(period)
                        setSocialPeriod(period)
                      }}
                      className={cn(
                        'px-2 py-0.5 text-[10px] font-bold rounded',
                        linkPeriod === period
                          ? 'bg-brand-500 text-white shadow'
                          : 'text-text-secondary hover:text-text-primary'
                      )}
                    >
                      {period === '7d' ? '7D' : '30D'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequencies links progress bars */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-text-tertiary">Links do Perfil</p>
                {linksClickData[linkPeriod].map((lnk) => {
                  const maxLnk = Math.max(...linksClickData[linkPeriod].map(l => l.val), 1)
                  const pct = (lnk.val / maxLnk) * 100
                  return (
                    <div key={lnk.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-primary font-medium truncate max-w-[170px]">{lnk.label}</span>
                        <span className="font-mono text-brand-300 font-bold">{lnk.val}</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                        <div className="bg-brand-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-3 pt-4 mt-4 border-t border-white/[0.06]">
                <p className="text-xs font-semibold text-text-tertiary">Redes Sociais</p>
                {socialsClickData[socialPeriod].map((soc) => {
                  const maxSoc = Math.max(...socialsClickData[socialPeriod].map(s => s.val), 1)
                  const pct = (soc.val / maxSoc) * 100
                  return (
                    <div key={soc.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-primary font-medium">{soc.label}</span>
                        <span className="font-mono text-accent-300 font-bold">{soc.val}</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                        <div className="bg-accent-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Row 5: Modification Log & Subscription Info */}
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Card Modification Log */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <History className="h-5 w-5 text-brand-400" />
              Log de Alterações do Cartão
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/[0.06] text-text-tertiary">
                    <th className="pb-2.5 font-semibold">Ação</th>
                    <th className="pb-2.5 font-semibold">Data</th>
                    <th className="pb-2.5 font-semibold">Alterações Realizadas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {mockModificationLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3 font-semibold text-text-primary flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-brand-400/80 hover:text-brand-300 transition-colors" />
                        {log.acao}
                      </td>
                      <td className="py-3 text-text-secondary font-mono">{log.data}</td>
                      <td className="py-3 text-text-tertiary">{log.detalhes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subscription Dates & Contract Details */}
          <div className="glass-card rounded-2xl p-6 space-y-4 relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-50 blur-2xl bg-accent-500/10" />
            
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2 relative z-10">
              <Calendar className="h-5 w-5 text-brand-400" />
              Plano & Assinatura
            </h2>

            <div className="space-y-3 pt-2 relative z-10">
              <div className="rounded-xl p-3 bg-white/[0.02] border border-white/[0.04] flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary">Plano Ativo</span>
                <span className="text-sm font-bold text-brand-300">Plano Médio (Anual)</span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="rounded-xl p-3 bg-white/[0.02] border border-white/[0.04] flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary">Data Contratação</span>
                  <span className="text-xs font-semibold text-text-secondary font-mono">{mockUser.dataContratacao}</span>
                </div>
                <div className="rounded-xl p-3 bg-white/[0.02] border border-white/[0.04] flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary">Fim da Anuidade</span>
                  <span className="text-xs font-semibold text-accent-300 font-mono">{mockUser.fimAnuidade}</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-text-tertiary leading-relaxed flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                Assinatura ativa e renovação automática habilitada.
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
