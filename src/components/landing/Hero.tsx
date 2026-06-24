'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center bg-no-repeat opacity-30"
        />
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/15 rounded-full blur-[120px] animate-float mix-blend-screen" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent-500/15 rounded-full blur-[100px] animate-float mix-blend-screen" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-brand-700/10 rounded-full blur-[80px] animate-float mix-blend-screen" style={{ animationDelay: '1.5s' }} />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-sm text-text-secondary mb-8"
        >
          <Sparkles className="w-4 h-4 text-accent-400" />
          <span>Plataforma para profissionais de saúde</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
        >
          <span className="text-text-primary">Seu cartão de carreira</span>
          <br />
          <span className="gradient-brand-text">digital e verificável</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
        >
          Centralize contatos, portfólio, certificações CRM e redes sociais
          em um único link profissional. QR Code, NFC e muito mais.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/register"
            className="group flex items-center gap-2 px-8 py-4 text-base font-semibold text-white gradient-brand rounded-2xl shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.03] transition-all active:scale-[0.98]"
          >
            Cadastrar Currículo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 px-8 py-4 text-base font-medium text-text-secondary glass-button rounded-2xl"
          >
            Entrar na Dashboard
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 flex items-center justify-center gap-8 text-text-tertiary text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span>100% Gratuito para começar</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-surface-400" />
          <div className="hidden sm:flex items-center gap-2">
            <span>✓ QR Code em alta resolução</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-surface-400" />
          <div className="hidden md:flex items-center gap-2">
            <span>✓ Compatível com NFC</span>
          </div>
        </motion.div>

        {/* Card Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-20 max-w-sm mx-auto"
        >
          <div className="relative">
            {/* Glow effect behind card */}
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/20 via-accent-500/20 to-brand-500/20 rounded-3xl blur-2xl opacity-60 animate-pulse-glow" />

            {/* Card mockup */}
            <div className="relative glass-card rounded-2xl p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/30">
                  RM
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-text-primary">Dr. Rafael Moraes</h3>
                  <p className="text-sm text-text-secondary">Perito Médico Judicial</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-accent-500/15 text-accent-400 border border-accent-500/20">
                  CRM/SP 123456
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-brand-500/15 text-brand-400 border border-brand-500/20">
                  Perito Certificado
                </span>
              </div>

              {/* Contact buttons mockup */}
              <div className="flex gap-2">
                <div className="flex-1 py-2.5 rounded-xl bg-white/5 text-center text-xs text-text-secondary border border-white/5">
                  📞 Telefone
                </div>
                <div className="flex-1 py-2.5 rounded-xl bg-white/5 text-center text-xs text-text-secondary border border-white/5">
                  💬 WhatsApp
                </div>
                <div className="flex-1 py-2.5 rounded-xl bg-white/5 text-center text-xs text-text-secondary border border-white/5">
                  ✉️ E-mail
                </div>
              </div>

              {/* Shimmer effect */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/3 to-transparent" style={{ backgroundSize: '200% 100%' }} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
