'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Image as ImageIcon, Sliders, Eye, Save, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function PlatformSettingsPage() {
  const [heroImageUrl, setHeroImageUrl] = useState(
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2070&q=80'
  )
  const [heroOpacity, setHeroOpacity] = useState(0.6)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 2000)
    }, 1000)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Configurações da Plataforma</h1>
        <p className="text-text-tertiary text-sm mt-1">
          Ajuste as configurações visuais, imagens de fundo e o comportamento global da landing page.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Settings Form Card */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-6">
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Sliders className="h-4 w-4 text-brand-400" />
            Landing Page Hero
          </h3>

          <div className="space-y-4">
            {/* Background image URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary flex items-center gap-1">
                <ImageIcon className="h-3.5 w-3.5" />
                URL da Imagem de Fundo (Hero)
              </label>
              <input
                type="text"
                value={heroImageUrl}
                onChange={(e) => setHeroImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-xl border border-white/8 bg-surface-200/50 px-4 py-2.5 text-xs text-text-primary outline-none focus:border-brand-500/50"
              />
              <p className="text-[10px] text-text-tertiary">
                Insira uma imagem de alta resolução (Unsplash recomendada).
              </p>
            </div>

            {/* Background opacity slider */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-semibold text-text-secondary">
                <span>Opacidade do Overlay Escuro</span>
                <span className="font-mono text-brand-400">{(heroOpacity * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={heroOpacity}
                onChange={(e) => setHeroOpacity(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
              <p className="text-[10px] text-text-tertiary">
                Opacidade do gradiente de fade para escurecer a imagem de fundo.
              </p>
            </div>

            {/* Save actions */}
            <div className="flex items-center justify-between pt-6 border-t border-white/[0.06]">
              <AnimatePresence>
                {savedSuccess && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-success text-xs font-medium flex items-center gap-1"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Plataforma atualizada!
                  </motion.span>
                )}
              </AnimatePresence>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="glass-button text-xs font-semibold text-white gradient-brand shadow-lg shadow-brand-500/25 rounded-xl px-5 py-3 flex items-center gap-2 ml-auto"
              >
                {isSaving ? (
                  <>
                    <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Live Hero Preview Block */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              Demonstração da Landing Page (Preview)
            </span>
            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <Eye className="h-3.5 w-3.5 text-brand-400" />
              Ao vivo
            </div>
          </div>

          {/* Hero Section Preview Block */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/[0.06] shadow-2xl bg-zinc-950 flex flex-col justify-end p-6">
            {/* Background image under overlay */}
            {heroImageUrl ? (
              <img
                src={heroImageUrl}
                alt="Hero Preview"
                className="absolute inset-0 w-full h-full object-cover select-none"
              />
            ) : null}

            {/* Configurable overlay */}
            <div
              className="absolute inset-0 bg-black transition-opacity duration-200"
              style={{ opacity: heroOpacity }}
            />

            {/* Brand gradient overlay bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-0 via-transparent to-transparent opacity-80" />

            {/* Mock text content overlay */}
            <div className="relative z-10 space-y-2">
              <span className="rounded-full bg-brand-500/10 border border-brand-500/25 px-2.5 py-0.5 text-[9px] font-semibold text-brand-300 inline-block uppercase tracking-wider">
                Exclusivo para Médicos
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-tight max-w-sm">
                Sua Identidade Profissional Médica em um Único Link.
              </h2>
              <p className="text-[10px] text-text-secondary max-w-xs leading-relaxed">
                Centralize seus dados públicos, RQE, agendas e CRM com o padrão premium da Editora Viva.
              </p>
              <div className="flex gap-2 pt-2">
                <span className="rounded-lg gradient-brand text-[9px] font-bold text-white px-3 py-1.5 shadow-md shadow-brand-500/10">
                  Criar Cartão
                </span>
                <span className="rounded-lg bg-white/5 border border-white/10 text-white text-[9px] font-bold px-3 py-1.5">
                  Ver Planos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
