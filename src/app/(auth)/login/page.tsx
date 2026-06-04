'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const supabase = createClient()

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setIsLoading(false)
      if (signInError.message === 'Invalid login credentials') {
        setError('E-mail ou senha incorretos. Verifique seus dados e tente novamente.')
      } else if (signInError.message === 'Email not confirmed') {
        setError('Seu e-mail ainda não foi verificado. Verifique sua caixa de entrada.')
      } else {
        setError('Ocorreu um erro ao fazer login. Tente novamente em instantes.')
      }
      return
    }

    router.push('/dashboard')
    router.refresh()
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
          Bem-vindo de volta
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-1.5 text-sm text-text-secondary"
        >
          Acesse sua conta para gerenciar seu cartão digital
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
        className="space-y-5"
      >
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
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
              Senha
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-brand-400 transition-colors hover:text-brand-300"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className={cn(
                'w-full rounded-xl border bg-surface-200/50 py-3 pl-10 pr-11 text-sm text-text-primary placeholder-text-tertiary',
                'border-white/8 outline-none transition-all duration-200',
                'focus:border-brand-500/50 focus:bg-surface-200/80 focus:ring-2 focus:ring-brand-500/20',
                'disabled:cursor-not-allowed disabled:opacity-60'
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
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'relative w-full overflow-hidden rounded-xl py-3 text-sm font-semibold text-white transition-all duration-300',
            'gradient-brand shadow-lg shadow-brand-500/25',
            'hover:shadow-xl hover:shadow-brand-500/30 hover:brightness-110',
            'active:scale-[0.98]',
            'disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:brightness-100'
          )}
        >
          <span className={cn('flex items-center justify-center gap-2', isLoading && 'invisible')}>
            Entrar
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
        Não tem uma conta?{' '}
        <Link
          href="/register"
          className="font-semibold text-brand-400 transition-colors hover:text-brand-300"
        >
          Criar conta
        </Link>
      </motion.p>
    </>
  )
}
