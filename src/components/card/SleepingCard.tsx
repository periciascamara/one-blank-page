'use client'

import { motion } from 'framer-motion'
import { Moon, Clock } from 'lucide-react'

interface SleepingCardProps {
  nome?: string
}

export function SleepingCard({ nome }: SleepingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-sm"
    >
      <div className="glass-card rounded-2xl p-8 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-brand-500/5 blur-3xl" />
          <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-accent-500/5 blur-2xl" />
        </div>

        {/* Content */}
        <div className="relative flex flex-col items-center gap-6">
          {/* Moon icon with floating animation */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-full gradient-brand opacity-10 blur-xl" />
            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-brand-500/10 border border-brand-500/20">
              <Moon className="h-10 w-10 text-brand-400" />
            </div>
          </motion.div>

          {/* Text */}
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-text-primary">
              Perfil em manutenção
            </h1>
            {nome && (
              <p className="text-sm text-text-secondary">
                O perfil de <span className="font-medium text-text-primary">{nome}</span> está temporariamente indisponível.
              </p>
            )}
          </div>

          {/* Subtitle */}
          <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-2.5">
            <Clock className="h-4 w-4 text-accent-400" />
            <span className="text-sm text-text-secondary">Volte em breve</span>
          </div>

          {/* Decorative dots */}
          <div className="flex items-center gap-1.5 pt-2">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
              className="w-1.5 h-1.5 rounded-full bg-brand-400"
            />
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              className="w-1.5 h-1.5 rounded-full bg-brand-400"
            />
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
              className="w-1.5 h-1.5 rounded-full bg-brand-400"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
