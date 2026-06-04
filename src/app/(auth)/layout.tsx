'use client'

import { motion } from 'framer-motion'
import { Stethoscope } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full bg-surface-0">
      {/* ── Left branded panel ── */}
      <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:items-center lg:justify-center">
        {/* Layered background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-surface-100 to-surface-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(99,102,241,0.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(20,184,166,0.15),transparent_50%)]" />

        {/* Decorative floating orbs */}
        <div className="absolute left-[15%] top-[20%] h-64 w-64 animate-float rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute bottom-[15%] right-[10%] h-80 w-80 animate-float rounded-full bg-accent-500/8 blur-3xl [animation-delay:3s]" />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex max-w-md flex-col items-center px-12 text-center"
        >
          {/* Logo */}
          <Link href="/" className="group mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-brand shadow-lg shadow-brand-500/25 transition-transform duration-300 group-hover:scale-105">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-text-primary">
              One Blank Page
            </span>
          </Link>

          {/* Tagline */}
          <h1 className="mb-4 text-3xl font-bold leading-tight text-text-primary">
            Seu cartão digital
            <span className="block gradient-brand-text">profissional</span>
          </h1>

          <p className="mb-8 text-base leading-relaxed text-text-secondary">
            Centralize contatos, portfólio, certificações e redes sociais em um
            único perfil verificável. Ideal para médicos e profissionais de
            saúde.
          </p>

          {/* Decorative feature pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {['QR Code', 'NFC', 'Link único', 'Verificável'].map(
              (feature, i) => (
                <motion.span
                  key={feature}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                  className="rounded-full border border-white/8 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-text-secondary backdrop-blur-sm"
                >
                  {feature}
                </motion.span>
              )
            )}
          </div>
        </motion.div>

        {/* Bottom attribution */}
        <div className="absolute bottom-8 z-10">
          <p className="text-xs text-text-tertiary">
            © {new Date().getFullYear()} Editora Viva. Todos os direitos
            reservados.
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="relative flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        {/* Subtle glow behind form */}
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/5 blur-3xl" />

        {/* Mobile-only logo */}
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand shadow-lg shadow-brand-500/25">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-text-primary">
              One Blank Page
            </span>
          </Link>
        </div>

        {/* Form container with glass card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-[440px]"
        >
          <div className="glass-card rounded-2xl p-8 sm:p-10">{children}</div>
        </motion.div>
      </div>
    </div>
  )
}
