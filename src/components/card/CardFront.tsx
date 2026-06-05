'use client'

import Image from 'next/image'
import {
  Phone,
  Mail,
  MessageCircle,
  Wifi,
  ChevronDown,
  Shield,
  Award,
  Sparkles,
  Heart,
  Activity,
} from 'lucide-react'
import type { PublicCardData } from '@/lib/types/database'
import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/utils'

interface CardFrontProps {
  data: PublicCardData
  showQrCode?: boolean
}

const dominiosGerais = [
  'clinica',
  'comunicação',
  'acadêmica',
  'gestão',
  'liderança',
  'finanças',
  'profissionalismo',
  'networking',
  'mentoria',
  'reputação',
  'tecnologia',
]

function ContactButton({
  icon: Icon,
  label,
  href,
  layout,
  temaModo,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
  layout: string
  temaModo: 'claro' | 'escuro' | 'colorido'
}) {
  const baseStyles =
    'flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300'

  const layoutStyles: Record<string, string> = {
    minimalista:
      temaModo === 'claro'
        ? 'bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200 hover:border-slate-400'
        : 'bg-white/5 border border-white/10 text-text-primary hover:bg-white/10 hover:border-white/20',
    moderno:
      temaModo === 'claro'
        ? 'bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200 hover:border-slate-400'
        : 'glass-button text-text-primary',
    academico:
      temaModo === 'claro'
        ? 'bg-brand-500/10 border border-brand-500/20 text-brand-700 hover:bg-brand-500/20 hover:border-brand-500/30'
        : 'bg-brand-500/10 border border-brand-500/20 text-brand-300 hover:bg-brand-500/20 hover:border-brand-500/30',
    futurista: 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900/60 hover:border-cyan-400',
    neon: 'bg-black border border-pink-500 text-pink-500 hover:bg-pink-500/15 hover:shadow-[0_0_10px_rgba(244,63,94,0.4)]',
    corporativo: 'bg-slate-200 border border-slate-300 text-slate-700 hover:bg-slate-300 hover:border-slate-400 rounded-none',
  }

  return (
    <a
      href={href}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        baseStyles,
        layoutStyles[layout] ?? layoutStyles.minimalista,
        layout === 'corporativo' && 'rounded-none',
        layout === 'futurista' && 'rounded-full border-cyan-500/30'
      )}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon className="h-4 w-4" />
      <span className="sr-only">{label}</span>
    </a>
  )
}

export function CardFront({ data }: CardFrontProps) {
  const { card, badges } = data
  const layout = card.layout
  const { contatos, nfc_ativo } = card
  const temaModo = card.customizacao?.tema_modo || 'escuro'

  // Base layout styles
  const containerBaseStyles: Record<string, string> = {
    minimalista: 'border shadow-2xl relative',
    moderno: 'border shadow-2xl relative',
    academico: 'border shadow-2xl relative',
    futurista: 'border shadow-2xl relative rounded-3xl overflow-hidden',
    neon: 'border-2 shadow-2xl shadow-brand-500/20 relative rounded-2xl',
    corporativo: 'border-t-[6px] border-x border-b shadow-md relative rounded-none',
  }

  // Theme-specific container styles
  const themeContainerStyles: Record<typeof temaModo, string> = {
    claro: 'bg-white border-slate-200 text-slate-800 shadow-slate-200/50',
    escuro:
      layout === 'moderno'
        ? 'glass-card gradient-card text-text-primary'
        : layout === 'academico'
          ? 'bg-gradient-to-br from-surface-100 via-surface-200 to-brand-950/30 border-brand-500/10 text-text-primary'
          : layout === 'futurista'
            ? 'bg-slate-950/95 border-cyan-500/30 text-text-primary shadow-cyan-950/20'
            : layout === 'neon'
              ? 'bg-black border-brand-500 text-white shadow-brand-500/30'
              : layout === 'corporativo'
                ? 'bg-slate-50 border-slate-300 text-slate-800 shadow-sm border-t-brand-700'
                : 'bg-surface-100 border-white/[0.06] text-text-primary',
    colorido:
      layout === 'moderno'
        ? 'bg-gradient-to-br from-brand-900/90 via-surface-100 to-accent-950/90 border-brand-500/20 text-white shadow-brand-950/20'
        : layout === 'academico'
          ? 'bg-gradient-to-br from-brand-950 via-brand-800/80 to-accent-950 border-brand-500/20 text-white shadow-brand-950/30'
          : layout === 'futurista'
            ? 'bg-gradient-to-tr from-cyan-950 via-slate-900 to-purple-950 border-cyan-500/40 text-white'
            : layout === 'neon'
              ? 'bg-gradient-to-b from-slate-950 to-black border-pink-500 text-white shadow-pink-500/20'
              : layout === 'corporativo'
                ? 'bg-slate-100 border-slate-300 border-t-emerald-700 text-slate-800'
                : 'bg-gradient-to-br from-brand-900 to-brand-950 border-brand-800 text-white shadow-brand-950/30',
  }

  const photoStyles: Record<string, string> = {
    minimalista: 'rounded-full ring-2 ring-white/10',
    moderno: 'rounded-2xl ring-2 ring-brand-500/30 shadow-lg shadow-brand-500/10',
    academico: 'rounded-full ring-4 ring-brand-500/20 shadow-lg shadow-brand-500/10',
    futurista: 'rounded-full ring-2 ring-cyan-400 shadow-md shadow-cyan-400/20',
    neon: 'rounded-full ring-4 ring-pink-500 animate-pulse shadow-lg shadow-pink-500/30',
    corporativo: 'rounded-md ring-1 ring-slate-350 shadow-sm',
  }

  const photoSize: Record<string, number> = {
    minimalista: 96,
    moderno: 112,
    academico: 104,
    futurista: 100,
    neon: 108,
    corporativo: 90,
  }

  // Name styles
  const nameStyles: Record<string, string> = {
    minimalista:
      temaModo === 'claro'
        ? 'text-xl font-semibold text-slate-900 tracking-tight'
        : 'text-xl font-semibold text-text-primary tracking-tight',
    moderno: 'text-2xl font-bold gradient-brand-text tracking-tight',
    academico:
      temaModo === 'claro'
        ? 'text-xl font-bold text-slate-900 tracking-tight'
        : 'text-xl font-bold text-text-primary tracking-tight',
    futurista: 'text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-wider uppercase',
    neon: 'text-2xl font-bold text-white tracking-widest uppercase drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]',
    corporativo: 'text-lg font-semibold text-slate-900 tracking-normal',
  }

  // Title styles
  const titleStyles: Record<string, string> = {
    minimalista:
      temaModo === 'claro'
        ? 'text-sm text-slate-500 mt-1'
        : 'text-sm text-text-secondary mt-1',
    moderno:
      temaModo === 'claro'
        ? 'text-sm text-slate-500 mt-1.5'
        : 'text-sm text-text-secondary mt-1.5',
    academico:
      temaModo === 'claro'
        ? 'text-sm text-brand-700 mt-1 italic'
        : 'text-sm text-brand-300/80 mt-1 italic',
    futurista: 'text-xs text-cyan-300 mt-1 uppercase tracking-widest font-mono',
    neon: 'text-xs text-pink-400 mt-1 font-mono tracking-widest',
    corporativo: 'text-xs text-slate-500 mt-0.5 font-medium uppercase',
  }

  const size = photoSize[layout] ?? 96
  const hasContacts = contatos.telefone || contatos.whatsapp || contatos.email
  const tertiaryTextClass = temaModo === 'claro' ? 'text-slate-500' : 'text-text-tertiary'

  const activeBadges = badges.filter((b) => b.ativo)

  return (
    <div
      className={cn(
        'flex h-full min-h-[600px] flex-col items-center justify-between rounded-2xl p-6 transition-all duration-300',
        containerBaseStyles[layout] ?? containerBaseStyles.minimalista,
        themeContainerStyles[temaModo]
      )}
      style={{
        backgroundColor: temaModo === 'colorido' ? card.customizacao?.cor_fundo || undefined : undefined,
        borderColor: temaModo === 'colorido' ? card.customizacao?.cor_primaria || undefined : undefined,
        borderTopColor: (layout === 'corporativo' && temaModo === 'colorido') ? card.customizacao?.cor_primaria || undefined : undefined,
      }}
    >
      {/* NFC Indicator */}
      {nfc_ativo && (
        <div className="absolute top-4 right-4 group z-10">
          <div className="relative">
            <Wifi className="h-5 w-5 text-accent-400 animate-pulse-glow rounded-full" />
            <div className="absolute -top-8 right-0 hidden group-hover:block whitespace-nowrap rounded-lg bg-surface-300 px-3 py-1.5 text-xs text-text-primary shadow-xl border border-white/10">
              NFC Habilitado
            </div>
          </div>
        </div>
      )}

      {/* Top section: Photo + Name */}
      <div className="flex flex-1 flex-col items-center justify-center gap-5 pt-4 pb-2 w-full">
        {/* Photo */}
        <div className="relative">
          {layout === 'moderno' && (
            <div className="absolute -inset-1 rounded-2xl gradient-brand opacity-20 blur-md" />
          )}
          {layout === 'academico' && (
            <div className="absolute -inset-1.5 rounded-full bg-brand-500/10 blur-sm" />
          )}
          <div
            className={cn(
              'relative overflow-hidden bg-surface-300',
              photoStyles[layout] ?? photoStyles.minimalista,
            )}
            style={{ width: size, height: size }}
          >
            {card.foto_url ? (
              <Image
                src={card.foto_url}
                alt={`Foto de ${card.nome}`}
                fill
                className="object-cover"
                sizes={`${size}px`}
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center gradient-brand">
                <span className="text-2xl font-bold text-white">
                  {getInitials(card.nome)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Name + Title */}
        <div className="text-center space-y-0.5">
          <h1 className={cn(nameStyles[layout] ?? nameStyles.minimalista)}>
            {card.nome}
          </h1>
          {card.titulo && (
            <p className={cn(titleStyles[layout] ?? titleStyles.minimalista)}>
              {card.titulo}
            </p>
          )}
        </div>

        {/* Active Badges as sleeks draw tags */}
        {activeBadges.length > 0 && (
          <div className="w-full max-w-[310px] pt-2">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {activeBadges.map((badge) => {
                let IconComponent = Shield
                const labelLower = badge.label.toLowerCase()

                if (
                  labelLower.includes('ia') ||
                  labelLower.includes('frontier') ||
                  labelLower.includes('inteligência')
                ) {
                  IconComponent = Sparkles
                } else if (
                  labelLower.includes('sala vermelha') ||
                  labelLower.includes('vida') ||
                  labelLower.includes('acls')
                ) {
                  IconComponent = Heart
                } else if (
                  labelLower.includes('perito') ||
                  labelLower.includes('judicial') ||
                  labelLower.includes('atividade')
                ) {
                  IconComponent = Award
                } else if (dominiosGerais.some((d) => labelLower.includes(d))) {
                  IconComponent = Activity
                }

                const percentage = badge.meta_percentual !== undefined ? badge.meta_percentual : 75
                const statusColor = percentage >= 80 ? 'green' : percentage >= 40 ? 'yellow' : 'red'

                const statusColors = statusColor === 'green'
                  ? {
                      bg: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:border-emerald-500/40',
                      iconBg: 'bg-emerald-500/20 text-emerald-300',
                      bar: 'bg-emerald-500'
                    }
                  : statusColor === 'yellow'
                  ? {
                      bg: 'bg-amber-500/10 border-amber-500/25 text-amber-400 hover:border-amber-500/40',
                      iconBg: 'bg-amber-500/20 text-amber-300',
                      bar: 'bg-amber-500'
                    }
                  : {
                      bg: 'bg-rose-500/10 border-rose-500/25 text-rose-400 hover:border-rose-500/40',
                      iconBg: 'bg-rose-500/20 text-rose-300',
                      bar: 'bg-rose-500'
                    }

                return (
                  <div
                    key={badge.id}
                    className={cn(
                      'flex flex-col gap-1 rounded-xl pl-1.5 pr-2 py-1 text-[9px] font-bold border transition-all duration-300 shadow-sm hover:scale-105 select-none cursor-help shrink-0 w-[140px]',
                      temaModo === 'claro'
                        ? 'bg-slate-100 border-slate-200 text-slate-700 shadow-slate-200/50'
                        : statusColors.bg
                    )}
                    title={`${badge.label}: ${percentage}%`}
                  >
                    <div className="flex items-center gap-1.5 justify-between w-full">
                      <div className="flex items-center gap-1 min-w-0">
                        <span className={cn('flex items-center justify-center rounded-full p-0.5', statusColors.iconBg)}>
                          <IconComponent className="h-2.5 w-2.5 shrink-0" />
                        </span>
                        <span className="truncate max-w-[85px]">
                          {badge.label.replace(/\(.*\)/, '').trim()}
                        </span>
                      </div>
                      <span className="font-mono text-[8px] shrink-0 opacity-80">{percentage}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200/20 dark:bg-white/10 rounded-full h-1 overflow-hidden mt-0.5">
                      <div
                        className={cn('h-full rounded-full transition-all duration-500', statusColors.bar)}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Contact buttons */}
      {hasContacts && (
        <div className="flex w-full items-center justify-center gap-3 py-3">
          {contatos.telefone && (
            <ContactButton
              icon={Phone}
              label="Ligar"
              href={`tel:${contatos.telefone}`}
              layout={layout}
              temaModo={temaModo}
            />
          )}
          {contatos.whatsapp && (
            <ContactButton
              icon={MessageCircle}
              label="WhatsApp"
              href={`https://wa.me/${contatos.whatsapp.replace(/\D/g, '')}`}
              layout={layout}
              temaModo={temaModo}
            />
          )}
          {contatos.email && (
            <ContactButton
              icon={Mail}
              label="E-mail"
              href={`mailto:${contatos.email}`}
              layout={layout}
              temaModo={temaModo}
            />
          )}
        </div>
      )}

      {/* Hint */}
      <div className="flex items-center gap-1 pt-2 pb-1">
        <ChevronDown className={cn('h-3.5 w-3.5 animate-bounce', tertiaryTextClass)} />
        <span className={cn('text-xs', tertiaryTextClass)}>Toque para ver mais</span>
      </div>
    </div>
  )
}
