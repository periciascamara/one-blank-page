'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [lgpdConsent, setLgpdConsent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword
  const passwordTooShort = password.length > 0 && password.length < 6

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('As senhas não coincidem. Verifique e tente novamente.')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    if (!lgpdConsent) {
      setError('Você precisa concordar com a Política de Privacidade para continuar.')
      return
    }

    setIsLoading(true)

    const supabase = createClient()

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (signUpError) {
      setIsLoading(false)
      if (signUpError.message.includes('already registered')) {
        setError('Este e-mail já está cadastrado. Tente fazer login ou recupere sua senha.')
      } else {
        setError('Ocorreu um erro ao criar sua conta. Tente novamente em instantes.')
      }
      return
    }

    setIsLoading(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center text-center"
      >
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl gradient-brand shadow-lg shadow-brand-500/25">
          <CheckCircle2 className="h-8 w-8 text-white" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-text-primary">
          Conta criada com sucesso!
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-text-secondary">
          Enviamos um e-mail de verificação para{' '}
          <span className="font-medium text-brand-400">{email}</span>. Verifique
          sua caixa de entrada (e spam) para ativar sua conta.
        </p>
        <Link
          href="/login"
          className={cn(
            'w-full rounded-xl py-3 text-center text-sm font-semibold text-white transition-all duration-300',
            'gradient-brand shadow-lg shadow-brand-500/25',
            'hover:shadow-xl hover:shadow-brand-500/30 hover:brightness-110',
            'active:scale-[0.98]',
            'inline-block'
          )}
        >
          Ir para o login
        </Link>
      </motion.div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <motion.h2
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-2xl font-bold text-text-primary"
        >
          Crie sua conta
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-1.5 text-sm text-text-secondary"
        >
          Comece a montar seu cartão digital profissional
        </motion.p>
      </div>

      {/* Error toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 overflow-hidden"
          >
            <div className="flex items-start gap-3 rounded-xl border border-error/20 bg-error/5 px-4 py-3.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-error" />
              <p className="text-sm leading-snug text-error">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* Nome */}
        <div className="space-y-2">
          <label htmlFor="nome" className="block text-sm font-medium text-text-secondary">
            Nome completo
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
            <input
              id="nome"
              type="text"
              required
              autoComplete="name"
              placeholder="Dr. João Silva"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={isLoading}
              className={cn(
                'w-full rounded-xl border bg-surface-200/50 py-3 pl-10 pr-4 text-sm text-text-primary placeholder-text-tertiary',
                'border-white/8 outline-none transition-all duration-200',
                'focus:border-brand-500/50 focus:bg-surface-200/80 focus:ring-2 focus:ring-brand-500/20',
                'disabled:cursor-not-allowed disabled:opacity-60'
              )}
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-text-secondary">
            E-mail
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className={cn(
                'w-full rounded-xl border bg-surface-200/50 py-3 pl-10 pr-4 text-sm text-text-primary placeholder-text-tertiary',
                'border-white/8 outline-none transition-all duration-200',
                'focus:border-brand-500/50 focus:bg-surface-200/80 focus:ring-2 focus:ring-brand-500/20',
                'disabled:cursor-not-allowed disabled:opacity-60'
              )}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
            Senha
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className={cn(
                'w-full rounded-xl border bg-surface-200/50 py-3 pl-10 pr-11 text-sm text-text-primary placeholder-text-tertiary',
                'border-white/8 outline-none transition-all duration-200',
                'focus:border-brand-500/50 focus:bg-surface-200/80 focus:ring-2 focus:ring-brand-500/20',
                'disabled:cursor-not-allowed disabled:opacity-60',
                passwordTooShort && 'border-warning/40 focus:border-warning/60 focus:ring-warning/20'
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-tertiary transition-colors hover:text-text-secondary"
              tabIndex={-1}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {passwordTooShort && (
            <p className="text-xs text-warning">A senha deve ter pelo menos 6 caracteres.</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary">
            Confirmar senha
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              placeholder="Repita sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              className={cn(
                'w-full rounded-xl border bg-surface-200/50 py-3 pl-10 pr-11 text-sm text-text-primary placeholder-text-tertiary',
                'border-white/8 outline-none transition-all duration-200',
                'focus:border-brand-500/50 focus:bg-surface-200/80 focus:ring-2 focus:ring-brand-500/20',
                'disabled:cursor-not-allowed disabled:opacity-60',
                confirmPassword.length > 0 && !passwordsMatch && 'border-error/40 focus:border-error/60 focus:ring-error/20',
                passwordsMatch && 'border-success/40 focus:border-success/60 focus:ring-success/20'
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-tertiary transition-colors hover:text-text-secondary"
              tabIndex={-1}
              aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="text-xs text-error">As senhas não coincidem.</p>
          )}
        </div>

        {/* LGPD consent */}
        <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-surface-200/30 p-4">
          <div className="relative mt-0.5 flex items-center">
            <input
              id="lgpd"
              type="checkbox"
              checked={lgpdConsent}
              onChange={(e) => setLgpdConsent(e.target.checked)}
              disabled={isLoading}
              className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-white/15 bg-surface-300 transition-all checked:border-brand-500 checked:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <CheckCircle2 className="pointer-events-none absolute left-0 h-4 w-4 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
          </div>
          <label htmlFor="lgpd" className="cursor-pointer text-xs leading-relaxed text-text-secondary">
            <ShieldCheck className="mr-1 inline-block h-3.5 w-3.5 text-accent-500" />
            Li e concordo com a{' '}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-400 underline underline-offset-2 transition-colors hover:text-brand-300"
            >
              Política de Privacidade
            </a>{' '}
            e os{' '}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-400 underline underline-offset-2 transition-colors hover:text-brand-300"
            >
              Termos de Uso
            </a>
            , em conformidade com a LGPD.
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !lgpdConsent}
          className={cn(
            'relative w-full overflow-hidden rounded-xl py-3 text-sm font-semibold text-white transition-all duration-300',
            'gradient-brand shadow-lg shadow-brand-500/25',
            'hover:shadow-xl hover:shadow-brand-500/30 hover:brightness-110',
            'active:scale-[0.98]',
            'disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:brightness-100'
          )}
        >
          <span className={cn('flex items-center justify-center gap-2', isLoading && 'invisible')}>
            Criar conta
          </span>
          {isLoading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin" />
            </span>
          )}
        </button>
      </motion.form>

      {/* Footer link */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="mt-8 text-center text-sm text-text-secondary"
      >
        Já tem uma conta?{' '}
        <Link
          href="/login"
          className="font-semibold text-brand-400 transition-colors hover:text-brand-300"
        >
          Fazer login
        </Link>
      </motion.p>
    </>
  )
}
