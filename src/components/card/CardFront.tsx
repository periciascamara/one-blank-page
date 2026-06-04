'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import QRCode from 'qrcode'
import {
  Phone,
  Mail,
  MessageCircle,
  Wifi,
  ChevronDown,
} from 'lucide-react'
import type { PublicCardData } from '@/lib/types/database'
import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/utils'

interface CardFrontProps {
  data: PublicCardData
}

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
  }

  return (
    <a
      href={href}
      onClick={(e) => e.stopPropagation()}
      className={cn(baseStyles, layoutStyles[layout] ?? layoutStyles.minimalista)}
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
  const { card, profile } = data
  const layout = card.layout
  const { contatos, nfc_ativo } = card
  const temaModo = card.customizacao?.tema_modo || 'escuro'

  const [qrCodeUrl, setQrCodeUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/p/${profile.username}`
      
      // Determine QR color based on theme
      const qrColor = card.customizacao?.cor_primaria || '#6366f1'
      
      QRCode.toDataURL(url, {
        width: 256,
        margin: 1,
        color: {
          dark: qrColor,
          light: '#ffffff',
        },
      })
        .then(setQrCodeUrl)
        .catch((err) => console.error('Error generating QR in CardFront:', err))
    }
  }, [profile.username, card.customizacao?.cor_primaria])

  // Base layout styles
  const containerBaseStyles: Record<string, string> = {
    minimalista: 'border shadow-2xl relative',
    moderno: 'border shadow-2xl relative',
    academico: 'border shadow-2xl relative',
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

  const photoStyles: Record<string, string> = {
    minimalista: 'rounded-full ring-2 ring-white/10',
    moderno: 'rounded-2xl ring-2 ring-brand-500/30 shadow-lg shadow-brand-500/10',
    academico: 'rounded-full ring-4 ring-brand-500/20 shadow-lg shadow-brand-500/10',
  }

  const photoSize: Record<string, number> = {
    minimalista: 96,
    moderno: 112,
    academico: 104,
  }

  // Name styles
  const nameStyles: Record<string, string> = {
    minimalista: temaModo === 'claro' ? 'text-xl font-semibold text-slate-900 tracking-tight' : 'text-xl font-semibold text-text-primary tracking-tight',
    moderno: 'text-2xl font-bold gradient-brand-text tracking-tight',
    academico: temaModo === 'claro' ? 'text-xl font-bold text-slate-900 tracking-tight' : 'text-xl font-bold text-text-primary tracking-tight',
  }

  // Title styles
  const titleStyles: Record<string, string> = {
    minimalista: temaModo === 'claro' ? 'text-sm text-slate-650 text-slate-500 mt-1' : 'text-sm text-text-secondary mt-1',
    moderno: temaModo === 'claro' ? 'text-sm text-slate-650 text-slate-500 mt-1.5' : 'text-sm text-text-secondary mt-1.5',
    academico: temaModo === 'claro' ? 'text-sm text-brand-700 mt-1 italic' : 'text-sm text-brand-300/80 mt-1 italic',
  }

  const size = photoSize[layout] ?? 96
  const hasContacts = contatos.telefone || contatos.whatsapp || contatos.email
  const tertiaryTextClass = temaModo === 'claro' ? 'text-slate-500' : 'text-text-tertiary'

  return (
    <div
      className={cn(
        'flex h-full min-h-[600px] flex-col items-center justify-between rounded-2xl p-6 transition-colors duration-300',
        containerBaseStyles[layout] ?? containerBaseStyles.minimalista,
        themeContainerStyles[temaModo]
      )}
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
      <div className="flex flex-1 flex-col items-center justify-center gap-4 pt-4 pb-2 w-full">
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

        {/* QR Code */}
        <div
          className={cn(
            'flex flex-col items-center justify-center gap-2 rounded-xl p-4',
            temaModo === 'claro'
              ? 'bg-slate-100 border border-slate-200'
              : layout === 'moderno'
                ? 'bg-white/5 border border-white/10'
                : layout === 'academico'
                  ? 'bg-brand-500/5 border border-brand-500/10'
                  : 'bg-white/[0.03] border border-white/[0.06]',
          )}
        >
          <div className="relative flex items-center justify-center w-24 h-24">
            <div
              className={cn(
                'absolute inset-0 rounded-lg',
                layout === 'moderno' && temaModo !== 'claro' ? 'gradient-brand opacity-5' : 'bg-white/[0.02]',
              )}
            />
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="QR Code do Perfil"
                className="h-20 w-20 relative object-contain bg-white rounded-lg p-1 select-none"
              />
            ) : (
              <div className="h-16 w-16 animate-pulse bg-white/10 rounded-lg" />
            )}
          </div>
          <span className={cn('text-[10px] uppercase tracking-widest', tertiaryTextClass)}>
            Escaneie para salvar
          </span>
        </div>
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
