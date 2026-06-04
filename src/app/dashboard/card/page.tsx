'use client'

import { useState } from 'react'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CardFront } from '@/components/card/CardFront'
import { CardBack } from '@/components/card/CardBack'
import type { Card, Badge, LinktreeLink, PublicCardData, PlanoEnum, StatusEnum } from '@/lib/types/database'

// Mock initial data
const mockInitialData: PublicCardData = {
  profile: {
    username: 'dr-rafael-moraes',
    plano: 'medio' as PlanoEnum,
  },
  card: {
    id: 'card-1',
    user_id: 'user-1',
    nome: 'Dr. Rafael Moraes',
    titulo: 'Cardiologista | Perito Médico',
    foto_url: null,
    status: 'ativo' as StatusEnum,
    especialidades: ['Cardiologia', 'Perícia Médica'],
    formacao: [
      { grau: 'Medicina', instituicao: 'USP', ano: '2016' },
      { grau: 'Residência em Cardiologia', instituicao: 'InCor USP', ano: '2019' },
    ],
    contatos: {
      telefone: '(11) 98765-4321',
      whatsapp: '(11) 98765-4321',
      email: 'rafael@exemplo.com',
    },
    redes_sociais: {
      linkedin: 'https://linkedin.com/in/dr-rafael-moraes',
      instagram: 'https://instagram.com/dr-rafael-moraes',
    },
    layout: 'moderno',
    customizacao: {
      cor_primaria: '#6366f1',
      cor_fundo: '#09090b',
    },
    nfc_ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  },
  badges: [
    { id: '1', user_id: 'user-1', label: 'CRM Ativo SP 123456', codigo: 'crm', ativo: true, created_at: '' },
    { id: '2', user_id: 'user-1', label: 'RQE Registro de Especialista', codigo: 'rqe', ativo: true, created_at: '' },
  ],
  linktree_links: [
    { id: 'l1', user_id: 'user-1', label: 'Agendar Consulta (Doctoralia)', url: 'https://doctoralia.com.br', ativo: true, ordem: 0, created_at: '' },
    { id: 'l2', user_id: 'user-1', label: 'Artigos Publicados', url: 'https://pubmed.ncbi.nlm.nih.gov', ativo: true, ordem: 1, created_at: '' },
  ],
  portfolio_links: [],
}

type TabType = 'basico' | 'contatos' | 'formacao' | 'links' | 'aparencia'

export default function CardEditorPage() {
  const [activeTab, setActiveTab] = useState<TabType>('basico')
  const [data, setData] = useState<PublicCardData>(mockInitialData)
  const [showPreviewBack, setShowPreviewBack] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Specialty Tag Input State
  const [newSpecialty, setNewSpecialty] = useState('')

  // Linktree Edit State
  const [newLinkLabel, setNewLinkLabel] = useState('')
  const [newLinkUrl, setNewLinkUrl] = useState('')

  // Formacao Edit State
  const [newGrau, setNewGrau] = useState('')
  const [newInst, setNewInst] = useState('')
  const [newAno, setNewAno] = useState('')

  const userPlan = data.profile.plano

  const isFeatureLocked = (featurePlan: PlanoEnum) => {
    if (userPlan === 'completo') return false
    if (userPlan === 'medio' && featurePlan !== 'completo') return false
    if (userPlan === 'simples' && featurePlan === 'simples') return false
    return true
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 2000)
    }, 1000)
  }

  const handleBasicChange = (field: keyof Card, value: any) => {
    setData((prev) => ({
      ...prev,
      card: { ...prev.card, [field]: value },
    }))
  }

  const handleContactChange = (field: keyof Card['contatos'], value: string) => {
    setData((prev) => ({
      ...prev,
      card: {
        ...prev.card,
        contatos: { ...prev.card.contatos, [field]: value },
      },
    }))
  }

  const handleSocialChange = (field: keyof Card['redes_sociais'], value: string) => {
    setData((prev) => ({
      ...prev,
      card: {
        ...prev.card,
        redes_sociais: { ...prev.card.redes_sociais, [field]: value },
      },
    }))
  }

  const handleCustomizationChange = (field: keyof Card['customizacao'], value: string) => {
    setData((prev) => ({
      ...prev,
      card: {
        ...prev.card,
        customizacao: { ...prev.card.customizacao, [field]: value },
      },
    }))
  }

  // Specialty handlers
  const addSpecialty = () => {
    if (!newSpecialty.trim()) return
    if (data.card.especialidades.includes(newSpecialty.trim())) return
    setData((prev) => ({
      ...prev,
      card: {
        ...prev.card,
        especialidades: [...prev.card.especialidades, newSpecialty.trim()],
      },
    }))
    setNewSpecialty('')
  }

  const removeSpecialty = (spec: string) => {
    setData((prev) => ({
      ...prev,
      card: {
        ...prev.card,
        especialidades: prev.card.especialidades.filter((s) => s !== spec),
      },
    }))
  }

  // Formacao handlers
  const addFormacao = () => {
    if (!newGrau.trim() || !newInst.trim()) return
    setData((prev) => ({
      ...prev,
      card: {
        ...prev.card,
        formacao: [
          ...prev.card.formacao,
          { grau: newGrau.trim(), instituicao: newInst.trim(), ano: newAno.trim() || undefined },
        ],
      },
    }))
    setNewGrau('')
    setNewInst('')
    setNewAno('')
  }

  const removeFormacao = (idx: number) => {
    setData((prev) => ({
      ...prev,
      card: {
        ...prev.card,
        formacao: prev.card.formacao.filter((_, i) => i !== idx),
      },
    }))
  }

  // Linktree handlers
  const addLink = () => {
    if (!newLinkLabel.trim() || !newLinkUrl.trim()) return
    const newLink: LinktreeLink = {
      id: `l-new-${Date.now()}`,
      user_id: data.card.user_id,
      label: newLinkLabel.trim(),
      url: newLinkUrl.trim(),
      ativo: true,
      ordem: data.linktree_links.length,
      created_at: new Date().toISOString(),
    }
    setData((prev) => ({
      ...prev,
      linktree_links: [...prev.linktree_links, newLink],
    }))
    setNewLinkLabel('')
    setNewLinkUrl('')
  }

  const toggleLinkActive = (id: string) => {
    setData((prev) => ({
      ...prev,
      linktree_links: prev.linktree_links.map((l) => (l.id === id ? { ...l, ativo: !l.ativo } : l)),
    }))
  }

  const deleteLink = (id: string) => {
    setData((prev) => ({
      ...prev,
      linktree_links: prev.linktree_links.filter((l) => l.id !== id),
    }))
  }

  const tabs = [
    { id: 'basico', label: 'Básico', icon: User },
    { id: 'contatos', label: 'Contatos', icon: Phone },
    { id: 'formacao', label: 'Formação', icon: GraduationCap },
    { id: 'links', label: 'Links', icon: LinkIcon },
    { id: 'aparencia', label: 'Aparência', icon: Palette },
  ]

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
              <div className="flex items-center gap-4 py-2">
                <div className="h-16 w-16 rounded-xl gradient-brand flex items-center justify-center text-white text-xl font-bold">
                  {data.card.nome.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="space-y-1">
                  <button className="glass-button text-xs font-semibold text-brand-300 rounded-lg px-3.5 py-2 flex items-center gap-1.5">
                    <Upload className="h-3.5 w-3.5" />
                    Alterar Foto
                  </button>
                  <p className="text-[10px] text-text-tertiary">PNG ou JPG até 5MB</p>
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
                <div className="grid grid-cols-1 gap-2.5">
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

          {/* Tab 5: Aparencia */}
          {activeTab === 'aparencia' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Palette className="h-4 w-4 text-brand-400" />
                Aparência & Customização
              </h3>

              {/* Layout Selector */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-text-secondary">Tema do Layout</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {['minimalista', 'moderno', 'academico'].map((layoutOption) => {
                    const isLocked = layoutOption === 'academico' && isFeatureLocked('medio')
                    const isSelected = data.card.layout === layoutOption

                    return (
                      <button
                        key={layoutOption}
                        onClick={() => !isLocked && handleBasicChange('layout', layoutOption)}
                        className={cn(
                          'relative flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-300',
                          isSelected
                            ? 'bg-brand-500/10 border-brand-500 text-brand-400 shadow-md shadow-brand-500/10'
                            : 'bg-surface-200/50 border-white/5 text-text-secondary hover:bg-surface-200 hover:text-text-primary',
                          isLocked && 'cursor-not-allowed opacity-40'
                        )}
                        disabled={isLocked}
                      >
                        {isLocked && (
                          <div className="absolute top-1 right-1">
                            <Lock className="h-3 w-3 text-text-tertiary" />
                          </div>
                        )}
                        <span className="text-xs font-semibold capitalize">{layoutOption}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Color Customizations */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-text-secondary">Cor Primária</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={data.card.customizacao.cor_primaria || '#6366f1'}
                      onChange={(e) => handleCustomizationChange('cor_primaria', e.target.value)}
                      className="h-8 w-8 rounded cursor-pointer border-none bg-transparent"
                    />
                    <span className="text-xs text-text-primary font-mono uppercase">
                      {data.card.customizacao.cor_primaria}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-text-secondary">Cor de Fundo</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={data.card.customizacao.cor_fundo || '#09090b'}
                      onChange={(e) => handleCustomizationChange('cor_fundo', e.target.value)}
                      className="h-8 w-8 rounded cursor-pointer border-none bg-transparent"
                    />
                    <span className="text-xs text-text-primary font-mono uppercase">
                      {data.card.customizacao.cor_fundo}
                    </span>
                  </div>
                </div>
              </div>
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

            <button
              onClick={() => setShowPreviewBack(!showPreviewBack)}
              className="glass-button text-xs font-semibold rounded-lg px-3 py-1.5 text-brand-300"
            >
              Girar Cartão
            </button>
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
