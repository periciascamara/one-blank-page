'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  CreditCard,
  QrCode,
  Settings,
  LogOut,
  Menu,
  X,
  Crown,
  Sparkles,
  Shield,
  Loader2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/utils'
import type { PlanoEnum } from '@/lib/types/database'

// Real user data is fetched via Supabase below

const navItems = [
  { href: '/dashboard', label: 'Visão Geral', icon: LayoutDashboard },
  { href: '/dashboard/card', label: 'Meu Cartão', icon: CreditCard },
  { href: '/dashboard/qrcode', label: 'QR Code', icon: QrCode },
  { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
]

const planConfig: Record<PlanoEnum, { label: string; icon: typeof Crown; colorClasses: string; bgClasses: string }> = {
  simples: {
    label: 'Simples',
    icon: Shield,
    colorClasses: 'text-text-secondary',
    bgClasses: 'bg-surface-300/60 border-surface-400/40',
  },
  medio: {
    label: 'Médio',
    icon: Sparkles,
    colorClasses: 'text-brand-400',
    bgClasses: 'bg-brand-500/10 border-brand-500/25',
  },
  completo: {
    label: 'Completo',
    icon: Crown,
    colorClasses: 'text-amber-400',
    bgClasses: 'bg-amber-500/10 border-amber-500/25',
  },
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const [currentUser, setCurrentUser] = useState<{
    nome: string
    email: string
    username: string
    plano: PlanoEnum
    foto_url: string | null
    role: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient()
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session?.user) {
          window.location.href = '/login'
          return
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileError) {
          console.error("Profile fetch error:", profileError)
          setErrorMsg(`Erro ao buscar perfil: ${profileError.message}`)
          setIsLoading(false)
          return
        }

        const profile = profileData as any

        if (profile) {
          setCurrentUser({
            nome: profile.nome || 'Usuário',
            email: session.user.email || '',
            username: profile.username || '',
            plano: (profile.plano as PlanoEnum) || 'simples',
            foto_url: profile.foto_url,
            role: profile.role || 'usuario',
          })
        } else {
          setErrorMsg("Perfil não encontrado no banco de dados.")
        }
      } catch (err: any) {
        setErrorMsg(`Erro inesperado: ${err.message}`)
      } finally {
        setIsLoading(false)
      }
    }
    loadProfile()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-surface-0">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    )
  }

  if (errorMsg) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-surface-0 p-4">
        <div className="max-w-md rounded-xl bg-error/10 p-6 border border-error/20 text-center">
          <h2 className="text-xl font-bold text-error mb-2">Ops, algo deu errado!</h2>
          <p className="text-text-secondary text-sm mb-4">{errorMsg}</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="rounded-lg bg-surface-200 px-4 py-2 text-sm text-text-primary hover:bg-surface-300"
          >
            Voltar para o Login
          </button>
        </div>
      </div>
    )
  }

  if (!currentUser) return null

  const mockUser = currentUser
  const plan = planConfig[mockUser.plano]
  const PlanIcon = plan.icon

  return (
    <div className="flex h-screen overflow-hidden bg-surface-0">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col glass border-r border-white/[0.06]">
          {/* Brand gradient accent line */}
          <div className="h-[2px] gradient-brand w-full shrink-0" />

          {/* Close button — mobile only */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute right-3 top-4 rounded-lg p-1.5 text-text-tertiary hover:bg-surface-300/50 hover:text-text-primary transition-colors lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>

          {/* User profile area */}
          <div className="flex flex-col items-center gap-3 px-6 pt-8 pb-6 border-b border-white/[0.06]">
            <div className="relative">
              {mockUser.foto_url ? (
                <img
                  src={mockUser.foto_url}
                  alt={mockUser.nome}
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-brand-500/30"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-brand text-white font-semibold text-lg ring-2 ring-brand-500/30">
                  {getInitials(mockUser.nome)}
                </div>
              )}
              {/* Online indicator */}
              <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-surface-100 bg-success" />
            </div>

            <div className="text-center">
              <p className="font-semibold text-text-primary text-sm leading-tight">
                {mockUser.nome}
              </p>
              <p className="text-xs text-text-tertiary mt-0.5">
                @{mockUser.username}
              </p>
            </div>

            {/* Plan badge */}
            <div
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-3 py-1',
                plan.bgClasses
              )}
            >
              <PlanIcon className={cn('h-3.5 w-3.5', plan.colorClasses)} />
              <span className={cn('text-xs font-medium', plan.colorClasses)}>
                Plano {plan.label}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {navItems.map((item) => {
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(item.href)
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-text-primary'
                      : 'text-text-tertiary hover:text-text-secondary hover:bg-surface-200/50'
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl gradient-card border border-brand-500/15"
                      transition={{
                        type: 'spring',
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon
                    className={cn(
                      'relative z-10 h-5 w-5 shrink-0 transition-colors',
                      isActive ? 'text-brand-400' : 'text-text-tertiary group-hover:text-text-secondary'
                    )}
                  />
                  <span className="relative z-10">{item.label}</span>

                  {/* Active dot */}
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-dot"
                      className="relative z-10 ml-auto h-1.5 w-1.5 rounded-full bg-brand-400"
                      transition={{
                        type: 'spring',
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              )
            })}

            {mockUser.role === 'admin' && (
              <Link
                href="/admin"
                className={cn(
                  'group relative mt-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 text-purple-400 bg-purple-500/10 hover:bg-purple-500/20'
                )}
              >
                <Shield className="relative z-10 h-5 w-5 shrink-0 transition-colors" />
                <span className="relative z-10">Ir para Painel Admin</span>
              </Link>
            )}
          </nav>

          {/* Bottom section */}
          <div className="border-t border-white/[0.06] px-3 py-4">
            <button
              onClick={async () => {
                const { createClient } = await import('@/lib/supabase/client')
                const supabase = createClient()
                await supabase.auth.signOut()
                window.location.href = '/'
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-text-tertiary transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>Sair da conta</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-white/[0.06] bg-surface-0/80 backdrop-blur-md px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-text-secondary hover:bg-surface-200/50 hover:text-text-primary transition-colors"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md gradient-brand" />
            <span className="text-sm font-semibold gradient-brand-text">
              One Blank Page
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div
              className={cn(
                'flex items-center gap-1 rounded-full border px-2 py-0.5',
                plan.bgClasses
              )}
            >
              <PlanIcon className={cn('h-3 w-3', plan.colorClasses)} />
              <span className={cn('text-[10px] font-medium', plan.colorClasses)}>
                {plan.label}
              </span>
            </div>
            {mockUser.foto_url ? (
              <img
                src={mockUser.foto_url}
                alt={mockUser.nome}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-brand text-white text-xs font-semibold">
                {getInitials(mockUser.nome)}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
