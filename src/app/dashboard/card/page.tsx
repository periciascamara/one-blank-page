'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Phone,
  GraduationCap,
  Link as LinkIcon,
  Palette,
  Sparkles,
  Lock,
  Plus,
  Trash2,
  ChevronDown,
  Globe,
  Upload,
  Save,
  Check,
  Shield,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CardFront } from '@/components/card/CardFront'
import { CardBack } from '@/components/card/CardBack'
import type { Card, Badge, LinktreeLink, PublicCardData, PlanoEnum, StatusEnum } from '@/lib/types/database'

import type { LayoutEnum } from '@/lib/types/database'

type TabType = 'basico' | 'contatos' | 'formacao' | 'links' | 'badges' | 'aparencia'

export default function CardEditorPage() {
  const [activeTab, setActiveTab] = useState<TabType>('basico')
  const [data, setData] = useState<PublicCardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showPreviewBack, setShowPreviewBack] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Sync edited card data to localStorage for real-time update in open public card preview tabs
  useEffect(() => {
    if (typeof window === 'undefined' || !data) return
    localStorage.setItem(`oneblankpage_preview_${data.profile.username}`, JSON.stringify(data))
  }, [data])

  // Load actual Supabase card data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = (await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()) as { data: any }

        if (profile) {
          const { data: card } = (await supabase
            .from('cards')
            .select('*')
            .eq('user_id', profile.id)
            .maybeSingle()) as { data: any }

          const { data: badges } = (await supabase
            .from('badges')
            .select('*')
            .eq('user_id', profile.id)) as { data: any[] | null }

          const { data: linktree_links } = (await supabase
            .from('linktree_links')
            .select('*')
            .eq('user_id', profile.id)
            .order('ordem', { ascending: true })) as { data: any[] | null }

          if (card) {
            const rawFormacao = Array.isArray(card.formacao) ? card.formacao : JSON.parse((card.formacao as any) || '[]')
            const rawEspecialidades = Array.isArray(card.especialidades) ? card.especialidades : JSON.parse((card.especialidades as any) || '[]')
            const rawContatos = (typeof card.contatos === 'object' && card.contatos) ? card.contatos : JSON.parse((card.contatos as any) || '{}')
            const rawRedesSociais = (typeof card.redes_sociais === 'object' && card.redes_sociais) ? card.redes_sociais : JSON.parse((card.redes_sociais as any) || '{}')
            const rawCustomizacao = (typeof card.customizacao === 'object' && card.customizacao) ? card.customizacao : JSON.parse((card.customizacao as any) || '{}')

            setData({
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
              portfolio_links: [],
            })
          } else {
            // New user, create empty card state
            setData({
              profile: { username: profile.username, plano: profile.plano },
              card: {
                id: '', // Empty means new
                user_id: profile.id,
                nome: profile.nome || '',
                titulo: '',
                foto_url: null,
                status: 'ativo' as StatusEnum,
                layout: 'moderno' as LayoutEnum,
                especialidades: [],
                formacao: [],
                contatos: {},
                redes_sociais: {},
                customizacao: { cor_primaria: '#6366f1', cor_fundo: '#09090b' },
                nfc_ativo: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                deleted_at: null,
              },
              badges: badges || [],
              linktree_links: linktree_links || [],
              portfolio_links: [],
            })
          }
        }
      } catch (err) {
        console.error('Error loading card data from Supabase:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [])

  // Specialty Tag Input State
  const [newSpecialty, setNewSpecialty] = useState('')

  // Linktree Edit State
  const [newLinkLabel, setNewLinkLabel] = useState('')
  const [newLinkUrl, setNewLinkUrl] = useState('')

  // Formacao Edit State
  const [newGrau, setNewGrau] = useState('')
  const [newInst, setNewInst] = useState('')
  const [newAno, setNewAno] = useState('')

  const userPlan = data?.profile?.plano || 'simples'

  const togglePresetBadge = (label: string, codigo: string) => {
    setData((prev) => {
      if (!prev) return prev
      const exists = prev.badges.some((b) => b.label === label)
      if (exists) {
        return {
          ...prev,
          badges: prev.badges.filter((b) => b.label !== label),
        }
      } else {
        const newBadge: Badge = {
          id: `b-preset-${Date.now()}`,
          user_id: prev.card.user_id,
          label,
          codigo,
          ativo: true,
          meta_percentual: 75,
          created_at: new Date().toISOString(),
        }
        return {
          ...prev,
          badges: [...prev.badges, newBadge],
        }
      }
    })
  }

  const handleBadgeProgressChange = (id: string, value: number) => {
    setData((prev) => prev ? ({
      ...prev,
      badges: prev.badges.map((b) => (b.id === id ? { ...b, meta_percentual: value } : b)),
    }) : null)
  }

  const isFeatureLocked = (featurePlan: PlanoEnum) => {
    if (userPlan === 'completo') return false
    if (userPlan === 'medio' && featurePlan !== 'completo') return false
    if (userPlan === 'simples' && featurePlan === 'simples') return false
    return true
  }

  const handleSave = async () => {
    if (!data) return
    setIsSaving(true)
    setErrorMessage(null)
    
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient() as any
      
      let cardId = data.card.id
      
      // 1. Save Card in DB
      if (!cardId) {
        // Insert new
        const { data: newCard, error: insertError } = await supabase
          .from('cards')
          .insert({
            user_id: data.card.user_id,
            nome: data.card.nome,
            titulo: data.card.titulo || null,
            foto_url: data.card.foto_url || null,
            layout: data.card.layout,
            contatos: data.card.contatos,
            redes_sociais: data.card.redes_sociais,
            especialidades: data.card.especialidades,
            formacao: data.card.formacao,
            customizacao: data.card.customizacao,
            nfc_ativo: data.card.nfc_ativo,
            status: data.card.status,
          })
          .select()
          .single()
          
        if (insertError) throw new Error(`Erro ao inserir cartão: ${insertError.message}`)
        if (!newCard) throw new Error('Cartão não retornou após inserção.')
        
        cardId = newCard.id
        setData((prev) => prev ? { ...prev, card: { ...prev.card, id: cardId } } : null)
      } else {
        // Update existing
        const { error: cardError } = await supabase
          .from('cards')
          .update({
            nome: data.card.nome,
            titulo: data.card.titulo || null,
            foto_url: data.card.foto_url || null,
            layout: data.card.layout,
            contatos: data.card.contatos,
            redes_sociais: data.card.redes_sociais,
            especialidades: data.card.especialidades,
            formacao: data.card.formacao,
            customizacao: data.card.customizacao,
            nfc_ativo: data.card.nfc_ativo,
            status: data.card.status,
          })
          .eq('id', cardId)
          .select()
          .single()

        if (cardError) throw new Error(`Erro ao atualizar cartão: ${cardError.message}`)
      }

      // 2. Synchronize active Badges
      const { error: deleteBadgesError } = await supabase
        .from('badges')
        .delete()
        .eq('user_id', data.card.user_id)
        
      if (deleteBadgesError) throw new Error(`Erro ao limpar badges antigas: ${deleteBadgesError.message}`)

      if (data.badges.length > 0) {
        const { error: badgesError } = await supabase
          .from('badges')
          .insert(
            data.badges.map((b) => ({
              user_id: data.card.user_id,
              label: b.label,
              codigo: b.codigo || null,
              ativo: b.ativo,
            }))
          )
        if (badgesError) throw new Error(`Erro ao inserir badges: ${badgesError.message}`)
      }

      // 3. Synchronize active Linktree links
      const { error: deleteLinksError } = await supabase
        .from('linktree_links')
        .delete()
        .eq('user_id', data.card.user_id)
        
      if (deleteLinksError) throw new Error(`Erro ao limpar links antigos: ${deleteLinksError.message}`)

      if (data.linktree_links.length > 0) {
        const { error: linksError } = await supabase
          .from('linktree_links')
          .insert(
            data.linktree_links.map((l) => ({
              user_id: data.card.user_id,
              label: l.label,
              url: l.url,
              ordem: l.ordem,
              ativo: l.ativo,
            }))
          )
        if (linksError) throw new Error(`Erro ao inserir links: ${linksError.message}`)
      }

      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 2000)
    } catch (err: any) {
      console.error('Error saving card details to Supabase:', err)
      const errorMsg = err?.message || JSON.stringify(err) || 'Erro desconhecido'
      setErrorMessage(`Erro ao salvar no Supabase: ${errorMsg}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleBasicChange = (field: keyof Card, value: any) => {
    setData((prev) => prev ? ({
      ...prev,
      card: { ...prev.card, [field]: value },
    }) : null)
  }

  const handleContactChange = (field: keyof Card['contatos'], value: string) => {
    setData((prev) => prev ? ({
      ...prev,
      card: {
        ...prev.card,
        contatos: { ...prev.card.contatos, [field]: value },
      },
    }) : null)
  }

  const handleSocialChange = (field: keyof Card['redes_sociais'], value: string) => {
    setData((prev) => prev ? ({
      ...prev,
      card: {
        ...prev.card,
        redes_sociais: { ...prev.card.redes_sociais, [field]: value },
      },
    }) : null)
  }

  const handleCustomizationChange = (field: keyof Card['customizacao'], value: string) => {
    setData((prev) => prev ? ({
      ...prev,
      card: {
        ...prev.card,
        customizacao: { ...prev.card.customizacao, [field]: value },
      },
    }) : null)
  }

  // Specialty handlers
  const addSpecialty = () => {
    if (!newSpecialty.trim() || !data) return
    if (data.card.especialidades.includes(newSpecialty.trim())) return
    setData((prev) => prev ? ({
      ...prev,
      card: {
        ...prev.card,
        especialidades: [...prev.card.especialidades, newSpecialty.trim()],
      },
    }) : null)
    setNewSpecialty('')
  }

  const removeSpecialty = (spec: string) => {
    setData((prev) => prev ? ({
      ...prev,
      card: {
        ...prev.card,
        especialidades: prev.card.especialidades.filter((s) => s !== spec),
      },
    }) : null)
  }

  // Formacao handlers
  const addFormacao = () => {
    if (!newGrau.trim() || !newInst.trim() || !data) return
    setData((prev) => prev ? ({
      ...prev,
      card: {
        ...prev.card,
        formacao: [
          ...prev.card.formacao,
          { grau: newGrau.trim(), instituicao: newInst.trim(), ano: newAno.trim() || undefined },
        ],
      },
    }) : null)
    setNewGrau('')
    setNewInst('')
    setNewAno('')
  }

  const removeFormacao = (idx: number) => {
    setData((prev) => prev ? ({
      ...prev,
      card: {
        ...prev.card,
        formacao: prev.card.formacao.filter((_, i) => i !== idx),
      },
    }) : null)
  }

  // Linktree handlers
  const addLink = () => {
    if (!newLinkLabel.trim() || !newLinkUrl.trim() || !data) return
    const newLink: LinktreeLink = {
      id: `l-new-${Date.now()}`,
      user_id: data.card.user_id,
      label: newLinkLabel.trim(),
      url: newLinkUrl.trim(),
      ativo: true,
      ordem: data.linktree_links.length,
      created_at: new Date().toISOString(),
    }
    setData((prev) => prev ? ({
      ...prev,
      linktree_links: [...prev.linktree_links, newLink],
    }) : null)
    setNewLinkLabel('')
    setNewLinkUrl('')
  }

  const toggleLinkActive = (id: string) => {
    setData((prev) => prev ? ({
      ...prev,
      linktree_links: prev.linktree_links.map((l) => (l.id === id ? { ...l, ativo: !l.ativo } : l)),
    }) : null)
  }

  const deleteLink = (id: string) => {
    setData((prev) => prev ? ({
      ...prev,
      linktree_links: prev.linktree_links.filter((l) => l.id !== id),
    }) : null)
  }

  const tabs = [
    { id: 'basico', label: 'Básico', icon: User },
    { id: 'contatos', label: 'Contatos', icon: Phone },
    { id: 'formacao', label: 'Formação', icon: GraduationCap },
    { id: 'links', label: 'Links', icon: LinkIcon },
    { id: 'badges', label: 'Badges', icon: Shield },
    { id: 'aparencia', label: 'Aparência', icon: Palette },
  ]

  if (isLoading || !data) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Form Editor panel */}
      <div className="flex-1 space-y-6 lg:max-w-xl">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Meu Cartão Profissional</h1>
          <p className="text-text-tertiary text-sm mt-1">
            Personalize seu perfil profissional e atualize suas informações públicas em tempo real.
          </p>
        </div>

        {/* Custom Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-surface-200 border border-white/5">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Forms area */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-6 min-h-[380px]">
          {/* Tab 1: Basico */}
          {activeTab === 'basico' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <User className="h-4 w-4 text-brand-400" />
                Informações Básicas
              </h3>

              {/* Photo upload mock */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 py-2">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl gradient-brand flex items-center justify-center text-white text-xl font-bold shrink-0">
                    {data.card.foto_url ? (
                      <img src={data.card.foto_url} alt="Preview" className="h-full w-full object-cover rounded-xl" />
                    ) : (
                      data.card.nome.split(' ').map((n) => n[0]).join('').slice(0, 2)
                    )}
                  </div>
                  <div className="space-y-1">
                    <button className="glass-button text-xs font-semibold text-brand-300 rounded-lg px-3.5 py-2 flex items-center gap-1.5">
                      <Upload className="h-3.5 w-3.5" />
                      Upload Local
                    </button>
                    <p className="text-[10px] text-text-tertiary">PNG/JPG até 5MB</p>
                  </div>
                </div>

                <div className="flex-1 space-y-1.5">
                  <label className="text-[10px] font-semibold text-text-secondary uppercase">Ou URL da Imagem (Web)</label>
                  <input
                    type="text"
                    placeholder="https://exemplo.com/foto.jpg"
                    value={data.card.foto_url || ''}
                    onChange={(e) => handleBasicChange('foto_url', e.target.value || null)}
                    className="w-full rounded-lg border border-white/8 bg-surface-200/50 px-3 py-2 text-xs text-text-primary outline-none focus:border-brand-500/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-text-secondary">Nome Completo</label>
                <input
                  type="text"
                  value={data.card.nome}
                  onChange={(e) => handleBasicChange('nome', e.target.value)}
                  className="w-full rounded-xl border border-white/8 bg-surface-200/50 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-brand-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-text-secondary">Título / Cargo</label>
                <input
                  type="text"
                  placeholder="Ex: Cardiologista | Perito Médico"
                  value={data.card.titulo || ''}
                  onChange={(e) => handleBasicChange('titulo', e.target.value)}
                  className="w-full rounded-xl border border-white/8 bg-surface-200/50 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-brand-500/50"
                />
              </div>

              {/* Specialties Tag input */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-text-secondary">Especialidades</label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-xl border border-white/8 bg-surface-200/50">
                  {data.card.especialidades.map((spec) => (
                    <span
                      key={spec}
                      className="inline-flex items-center gap-1 rounded-lg bg-brand-500/10 border border-brand-500/20 px-2 py-1 text-xs text-brand-300 font-medium"
                    >
                      {spec}
                      <button
                        onClick={() => removeSpecialty(spec)}
                        className="text-brand-400 hover:text-brand-200"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center flex-1 min-w-[120px]">
                    <input
                      type="text"
                      placeholder="Adicionar..."
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addSpecialty()}
                      className="bg-transparent text-xs text-text-primary outline-none w-full"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-text-tertiary">Pressione Enter para adicionar.</p>
              </div>
            </div>
          )}

          {/* Tab 2: Contatos */}
          {activeTab === 'contatos' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-400" />
                Informações de Contato
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-medium text-text-secondary">Telefone Comercial</label>
                <input
                  type="text"
                  placeholder="(11) 98765-4321"
                  value={data.card.contatos.telefone || ''}
                  onChange={(e) => handleContactChange('telefone', e.target.value)}
                  className="w-full rounded-xl border border-white/8 bg-surface-200/50 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-brand-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-text-secondary">WhatsApp</label>
                <input
                  type="text"
                  placeholder="(11) 98765-4321"
                  value={data.card.contatos.whatsapp || ''}
                  onChange={(e) => handleContactChange('whatsapp', e.target.value)}
                  className="w-full rounded-xl border border-white/8 bg-surface-200/50 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-brand-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-text-secondary">E-mail Público</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={data.card.contatos.email || ''}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  className="w-full rounded-xl border border-white/8 bg-surface-200/50 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-brand-500/50"
                />
              </div>
            </div>
          )}

          {/* Tab 3: Formacao */}
          {activeTab === 'formacao' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-brand-400" />
                Formação Acadêmica
              </h3>

              {/* List of current formations */}
              <ul className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {data.card.formacao.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/[0.04] p-3 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-text-primary">{item.grau}</p>
                      <p className="text-text-tertiary mt-0.5">
                        {item.instituicao}
                        {item.ano && ` · ${item.ano}`}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFormacao(idx)}
                      className="text-error hover:bg-error/15 rounded-lg p-1.5 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>

              {/* Add formacao subform */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-3.5 space-y-3">
                <p className="text-xs font-medium text-text-secondary">Nova Formação</p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Grau / Curso"
                    value={newGrau}
                    onChange={(e) => setNewGrau(e.target.value)}
                    className="w-full rounded-lg border border-white/8 bg-surface-200/50 px-3 py-2 text-xs text-text-primary outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Instituição"
                    value={newInst}
                    onChange={(e) => setNewInst(e.target.value)}
                    className="w-full rounded-lg border border-white/8 bg-surface-200/50 px-3 py-2 text-xs text-text-primary outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ano (opcional)"
                    value={newAno}
                    onChange={(e) => setNewAno(e.target.value)}
                    className="w-full rounded-lg border border-white/8 bg-surface-200/50 px-3 py-2 text-xs text-text-primary outline-none max-w-[120px]"
                  />
                  <button
                    type="button"
                    onClick={addFormacao}
                    className="glass-button text-xs font-semibold text-brand-300 rounded-lg px-4 py-2 flex items-center gap-1 flex-1 justify-center"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Links */}
          {activeTab === 'links' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-brand-400" />
                Redes Sociais & Links
              </h3>

              {/* Redes Sociais */}
              <div className="space-y-3 border-b border-white/[0.06] pb-4">
                <p className="text-xs font-medium text-text-secondary">Redes Sociais</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="relative">
                    <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
                    <input
                      type="text"
                      placeholder="LinkedIn (URL)"
                      value={data.card.redes_sociais.linkedin || ''}
                      onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                      className="w-full rounded-xl border border-white/8 bg-surface-200/50 py-2.5 pl-10 pr-4 text-xs text-text-primary outline-none focus:border-brand-500/50"
                    />
                  </div>
                  <div className="relative">
                    <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
                    <input
                      type="text"
                      placeholder="Instagram (URL)"
                      value={data.card.redes_sociais.instagram || ''}
                      onChange={(e) => handleSocialChange('instagram', e.target.value)}
                      className="w-full rounded-xl border border-white/8 bg-surface-200/50 py-2.5 pl-10 pr-4 text-xs text-text-primary outline-none focus:border-brand-500/50"
                    />
                  </div>
                  <div className="relative">
                    <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
                    <input
                      type="text"
                      placeholder="TikTok (URL)"
                      value={data.card.redes_sociais.tiktok || ''}
                      onChange={(e) => handleSocialChange('tiktok', e.target.value)}
                      className="w-full rounded-xl border border-white/8 bg-surface-200/50 py-2.5 pl-10 pr-4 text-xs text-text-primary outline-none focus:border-brand-500/50"
                    />
                  </div>
                  <div className="relative">
                    <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
                    <input
                      type="text"
                      placeholder="YouTube (URL)"
                      value={data.card.redes_sociais.youtube || ''}
                      onChange={(e) => handleSocialChange('youtube', e.target.value)}
                      className="w-full rounded-xl border border-white/8 bg-surface-200/50 py-2.5 pl-10 pr-4 text-xs text-text-primary outline-none focus:border-brand-500/50"
                    />
                  </div>
                  <div className="relative sm:col-span-2">
                    <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
                    <input
                      type="text"
                      placeholder="Website Pessoal/Clínica (URL)"
                      value={data.card.redes_sociais.site || ''}
                      onChange={(e) => handleSocialChange('site', e.target.value)}
                      className="w-full rounded-xl border border-white/8 bg-surface-200/50 py-2.5 pl-10 pr-4 text-xs text-text-primary outline-none focus:border-brand-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Linktree links */}
              <div className="space-y-3">
                <p className="text-xs font-medium text-text-secondary">Meus Links (Linktree-style)</p>
                <ul className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {data.linktree_links.map((link) => (
                    <li
                      key={link.id}
                      className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/[0.04] p-3 text-xs"
                    >
                      <div className="truncate flex-1 pr-2">
                        <span className="font-semibold text-text-primary block">{link.label}</span>
                        <span className="text-[10px] text-text-tertiary block truncate mt-0.5">
                          {link.url}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleLinkActive(link.id)}
                          className={cn(
                            'rounded-lg px-2 py-1 text-[10px] font-semibold transition-colors',
                            link.ativo
                              ? 'bg-success/15 text-success hover:bg-success/20'
                              : 'bg-white/5 text-text-tertiary hover:bg-white/10'
                          )}
                        >
                          {link.ativo ? 'Ativo' : 'Inativo'}
                        </button>
                        <button
                          onClick={() => deleteLink(link.id)}
                          className="text-error hover:bg-error/15 rounded-lg p-1.5 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Add link form */}
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-3.5 space-y-2.5">
                  <p className="text-xs font-medium text-text-secondary">Novo Link</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Título (Ex: Agendar Consulta)"
                      value={newLinkLabel}
                      onChange={(e) => setNewLinkLabel(e.target.value)}
                      className="w-1/2 rounded-lg border border-white/8 bg-surface-200/50 px-3 py-2 text-xs text-text-primary outline-none"
                    />
                    <input
                      type="text"
                      placeholder="URL (Ex: https://...)"
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      className="w-1/2 rounded-lg border border-white/8 bg-surface-200/50 px-3 py-2 text-xs text-text-primary outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addLink}
                    className="glass-button w-full text-xs font-semibold text-brand-300 rounded-lg py-2 flex items-center justify-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Adicionar Link
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Badges & Competências */}
          {activeTab === 'badges' && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Shield className="h-4 w-4 text-brand-400" />
                Badges & Competências Médicas
              </h3>

              {/* 9 Domínios de Competência */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-text-secondary">9 Domínios de Competência do Médico</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                  {[
                    { label: 'Competência Clínica (15%)', code: 'DOM-CLINIC' },
                    { label: 'Atividade Pericial (15%)', code: 'DOM-EXPERT' },
                    { label: 'Tecnologia & Ferramentas (10%)', code: 'DOM-TECH' },
                    { label: 'Produção Acadêmica (10%)', code: 'DOM-ACADEMIC' },
                    { label: 'Comunicação & Colaboração (10%)', code: 'DOM-COMM' },
                    { label: 'Gestão, Liderança & Sistemas', code: 'DOM-MGMT' },
                    { label: 'Finanças Pessoais & Capital', code: 'DOM-FIN' },
                    { label: 'Bem-estar & Profissionalismo', code: 'DOM-WELL' },
                    { label: 'Networking, Mentoria & Reputação (10%)', code: 'DOM-NET' },
                  ].map((dom) => {
                    const isActive = data.badges.some((b) => b.label === dom.label)
                    return (
                      <button
                        key={dom.code}
                        type="button"
                        onClick={() => togglePresetBadge(dom.label, dom.code)}
                        className={cn(
                          'flex items-center justify-between p-2.5 rounded-xl border text-left transition-all duration-250 text-xs',
                          isActive
                            ? 'bg-brand-500/10 border-brand-500/40 text-brand-300'
                            : 'bg-surface-200/50 border-white/5 text-text-secondary hover:bg-surface-200 hover:text-text-primary'
                        )}
                      >
                        <span className="font-medium">{dom.label}</span>
                        <span className={cn('h-2 w-2 rounded-full', isActive ? 'bg-brand-400' : 'bg-white/10')} />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Competências de Nível Avançado */}
              <div className="space-y-3 pt-3 border-t border-white/[0.06]">
                <p className="text-xs font-semibold text-text-secondary">Competências de Nível Avançado (Badges Premium)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { label: 'Perito Judicial', code: 'EXP-JUDICIAL' },
                    { label: 'Rede Room Sala Vermelha', code: 'EXP-SALAVERMELHA' },
                    { label: 'IA Frontier (Inteligência Artificial)', code: 'EXP-IAFRONTIER' },
                    { label: 'Suporte Avançado de Vida (ACLS)', code: 'EXP-ACLS' },
                  ].map((badge) => {
                    const isActive = data.badges.some((b) => b.label === badge.label)
                    return (
                      <button
                        key={badge.code}
                        type="button"
                        onClick={() => togglePresetBadge(badge.label, badge.code)}
                        className={cn(
                          'flex items-center justify-between p-2.5 rounded-xl border text-left transition-all duration-250 text-xs',
                          isActive
                            ? 'bg-accent-500/10 border-accent-500/40 text-accent-300'
                            : 'bg-surface-200/50 border-white/5 text-text-secondary hover:bg-surface-200 hover:text-text-primary'
                        )}
                      >
                        <span className="font-semibold">{badge.label}</span>
                        <span className={cn('h-2 w-2 rounded-full', isActive ? 'bg-accent-400' : 'bg-white/10')} />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Progresso das Metas dos Badges Ativos */}
              {data.badges.filter(b => b.ativo).length > 0 && (
                <div className="space-y-3 pt-3 border-t border-white/[0.06]">
                  <p className="text-xs font-semibold text-text-secondary flex items-center justify-between">
                    <span>Definir Nível de Meta por Competência (0 a 100%)</span>
                    <span className="text-[10px] text-text-tertiary">Aparece com cores dinâmicas</span>
                  </p>
                  <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
                    {data.badges.filter(b => b.ativo).map((badge) => {
                      const percentage = badge.meta_percentual !== undefined ? badge.meta_percentual : 75
                      const badgeColor = percentage >= 80 ? 'text-success' : percentage >= 40 ? 'text-warning' : 'text-error'

                      return (
                        <div key={badge.id} className="flex flex-col gap-1.5 p-2.5 rounded-xl border border-white/5 bg-surface-200/30">
                          <div className="flex items-center justify-between text-xs font-medium">
                            <span className="text-text-primary truncate max-w-[200px]">{badge.label}</span>
                            <span className={cn('font-mono font-bold', badgeColor)}>{percentage}%</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={percentage}
                              onChange={(e) => handleBadgeProgressChange(badge.id, parseInt(e.target.value))}
                              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-400"
                            />
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={percentage}
                              onChange={(e) => handleBadgeProgressChange(badge.id, Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                              className="w-12 bg-surface-200 border border-white/8 rounded px-1.5 py-0.5 text-[10px] text-center text-text-primary outline-none"
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Aparencia */}
          {activeTab === 'aparencia' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Palette className="h-4 w-4 text-brand-400" />
                Aparência & Customização
              </h3>

              {/* Layout Selector */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-text-secondary flex items-center justify-between">
                  <span>Layout do Cartão</span>
                  <span className="text-[10px] text-text-tertiary">Disponíveis: 6 modelos</span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {['minimalista', 'moderno', 'academico', 'futurista', 'neon', 'corporativo'].map((layoutOption) => {
                    const isLocked = (layoutOption === 'academico' || layoutOption === 'futurista' || layoutOption === 'neon') && isFeatureLocked('medio')
                    const isSelected = data.card.layout === layoutOption

                    return (
                      <button
                        key={layoutOption}
                        onClick={() => !isLocked && handleBasicChange('layout', layoutOption)}
                        className={cn(
                          'relative flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-300 min-h-[50px]',
                          isSelected
                            ? 'bg-brand-500/10 border-brand-500 text-brand-400 shadow-md shadow-brand-500/10'
                            : 'bg-surface-200/50 border-white/5 text-text-secondary hover:bg-surface-200 hover:text-text-primary',
                          isLocked && 'cursor-not-allowed opacity-40'
                        )}
                        disabled={isLocked}
                      >
                        {isLocked && (
                          <div className="absolute top-1 right-1">
                            <Lock className="h-2.5 w-2.5 text-text-tertiary" />
                          </div>
                        )}
                        <span className="text-[11px] font-semibold capitalize">{layoutOption}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Theme Mode Selector */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-text-secondary">Modo do Tema</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'claro', label: 'Claro' },
                    { id: 'escuro', label: 'Escuro' },
                    { id: 'colorido', label: 'Colorido' },
                  ].map((modeOption) => {
                    const isSelected = (data.card.customizacao.tema_modo || 'escuro') === modeOption.id

                    return (
                      <button
                        key={modeOption.id}
                        type="button"
                        onClick={() => handleCustomizationChange('tema_modo', modeOption.id)}
                        className={cn(
                          'flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-300',
                          isSelected
                            ? 'bg-brand-500/10 border-brand-500 text-brand-400 shadow-md shadow-brand-500/10'
                            : 'bg-surface-200/50 border-white/5 text-text-secondary hover:bg-surface-200 hover:text-text-primary'
                        )}
                      >
                        <span className="text-xs font-semibold">{modeOption.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Color Profiles & Customizer (Visible when 'colorido' or custom colors are used) */}
              {data.card.customizacao.tema_modo === 'colorido' && (
                <div className="space-y-3.5 pt-2 border-t border-white/[0.06]">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary">Perfis de Cores</label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[
                        { id: 'safira', name: 'Safira', primary: '#3b82f6', bg: '#0f172a' },
                        { id: 'esmeralda', name: 'Esmeralda', primary: '#10b981', bg: '#064e3b' },
                        { id: 'rubi', name: 'Rubi', primary: '#f43f5e', bg: '#4c0519' },
                        { id: 'ametista', name: 'Ametista', primary: '#a855f7', bg: '#1e1b4b' },
                        { id: 'personalizado', name: 'Personalizado', primary: '', bg: '' }
                      ].map((profile) => {
                        const isPresetMatch = profile.id !== 'personalizado' &&
                          data.card.customizacao.cor_primaria === profile.primary &&
                          data.card.customizacao.cor_fundo === profile.bg

                        const isCustomSelected = profile.id === 'personalizado' &&
                          !['#3b82f6', '#10b981', '#f43f5e', '#a855f7'].includes(data.card.customizacao.cor_primaria || '')

                        const isSelected = isPresetMatch || isCustomSelected

                        return (
                          <button
                            key={profile.id}
                            type="button"
                            onClick={() => {
                              if (profile.id !== 'personalizado') {
                                handleCustomizationChange('cor_primaria', profile.primary)
                                handleCustomizationChange('cor_fundo', profile.bg)
                              }
                            }}
                            className={cn(
                              'flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all duration-200 text-[10px]',
                              isSelected
                                ? 'bg-brand-500/15 border-brand-500 text-brand-300'
                                : 'bg-surface-200/50 border-white/5 text-text-secondary hover:bg-surface-200 hover:text-text-primary'
                            )}
                          >
                            <span className="font-semibold">{profile.name}</span>
                            {profile.id !== 'personalizado' && (
                              <div className="flex gap-1 mt-1">
                                <span className="h-2 w-2 rounded-full border border-white/10" style={{ backgroundColor: profile.primary }} />
                                <span className="h-2 w-2 rounded-full border border-white/10" style={{ backgroundColor: profile.bg }} />
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Manual Inputs with Hex Typing support */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-text-secondary">Cor Primária (Hex/Número)</label>
                      <div className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-surface-200/50 p-1.5">
                        <input
                          type="color"
                          value={data.card.customizacao.cor_primaria || '#6366f1'}
                          onChange={(e) => handleCustomizationChange('cor_primaria', e.target.value)}
                          className="h-7 w-7 rounded cursor-pointer border-none bg-transparent shrink-0"
                        />
                        <input
                          type="text"
                          maxLength={7}
                          value={data.card.customizacao.cor_primaria || ''}
                          onChange={(e) => {
                            let val = e.target.value
                            if (val && !val.startsWith('#')) val = '#' + val
                            handleCustomizationChange('cor_primaria', val)
                          }}
                          placeholder="#6366f1"
                          className="bg-transparent text-xs text-text-primary outline-none font-mono w-full uppercase"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-text-secondary">Cor de Fundo (Hex/Número)</label>
                      <div className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-surface-200/50 p-1.5">
                        <input
                          type="color"
                          value={data.card.customizacao.cor_fundo || '#09090b'}
                          onChange={(e) => handleCustomizationChange('cor_fundo', e.target.value)}
                          className="h-7 w-7 rounded cursor-pointer border-none bg-transparent shrink-0"
                        />
                        <input
                          type="text"
                          maxLength={7}
                          value={data.card.customizacao.cor_fundo || ''}
                          onChange={(e) => {
                            let val = e.target.value
                            if (val && !val.startsWith('#')) val = '#' + val
                            handleCustomizationChange('cor_fundo', val)
                          }}
                          placeholder="#09090b"
                          className="bg-transparent text-xs text-text-primary outline-none font-mono w-full uppercase"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between gap-4">
          <AnimatePresence>
            {savedSuccess && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-success text-xs font-medium flex items-center gap-1"
              >
                <Check className="h-3.5 w-3.5" />
                Alterações salvas com sucesso!
              </motion.span>
            )}
            {errorMessage && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-red-500 text-xs font-medium max-w-xs break-words"
              >
                {errorMessage}
              </motion.span>
            )}
          </AnimatePresence>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="glass-button text-xs font-semibold text-white gradient-brand shadow-md shadow-brand-500/10 rounded-xl px-5 py-3 flex items-center gap-2 ml-auto"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Salvando...
              </span>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Preview Panel */}
      <div className="flex-1 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-white/[0.06] pt-8 lg:pt-0 lg:pl-8">
        <div className="sticky top-8 w-full max-w-sm flex flex-col items-center gap-5">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              Visualização Interativa
            </span>

            <div className="flex items-center gap-2">
              <a
                href={`/p/${data.profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button text-xs font-semibold rounded-lg px-3 py-1.5 text-accent-400 flex items-center gap-1.5 hover:text-accent-300"
              >
                <Globe className="h-3.5 w-3.5" />
                Visualizar Público
              </a>
              <button
                onClick={() => setShowPreviewBack(!showPreviewBack)}
                className="glass-button text-xs font-semibold rounded-lg px-3 py-1.5 text-brand-300"
              >
                Girar Cartão
              </button>
            </div>
          </div>

          {/* Interactive Card container */}
          <div className="relative w-full aspect-[2/3] max-w-md min-h-[580px] card-scene">
            <motion.div
              animate={{ rotateY: showPreviewBack ? 180 : 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full card-flipper"
            >
              {/* Front Face */}
              <div
                className="absolute inset-0 w-full h-full card-face"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <CardFront data={data} />
              </div>

              {/* Back Face */}
              <div
                className="absolute inset-0 w-full h-full card-face card-face-back"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <CardBack data={data} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
