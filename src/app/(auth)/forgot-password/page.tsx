'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Loader2, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const supabase = createClient()

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/settings`,
    })

    if (resetError) {
      setIsLoading(false)
      setError(resetError.message || 'Ocorreu um erro ao enviar o e-mail de recuperação.')
      return
    }

    setIsLoading(false)
    setIsSuccess(true)
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-text-tertiary transition-colors hover:text-text-secondary mb-4"
        >
          <ArrowLeft className="h-3 w-3" />
          Voltar para login
        </Link>
        <motion.h2
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-2xl font-bold text-text-primary"
        >
          Recuperar senha
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-1.5 text-sm text-text-secondary"
        >
          Digite seu e-mail cadastrado e enviaremos um link para redefinir sua senha.
        </motion.p>
      </div>

      {/* Success state */}
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-success/20 bg-success/5 p-5 text-center space-y-4"
          >
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-success/15 text-success">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-text-primary">E-mail enviado!</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Se este e-mail estiver cadastrado na plataforma, você receberá um link de redefinição de senha em instantes.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-block w-full rounded-xl bg-surface-200 border border-white/5 py-2.5 text-xs font-semibold text-text-primary hover:bg-surface-300 transition-colors"
            >
              Voltar ao Login
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-5">
            {/* Error toast */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
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
                  Enviar link
                </span>
                {isLoading && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </span>
                )}
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
