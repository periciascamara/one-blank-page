'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StatusEnum, PlanoEnum, LayoutEnum } from '@/lib/types/database'

// Mock data
const mockUser = {
  nome: 'Dr. Rafael Moraes',
  username: 'dr-rafael-moraes',
  plano: 'medio' as PlanoEnum,
}

const mockCard = {
  nome: 'Dr. Rafael Moraes',
  titulo: 'Cardiologista | Perito Médico',
  foto_url: null as string | null,
  status: 'ativo' as StatusEnum,
  layout: 'moderno' as LayoutEnum,
  especialidades: ['Cardiologia', 'Perícia Médica'],
  contatos: {
    telefone: '(11) 98765-4321',
    email: 'rafael@exemplo.com',
  },
  customizacao: {
    cor_primaria: '#6366f1',
  },
}

const mockStats = {
  visualizacoes: 1247,
  cliques: 328,
  qrcodes: 56,
  tendencia_visualizacoes: 12.5,
  tendencia_cliques: 8.3,
  tendencia_qrcodes: -2.1,
}

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
  const [cardStatus, setCardStatus] = useState<StatusEnum>(mockCard.status)
  const [copied, setCopied] = useState(false)

  const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${mockUser.username}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available
    }
  }

  const toggleStatus = () => {
    setCardStatus((prev) => (prev === 'ativo' ? 'dormindo' : 'ativo'))
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

          {/* Card status toggle */}
          <div className="flex items-center gap-3">
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
                      {mockCard.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
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
                      {mockCard.especialidades.map((esp) => (
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
      </motion.div>
    </div>
  )
}
