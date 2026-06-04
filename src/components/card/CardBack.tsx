'use client'

import {
  GraduationCap,
  Award,
  Shield,
  Globe,
  ExternalLink,
  ChevronDown,
} from 'lucide-react'
import type { PublicCardData } from '@/lib/types/database'
import { cn } from '@/lib/utils'

// Custom SVG Brand Icons since Lucide-React v1+ has deprecated/removed them
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
)

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
)

interface CardBackProps {
  data: PublicCardData
}

function SectionTitle({
  icon: Icon,
  title,
  layout,
  temaModo,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  layout: string
  temaModo: 'claro' | 'escuro' | 'colorido'
}) {
  const styles: Record<string, string> = {
    minimalista: temaModo === 'claro' ? 'text-slate-600' : 'text-text-secondary',
    moderno: temaModo === 'claro' ? 'text-brand-600' : 'text-brand-400',
    academico: temaModo === 'claro' ? 'text-brand-700' : 'text-brand-300',
  }

  return (
    <div className="flex items-center gap-2 mb-2.5">
      <Icon className={cn('h-4 w-4', styles[layout] ?? styles.minimalista)} />
      <h3
        className={cn(
          'text-xs font-semibold uppercase tracking-wider',
          styles[layout] ?? styles.minimalista,
        )}
      >
        {title}
      </h3>
    </div>
  )
}

function SocialButton({
  icon: Icon,
  href,
  label,
  layout,
  temaModo,
}: {
  icon: React.ComponentType<{ className?: string }>
  href: string
  label: string
  layout: string
  temaModo: 'claro' | 'escuro' | 'colorido'
}) {
  const styles: Record<string, string> = {
    minimalista:
      temaModo === 'claro'
        ? 'bg-slate-200/60 border border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
        : 'bg-white/5 border border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/10',
    moderno:
      temaModo === 'claro'
        ? 'bg-slate-200/60 border border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
        : 'glass-button text-text-secondary hover:text-text-primary',
    academico:
      temaModo === 'claro'
        ? 'bg-brand-500/10 border border-brand-500/20 text-brand-700 hover:bg-brand-500/20 hover:text-brand-900'
        : 'bg-brand-500/5 border border-brand-500/15 text-brand-400 hover:bg-brand-500/15 hover:text-brand-300',
  }

  return (
    <a
      href={href}
      onClick={(e) => e.stopPropagation()}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center justify-center rounded-xl p-2.5 transition-all duration-300',
        styles[layout] ?? styles.minimalista,
      )}
      aria-label={label}
    >
      <Icon className="h-4.5 w-4.5" />
    </a>
  )
}

export function CardBack({ data }: CardBackProps) {
  const { card, badges, linktree_links } = data
  const layout = card.layout
  const { redes_sociais, formacao, especialidades } = card
  const temaModo = card.customizacao?.tema_modo || 'escuro'

  const activeLinks = linktree_links
    .filter((link) => link.ativo)
    .sort((a, b) => a.ordem - b.ordem)

  const activeBadges = badges.filter((badge) => badge.ativo)

  const hasSocials =
    redes_sociais.linkedin ||
    redes_sociais.instagram ||
    redes_sociais.tiktok ||
    redes_sociais.site ||
    redes_sociais.youtube

  // Layout-specific classes
  const containerBaseStyles: Record<string, string> = {
    minimalista: 'border shadow-2xl',
    moderno: 'border shadow-2xl',
    academico: 'border shadow-2xl',
  }

  // Theme-specific container styles
  const themeContainerStyles: Record<typeof temaModo, string> = {
    claro: 'bg-white border-slate-200 text-slate-800 shadow-slate-200/50',
    escuro:
      layout === 'moderno'
        ? 'glass-card gradient-card text-text-primary'
        : layout === 'academico'
          ? 'bg-gradient-to-br from-surface-100 via-surface-200 to-brand-950/30 border-brand-500/10 text-text-primary'
          : 'bg-surface-100 border-white/[0.06] text-text-primary',
    colorido:
      layout === 'moderno'
        ? 'bg-gradient-to-br from-brand-900/90 via-surface-100 to-accent-950/90 border-brand-500/20 text-white shadow-brand-950/20'
        : layout === 'academico'
          ? 'bg-gradient-to-br from-brand-950 via-brand-800/80 to-accent-950 border-brand-500/20 text-white shadow-brand-950/30'
          : 'bg-gradient-to-br from-brand-900 to-brand-950 border-brand-800 text-white shadow-brand-950/30',
  }

  // Text colors
  const primaryTextClass = temaModo === 'claro' ? 'text-slate-900' : 'text-text-primary'
  const secondaryTextClass = temaModo === 'claro' ? 'text-slate-600' : 'text-text-secondary'
  const tertiaryTextClass = temaModo === 'claro' ? 'text-slate-450 text-slate-500' : 'text-text-tertiary'

  // Item list backgrounds
  const itemBgClass =
    temaModo === 'claro'
      ? 'bg-slate-100/50 border border-slate-200/60'
      : layout === 'moderno'
        ? 'bg-white/[0.03] border border-white/[0.06]'
        : layout === 'academico'
          ? 'bg-brand-500/[0.03] border border-brand-500/[0.06]'
          : 'bg-white/[0.02] border border-white/[0.04]'

  // Specialties
  const specialtyTagStyles: Record<string, string> = {
    minimalista:
      temaModo === 'claro'
        ? 'bg-slate-100 border border-slate-300 text-slate-700 text-[11px]'
        : 'bg-white/5 border border-white/10 text-text-secondary text-[11px]',
    moderno:
      temaModo === 'claro'
        ? 'bg-brand-500/10 border border-brand-500/20 text-brand-700 text-[11px]'
        : 'bg-brand-500/10 border border-brand-500/20 text-brand-300 text-[11px]',
    academico:
      temaModo === 'claro'
        ? 'bg-brand-500/15 border border-brand-500/30 text-brand-800 text-[11px]'
        : 'bg-brand-500/5 border border-brand-500/15 text-brand-400 text-[11px]',
  }

  // Badges
  const badgeStyles: Record<string, string> = {
    minimalista:
      temaModo === 'claro'
        ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
        : 'bg-accent-500/10 border border-accent-500/20 text-accent-400',
    moderno:
      temaModo === 'claro'
        ? 'bg-emerald-50 border border-emerald-250 text-emerald-700'
        : 'bg-accent-500/10 border border-accent-500/25 text-accent-300',
    academico:
      temaModo === 'claro'
        ? 'bg-emerald-100/50 border border-emerald-300 text-emerald-800'
        : 'bg-accent-500/5 border border-accent-500/20 text-accent-400',
  }

  // Linktree List Item styles
  const linkStyles: Record<string, string> = {
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
        ? 'bg-brand-500/10 border border-brand-500/20 text-slate-800 hover:bg-brand-500/20'
        : 'bg-brand-500/5 border border-brand-500/10 text-text-primary hover:bg-brand-500/10 hover:border-brand-500/20',
  }

  return (
    <div
      className={cn(
        'flex h-full min-h-[600px] flex-col rounded-2xl p-6 overflow-y-auto transition-colors duration-300',
        containerBaseStyles[layout] ?? containerBaseStyles.minimalista,
        themeContainerStyles[temaModo]
      )}
    >
      <div className="flex flex-col gap-5 flex-1">
        {/* Formation */}
        {formacao.length > 0 && (
          <section>
            <SectionTitle icon={GraduationCap} title="Formação" layout={layout} temaModo={temaModo} />
            <ul className="space-y-2">
              {formacao.map((item, idx) => (
                <li key={idx} className={cn('rounded-xl px-3.5 py-2.5', itemBgClass)}>
                  <p className={cn('text-sm font-medium leading-snug', primaryTextClass)}>
                    {item.grau}
                  </p>
                  <p className={cn('text-xs mt-0.5', tertiaryTextClass)}>
                    {item.instituicao}
                    {item.ano && ` · ${item.ano}`}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Specialties */}
        {especialidades.length > 0 && (
          <section>
            <SectionTitle icon={Award} title="Especialidades" layout={layout} temaModo={temaModo} />
            <div className="flex flex-wrap gap-1.5">
              {especialidades.map((spec) => (
                <span
                  key={spec}
                  className={cn(
                    'inline-flex items-center rounded-lg px-2.5 py-1 font-medium',
                    specialtyTagStyles[layout] ?? specialtyTagStyles.minimalista,
                  )}
                >
                  {spec}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Badges */}
        {activeBadges.length > 0 && (
          <section>
            <SectionTitle icon={Shield} title="Validações" layout={layout} temaModo={temaModo} />
            <div className="space-y-1.5">
              {activeBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={cn(
                    'flex items-center gap-2.5 rounded-xl px-3.5 py-2.5',
                    badgeStyles[layout] ?? badgeStyles.minimalista,
                  )}
                >
                  <Shield className="h-3.5 w-3.5 shrink-0" />
                  <span className="text-xs font-medium">{badge.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Linktree Links */}
        {activeLinks.length > 0 && (
          <section>
            <SectionTitle icon={ExternalLink} title="Links" layout={layout} temaModo={temaModo} />
            <div className="space-y-2">
              {activeLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300',
                    linkStyles[layout] ?? linkStyles.minimalista,
                  )}
                >
                  <span>{link.label}</span>
                  <ExternalLink className={cn('h-3.5 w-3.5', tertiaryTextClass)} />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Social Media */}
        {hasSocials && (
          <section>
            <SectionTitle icon={Globe} title="Redes Sociais" layout={layout} temaModo={temaModo} />
            <div className="flex flex-wrap items-center gap-2">
              {redes_sociais.linkedin && (
                <SocialButton
                  icon={LinkedinIcon}
                  href={redes_sociais.linkedin}
                  label="LinkedIn"
                  layout={layout}
                  temaModo={temaModo}
                />
              )}
              {redes_sociais.instagram && (
                <SocialButton
                  icon={InstagramIcon}
                  href={redes_sociais.instagram}
                  label="Instagram"
                  layout={layout}
                  temaModo={temaModo}
                />
              )}
              {redes_sociais.tiktok && (
                <SocialButton
                  icon={TiktokIcon}
                  href={redes_sociais.tiktok}
                  label="TikTok"
                  layout={layout}
                  temaModo={temaModo}
                />
              )}
              {redes_sociais.youtube && (
                <SocialButton
                  icon={YoutubeIcon}
                  href={redes_sociais.youtube}
                  label="YouTube"
                  layout={layout}
                  temaModo={temaModo}
                />
              )}
              {redes_sociais.site && (
                <SocialButton
                  icon={Globe}
                  href={redes_sociais.site}
                  label="Website"
                  layout={layout}
                  temaModo={temaModo}
                />
              )}
            </div>
          </section>
        )}
      </div>

      {/* Hint */}
      <div className="flex items-center justify-center gap-1 pt-4 pb-1 shrink-0">
        <ChevronDown className={cn('h-3.5 w-3.5 rotate-180', tertiaryTextClass)} />
        <span className={cn('text-xs', tertiaryTextClass)}>Toque para voltar</span>
      </div>
    </div>
  )
}
