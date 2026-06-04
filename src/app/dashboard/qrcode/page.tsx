'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, Download, Copy, Check, Globe, RefreshCw, Sliders } from 'lucide-react'
import QRCode from 'qrcode'
import { cn } from '@/lib/utils'

export default function QrCodePage() {
  const mockUsername = 'dr-rafael-moraes'
  const [profileUrl, setProfileUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [qrColor, setQrColor] = useState('#6366f1')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setProfileUrl(`${window.location.origin}/p/${mockUsername}`)
    }
  }, [])

  // Generate QR Code when colors or URL change
  useEffect(() => {
    if (!profileUrl) return

    async function generateQR() {
      setIsGenerating(true)
      try {
        const url = await QRCode.toDataURL(profileUrl, {
          width: 512,
          margin: 2,
          color: {
            dark: qrColor,
            light: bgColor,
          },
        })
        setQrCodeDataUrl(url)
      } catch (err) {
        console.error('Error generating QR code:', err)
      } finally {
        setIsGenerating(false)
      }
    }

    generateQR()
  }, [profileUrl, qrColor, bgColor])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard not available
    }
  }

  const handleDownloadPNG = () => {
    if (!qrCodeDataUrl) return

    // Re-generate in higher resolution for print/download (1024x1024)
    QRCode.toDataURL(
      profileUrl,
      {
        width: 1024,
        margin: 2,
        color: {
          dark: qrColor,
          light: bgColor,
        },
      },
      (err, url) => {
        if (err) return console.error(err)
        const link = document.createElement('a')
        link.download = `qrcode-${mockUsername}.png`
        link.href = url
        link.click()
      }
    )
  }

  const handleDownloadSVG = async () => {
    try {
      const svgString = await QRCode.toString(profileUrl, {
        type: 'svg',
        margin: 2,
        color: {
          dark: qrColor,
          light: bgColor,
        },
      })
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `qrcode-${mockUsername}.svg`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Compartilhar com QR Code</h1>
        <p className="text-text-tertiary text-sm mt-1">
          Gere um QR Code exclusivo e personalizado para o seu perfil e compartilhe em cartões impressos, clínicas ou salas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* QR Code Preview Block */}
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center gap-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 opacity-50" />

          {/* QR Container */}
          <div className="relative aspect-square w-full max-w-[280px] rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-white p-4">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-white/80"
                >
                  <RefreshCw className="h-8 w-8 text-brand-500 animate-spin" />
                </motion.div>
              ) : null}
            </AnimatePresence>

            {qrCodeDataUrl ? (
              <img
                src={qrCodeDataUrl}
                alt="QR Code"
                className="w-full h-full object-contain select-none"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface-200">
                <QrCode className="h-16 w-16 text-text-tertiary" />
              </div>
            )}
          </div>

          {/* Profile link banner */}
          <div className="w-full space-y-2 relative z-10">
            <div className="flex items-center gap-2 rounded-xl bg-surface-200/50 border border-white/[0.06] px-4 py-2.5">
              <Globe className="h-4 w-4 text-text-tertiary shrink-0" />
              <span className="text-xs text-text-secondary truncate flex-1">{profileUrl}</span>
              <button
                onClick={handleCopyLink}
                className={cn(
                  'text-xs font-semibold px-3 py-1.5 rounded-lg transition-all',
                  copied ? 'text-success bg-success/10' : 'text-brand-300 hover:bg-white/5'
                )}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* QR Customizer & Download Block */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-6">
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Sliders className="h-4 w-4 text-brand-400" />
            Opções de Customização
          </h3>

          <div className="space-y-4">
            {/* Color controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-text-secondary">Cor do QR Code</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="h-8 w-8 rounded cursor-pointer border-none bg-transparent"
                  />
                  <span className="text-xs text-text-primary font-mono uppercase">{qrColor}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-text-secondary">Cor de Fundo</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-8 w-8 rounded cursor-pointer border-none bg-transparent"
                  />
                  <span className="text-xs text-text-primary font-mono uppercase">{bgColor}</span>
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-medium text-text-secondary">Paleta Padrão</span>
              <div className="flex gap-2">
                {[
                  { dark: '#6366f1', light: '#ffffff' }, // Indigo / White
                  { dark: '#14b8a6', light: '#ffffff' }, // Teal / White
                  { dark: '#09090b', light: '#ffffff' }, // Pure Dark / White
                  { dark: '#6366f1', light: '#f3f4f6' }, // Indigo / Gray Light
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQrColor(preset.dark)
                      setBgColor(preset.light)
                    }}
                    className="h-7 w-7 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden"
                  >
                    <span className="h-full w-1/2" style={{ backgroundColor: preset.dark }} />
                    <span className="h-full w-1/2" style={{ backgroundColor: preset.light }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Download actions */}
            <div className="space-y-3 pt-6 border-t border-white/[0.06]">
              <p className="text-xs font-medium text-text-secondary">Formatos de Download</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleDownloadPNG}
                  className="flex items-center justify-center gap-2 rounded-xl bg-brand-500 text-white font-semibold text-xs py-3 shadow-lg shadow-brand-500/25 hover:brightness-110 hover:shadow-brand-500/30 active:scale-[0.98] transition-all"
                >
                  <Download className="h-4 w-4" />
                  PNG (1024px)
                </button>
                <button
                  onClick={handleDownloadSVG}
                  className="flex items-center justify-center gap-2 rounded-xl bg-surface-200 border border-white/5 text-text-primary font-semibold text-xs py-3 hover:bg-surface-300 active:scale-[0.98] transition-all"
                >
                  <Download className="h-4 w-4" />
                  Vetor SVG
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
