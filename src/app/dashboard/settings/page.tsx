'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Lock,
  Eye,
  AlertTriangle,
  ShieldAlert,
  Loader2,
  Check,
  ToggleLeft,
  ToggleRight,
  Shield,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const [accountInfo, setAccountInfo] = useState<{nome: string, email: string, plano: string} | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false)

  // Card status
  const [cardStatus, setCardStatus] = useState<'ativo' | 'dormindo' | 'apagado'>('ativo')

  // Privacy toggles
  const [showEmailOnCard, setShowEmailOnCard] = useState(true)
  const [lgpdConsent, setLgpdConsent] = useState(true)

  // Danger zone modals
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient() as any
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = (await supabase.from('profiles').select('*').eq('id', user.id).single()) as { data: any | null }
        if (profile) {
          setAccountInfo({
            nome: profile.nome || user.email?.split('@')[0] || '',
            email: user.email || '',
            plano: profile.plano || 'simples'
          })

          const { data: card } = (await supabase.from('cards').select('status').eq('user_id', profile.id).maybeSingle()) as { data: any | null }
          if (card && card.status) {
            setCardStatus(card.status)
          }
        }
      } catch (err) {
        console.error('Error loading settings', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) return
    setIsChangingPassword(true)

    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient() as any
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setPasswordChangeSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordChangeSuccess(false), 2000)
    } catch (err) {
      console.error(err)
      alert('Erro ao alterar senha. Verifique se a senha atual está correta.')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmationInput !== 'EXCLUIR') return
    setIsDeleting(true)
    
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient() as any
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Apenas marca o cartão como apagado, para evitar quebra de integridade
        await supabase.from('cards').update({ status: 'apagado' }).eq('user_id', user.id)
        alert('Cartão desativado permanentemente. Para exclusão total dos dados, entre em contato com o suporte.')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
      setDeleteConfirmationInput('')
    }
  }

  const handleStatusChange = async (newStatus: 'ativo' | 'dormindo' | 'apagado') => {
    setCardStatus(newStatus)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient() as any
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('cards').update({ status: newStatus }).eq('user_id', user.id)
      }
    } catch (err) {}
  }

  if (isLoading || !accountInfo) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Configurações da Conta</h1>
        <p className="text-text-tertiary text-sm mt-1">
          Gerencie suas preferências de privacidade, segurança, status do cartão e dados da conta.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation / Overview sidebar for settings */}
        <div className="md:col-span-1 space-y-4">
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full gradient-brand flex items-center justify-center text-white text-sm font-bold uppercase">
                {accountInfo.nome.substring(0, 2)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary truncate max-w-[150px]">{accountInfo.nome}</h3>
                <p className="text-[11px] text-text-tertiary truncate max-w-[150px]">{accountInfo.email}</p>
              </div>
            </div>
            <div className="border-t border-white/[0.06] pt-3 flex items-center justify-between text-xs text-text-secondary">
              <span>Plano Atual:</span>
              <span className="font-semibold text-brand-400 capitalize">{accountInfo.plano}</span>
            </div>
          </div>
        </div>

        {/* Settings details panel */}
        <div className="md:col-span-2 space-y-6">
          {/* Informações da conta */}
          <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <User className="h-4 w-4 text-brand-400" />
              Informações da Conta
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-text-tertiary">Nome Completo</span>
                <input
                  type="text"
                  value={accountInfo.nome}
                  readOnly
                  className="w-full rounded-xl border border-white/5 bg-surface-200/30 px-3 py-2 text-xs text-text-secondary outline-none cursor-not-allowed"
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-text-tertiary">E-mail Cadastrado</span>
                <input
                  type="text"
                  value={accountInfo.email}
                  readOnly
                  className="w-full rounded-xl border border-white/5 bg-surface-200/30 px-3 py-2 text-xs text-text-secondary outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Segurança / Alterar Senha */}
          <form onSubmit={handlePasswordChange} className="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Lock className="h-4 w-4 text-brand-400" />
              Alterar Senha
            </h3>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-text-secondary">Senha Atual</span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/8 bg-surface-200/50 px-3.5 py-2 text-xs text-text-primary outline-none focus:border-brand-500/50"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-medium text-text-secondary">Nova Senha</span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/8 bg-surface-200/50 px-3.5 py-2 text-xs text-text-primary outline-none focus:border-brand-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[11px] font-medium text-text-secondary">Confirmar Nova Senha</span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/8 bg-surface-200/50 px-3.5 py-2 text-xs text-text-primary outline-none focus:border-brand-500/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <AnimatePresence>
                {passwordChangeSuccess && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-success text-xs font-medium flex items-center gap-1"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Senha alterada com sucesso!
                  </motion.span>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="glass-button text-xs font-semibold text-brand-300 rounded-xl px-4 py-2.5 ml-auto flex items-center gap-1.5"
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Alterando...
                  </>
                ) : (
                  'Salvar Nova Senha'
                )}
              </button>
            </div>
          </form>

          {/* Status do Cartão */}
          <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Eye className="h-4 w-4 text-brand-400" />
              Visibilidade do Cartão
            </h3>

            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'ativo', label: 'Ativo / Público', desc: 'Disponível online', color: 'text-success' },
                { id: 'dormindo', label: 'Manutenção', desc: 'Em manutenção', color: 'text-warning' },
                { id: 'apagado', label: 'Inativo', desc: 'Desativado', color: 'text-error' },
              ].map((statusOption) => {
                const isSelected = cardStatus === statusOption.id
                return (
                  <button
                    key={statusOption.id}
                    onClick={() => handleStatusChange(statusOption.id as any)}
                    className={cn(
                      'flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-300',
                      isSelected
                        ? 'bg-surface-200/80 border-brand-500 text-brand-400 shadow-md shadow-brand-500/5'
                        : 'bg-surface-200/30 border-white/5 text-text-secondary hover:bg-surface-200/50 hover:text-text-primary'
                    )}
                  >
                    <span className={cn('text-xs font-bold capitalize', statusOption.color)}>
                      {statusOption.label}
                    </span>
                    <span className="text-[9px] text-text-tertiary mt-0.5">{statusOption.desc}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Privacidade & LGPD */}
          <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Shield className="h-4 w-4 text-brand-400" />
              Privacidade & Consentimentos LGPD
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-text-primary">Exibir E-mail no perfil</h4>
                  <p className="text-[10px] text-text-tertiary mt-0.5">
                    Permite que visitantes vejam seu e-mail de contato no cartão público.
                  </p>
                </div>
                <button onClick={() => setShowEmailOnCard(!showEmailOnCard)} className="text-text-primary">
                  {showEmailOnCard ? (
                    <ToggleRight className="h-6 w-6 text-brand-500" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-text-tertiary" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-text-primary">Termo de LGPD de Saúde</h4>
                  <p className="text-[10px] text-text-tertiary mt-0.5">
                    Mantém a conformidade com o tratamento de informações profissionais de saúde.
                  </p>
                </div>
                <button onClick={() => setLgpdConsent(!lgpdConsent)} className="text-text-primary">
                  {lgpdConsent ? (
                    <ToggleRight className="h-6 w-6 text-brand-500" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-text-tertiary" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Zona de perigo */}
          <div className="rounded-2xl border border-error/25 bg-error/5 p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-semibold text-error flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-error" />
              Zona de Perigo
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Excluir sua conta removerá permanentemente seu cartão digital, QR codes, estatísticas e todos os dados associados. Esta ação não poderá ser desfeita.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="rounded-xl bg-error/15 border border-error/25 text-error font-semibold text-xs px-4 py-2.5 hover:bg-error/25 transition-colors"
            >
              Excluir Conta Permanentemente
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card max-w-md w-full rounded-2xl p-6 border-error/20 bg-surface-100 shadow-2xl relative"
            >
              <div className="flex items-center gap-3 text-error mb-4">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="text-base font-bold">Excluir Conta Permanentemente?</h3>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed mb-5">
                Para confirmar a exclusão definitiva, digite a palavra <strong className="text-text-primary">EXCLUIR</strong> no campo abaixo:
              </p>

              <input
                type="text"
                placeholder="EXCLUIR"
                value={deleteConfirmationInput}
                onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                className="w-full rounded-xl border border-error/20 bg-error/5 px-4 py-2.5 text-sm text-text-primary outline-none placeholder-error/30 mb-6"
              />

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeleteConfirmationInput('')
                  }}
                  className="rounded-xl bg-white/5 border border-white/5 text-text-secondary font-semibold text-xs px-4 py-2.5 hover:bg-white/10"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmationInput !== 'EXCLUIR' || isDeleting}
                  className="rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold text-xs px-5 py-2.5 hover:brightness-110 shadow-lg shadow-red-600/15 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
