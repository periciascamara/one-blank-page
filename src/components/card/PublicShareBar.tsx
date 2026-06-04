'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, ExternalLink, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PublicShareBarProps {
  username: string
}

export function PublicShareBar({ username }: PublicShareBarProps) {
  const [profileUrl, setProfileUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setProfileUrl(`${window.location.origin}/p/${username}`)
    }
  }, [username])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  return (
    <div className="mt-6 w-full max-w-md rounded-2xl glass p-4 flex flex-col sm:flex-row items-center gap-3 relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 to-accent-500/5 pointer-events-none" />

      <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary relative z-10 shrink-0">
        <Share2 className="h-3.5 w-3.5 text-brand-400" />
        <span>Compartilhar:</span>
      </div>

      {/* Profile URL display */}
      <div className="flex-1 w-full flex items-center justify-between gap-2 rounded-xl bg-surface-200/50 border border-white/[0.06] px-3.5 py-2 relative z-10 min-w-0">
        <span className="text-[11px] text-text-secondary truncate select-all">{profileUrl}</span>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 w-full sm:w-auto shrink-0 relative z-10 justify-end">
        <button
          onClick={handleCopy}
          className={cn(
            'flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-300 w-full sm:w-auto border',
            copied
              ? 'bg-success/15 border-success/20 text-success'
              : 'bg-white/5 border-white/5 text-text-primary hover:bg-white/10'
          )}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copiar</span>
            </>
          )}
        </button>

        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-xl bg-brand-500 text-white font-semibold text-xs px-3 py-2 hover:brightness-110 shadow-md shadow-brand-500/10 transition-all duration-200 w-full sm:w-auto text-center"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>Abrir</span>
        </a>
      </div>

      {/* Copy Alert notification overlay */}
      <AnimatePresence>
        {copied && (
          <div className="absolute inset-x-0 bottom-1 flex justify-center pointer-events-none">
            <span className="bg-success text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-success/20 animate-fade-in">
              Endereço copiado para a área de transferência!
            </span>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Minimal stub for AnimatePresence since we don't import full framer-motion here to keep it light
function AnimatePresence({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
