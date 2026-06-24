'use client'

import { useState, useEffect } from 'react'
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
  ExternalLink,
  Camera,
  Download,
  Share2,
  RefreshCw,
} from 'lucide-react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
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
  value,
  href,
  layout,
  temaModo,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value?: string
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
      <Icon className="h-4 w-4 shrink-0" />
      {value ? (
        <span className="text-[11px] font-semibold tracking-wide whitespace-nowrap">{value}</span>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </a>
  )
}

export function CardFront({ data }: CardFrontProps) {
  const { card, badges, linktree_links } = data
  const layout = card.layout
  const { contatos, nfc_ativo } = card
  const temaModo = card.customizacao?.tema_modo || 'escuro'

  const [showNovato, setShowNovato] = useState(false)
  const [showMedio, setShowMedio] = useState(false)
  const [showAvancado, setShowAvancado] = useState(false)

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
  const radarBadges = activeBadges.filter(b => b.codigo?.startsWith('DOM-'))
  const visualBadges = activeBadges.filter(b => !b.codigo?.startsWith('DOM-'))

  const handleTrackEvent = (eventType: string, targetId: string, targetLabel: string) => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: card.user_id,
        event_type: eventType,
        target_id: targetId,
        target_label: targetLabel
      })
    }).catch(console.error)
  }

  useEffect(() => {
    // Only track page view once per mount
    handleTrackEvent('page_view', 'card', 'Card View')
  }, [])

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

      {/* Top section: Photo + Name + Chart side by side */}
      <div className="flex flex-1 flex-col items-center justify-start gap-4 pt-2 pb-2 w-full max-w-[340px]">
        
        <div className="flex w-full items-center justify-between gap-2">
          {/* Left Side: Photo + Name/Title */}
          <div className="flex flex-col items-center justify-center text-center gap-3 flex-1 min-w-0">
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
                style={{ width: size * 0.85, height: size * 0.85 }} // Reduced size slightly to fit side-by-side
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
                    <span className="text-xl font-bold text-white">
                      {getInitials(card.nome)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Name + Title */}
            <div className="space-y-0.5 px-1">
              <h1 className={cn(nameStyles[layout] ?? nameStyles.minimalista, "text-base sm:text-lg leading-tight")}>
                {card.nome}
              </h1>
              {card.titulo && (
                <p className={cn(titleStyles[layout] ?? titleStyles.minimalista, "text-[10px] sm:text-xs leading-tight")}>
                  {card.titulo}
                </p>
              )}
            </div>
          </div>

          {/* Right Side: Spider Web Chart (Radar) */}
          {radarBadges.length > 0 && (
            <div className="w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] shrink-0 flex flex-col items-center relative -mr-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart 
                  cx="50%" 
                  cy="50%" 
                  outerRadius="60%" 
                  data={radarBadges.map((badge, idx) => {
                    const seed = idx * 10
                    return {
                      subject: badge.label.replace(/\(.*\)/, '').trim(),
                      A: badge.meta_percentual !== undefined ? badge.meta_percentual : 75,
                      Novato: 25 + (seed % 15),
                      Medio: 55 + (seed % 20),
                      Avancado: 85 + (seed % 15),
                      fullMark: 100,
                    }
                  })}
                >
                  <PolarGrid stroke={temaModo === 'claro' ? '#e2e8f0' : 'rgba(255,255,255,0.15)'} />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ 
                      fill: temaModo === 'claro' ? '#64748b' : 'rgba(255,255,255,0.8)', 
                      fontSize: 7,
                      fontWeight: 600
                    }} 
                    tickFormatter={(val) => val.length > 12 ? val.substring(0, 10) + '..' : val}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={false} 
                    axisLine={false} 
                  />
                  {showNovato && <Radar name="Novato" dataKey="Novato" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1} strokeDasharray="3 3" />}
                  {showMedio && <Radar name="Médio" dataKey="Medio" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.1} strokeDasharray="3 3" />}
                  {showAvancado && <Radar name="Avançado" dataKey="Avancado" stroke="#fb7185" fill="#fb7185" fillOpacity={0.1} strokeDasharray="3 3" />}
                  <Radar 
                    name="Competências" 
                    dataKey="A" 
                    stroke={temaModo === 'colorido' ? (card.customizacao?.cor_primaria || '#3b82f6') : (temaModo === 'claro' ? '#3b82f6' : '#60a5fa')} 
                    fill={temaModo === 'colorido' ? (card.customizacao?.cor_primaria || '#3b82f6') : (temaModo === 'claro' ? '#3b82f6' : '#60a5fa')} 
                    fillOpacity={0.4} 
                  />
                </RadarChart>
              </ResponsiveContainer>
              
              {/* Toggles */}
              <div className="flex items-center justify-center gap-1 mt-1 shrink-0 absolute -bottom-4 left-1/2 -translate-x-1/2 w-full">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowNovato(!showNovato); }}
                  className={cn("text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full border transition-colors cursor-pointer z-10", showNovato ? "bg-slate-500/20 border-slate-400 text-slate-300" : "border-white/10 text-white/40")}
                >Novato</button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowMedio(!showMedio); }}
                  className={cn("text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full border transition-colors cursor-pointer z-10", showMedio ? "bg-amber-500/20 border-amber-400 text-amber-400" : "border-white/10 text-white/40")}
                >Médio</button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowAvancado(!showAvancado); }}
                  className={cn("text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full border transition-colors cursor-pointer z-10", showAvancado ? "bg-rose-500/20 border-rose-400 text-rose-400" : "border-white/10 text-white/40")}
                >Avançado</button>
              </div>
            </div>
          )}
        </div>

        {/* Project Links (Linktree) */}
        {linktree_links && linktree_links.filter(l => l.ativo).length > 0 && (() => {
          const activeLinks = linktree_links.filter(l => l.ativo).sort((a,b) => a.ordem - b.ordem);
          const isGrid = activeLinks.length > 2;
          
          return (
            <div className={cn(
              "w-full pt-1 flex-1 overflow-y-auto min-h-0 pb-2 custom-scrollbar",
              isGrid ? "grid grid-cols-2 gap-2 content-start" : "flex flex-col gap-2"
            )}>
              {activeLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleTrackEvent('link_click', link.id, link.label)
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex items-center justify-between rounded-xl font-medium transition-all duration-300 w-full shrink-0',
                    isGrid ? 'px-3 py-2 text-[11px] sm:text-xs' : 'px-4 py-2.5 sm:py-3 text-[13px] sm:text-sm',
                    temaModo === 'claro'
                      ? 'bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200 hover:border-slate-400'
                      : 'bg-white/5 border border-white/10 text-text-primary hover:bg-white/10 hover:border-white/20'
                  )}
                  style={
                    temaModo === 'colorido' && card.customizacao?.cor_primaria
                      ? {
                          backgroundColor: `${card.customizacao.cor_primaria}20`,
                          borderColor: `${card.customizacao.cor_primaria}40`,
                          color: 'white',
                        }
                      : {}
                  }
                >
                  <span className="truncate pr-2">{link.label}</span>
                  <ExternalLink className={cn("opacity-70 shrink-0", isGrid ? "h-3.5 w-3.5" : "h-4 w-4")} />
                </a>
              ))}
            </div>
          )
        })()}

        {/* Visual Badges (Premium/Custom) Below Links */}
        {visualBadges.length > 0 && (
          <div className="w-full flex flex-wrap justify-center gap-1.5 pt-2 pb-1 shrink-0">
            {visualBadges.map(badge => (
              <div key={badge.id} className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-sm border",
                temaModo === 'claro' 
                  ? "bg-white border-slate-200 text-slate-700" 
                  : "bg-white/5 backdrop-blur-md border-white/10 text-white"
              )}>
                <Shield className={cn("h-3 w-3", temaModo === 'claro' ? "text-brand-500" : "text-accent-400")} />
                <span className="text-[10px] font-semibold tracking-wide truncate max-w-[150px]">{badge.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact buttons */}
      {hasContacts && (
        <div className="flex w-full flex-wrap items-center justify-center gap-2 py-3 mt-auto">
          {contatos.telefone && (
            <ContactButton
              icon={Phone}
              label="Ligar"
              value={contatos.telefone}
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
              value={contatos.email}
              href={`mailto:${contatos.email}`}
              layout={layout}
              temaModo={temaModo}
            />
          )}
        </div>
      )}

      {/* Footer Area */}
      <div className="flex flex-col items-center gap-1.5 pt-2 pb-1 mt-auto">
        {/* Hint */}
        <div className="flex items-center gap-1.5 bg-amber-400/90 hover:bg-amber-400 transition-colors px-3 py-1.5 rounded-full shadow-lg border border-amber-300">
          <RefreshCw className="h-3.5 w-3.5 animate-spin-slow text-amber-950" style={{ animationDuration: '4s' }} />
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-950 drop-shadow-sm">
            Clique para virar e ver o verso
          </span>
        </div>
        
        {/* Branding Link */}
        <a 
          href="https://one-blank-page.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={cn("text-[9px] hover:underline flex items-center gap-1 opacity-60 transition-opacity hover:opacity-100 font-medium", tertiaryTextClass)}
        >
          <Sparkles className="h-2.5 w-2.5" />
          One Blank Page
        </a>
      </div>
    </div>
  )
}
