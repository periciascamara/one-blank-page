'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/utils'

export interface AdminUser {
  nome: string
  email: string
  role: 'admin'
}

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Usuários',
    href: '/admin/users',
    icon: Users,
  },
  {
    label: 'Configurações',
    href: '/admin/settings',
    icon: Settings,
  },
]

function isActiveLink(pathname: string, href: string): boolean {
  if (href === '/admin') {
    return pathname === '/admin'
  }
  return pathname.startsWith(href)
}

export default function AdminLayoutClient({
  children,
  adminUser,
}: Readonly<{
  children: React.ReactNode
  adminUser: AdminUser
}>) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-surface-0">
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
        <div className="flex flex-1 flex-col bg-surface-100 border-r border-white/[0.06]">
          {/* Logo & Admin Badge */}
          <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 shadow-lg shadow-brand-500/20">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-text-primary">
                  One Blank Page
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-purple-400">
                  <Shield className="h-2.5 w-2.5" />
                  Admin
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1.5 text-text-tertiary hover:bg-surface-300 hover:text-text-primary transition-colors lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-text-tertiary">
              Menu Principal
            </p>
            {navItems.map((item) => {
              const active = isActiveLink(pathname, item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-gradient-to-r from-brand-600/20 to-purple-600/10 text-brand-400 shadow-sm shadow-brand-500/5'
                      : 'text-text-secondary hover:bg-surface-300/50 hover:text-text-primary'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-5 w-5 transition-colors',
                      active
                        ? 'text-brand-400'
                        : 'text-text-tertiary group-hover:text-text-secondary'
                    )}
                  />
                  {item.label}
                  {active && (
                    <ChevronRight className="ml-auto h-4 w-4 text-brand-400/60" />
                  )}
                </Link>
              )
            })}
            
            <div className="pt-4 pb-2">
              <div className="h-px w-full bg-white/[0.06]" />
            </div>

            <Link
              href="/dashboard"
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 text-text-secondary hover:bg-surface-300/50 hover:text-text-primary'
              )}
            >
              <ArrowLeft className="h-5 w-5 text-text-tertiary group-hover:text-text-secondary transition-colors" />
              Voltar ao Meu Cartão
            </Link>
          </nav>

          {/* Admin profile & Logout */}
          <div className="border-t border-white/[0.06] p-4">
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-surface-200/50 p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-brand-600 text-xs font-bold text-white">
                {getInitials(adminUser.nome)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-primary">
                  {adminUser.nome}
                </p>
                <p className="truncate text-xs text-text-tertiary">
                  {adminUser.email}
                </p>
              </div>
            </div>
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-300">
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar (mobile) */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/[0.06] bg-surface-0/80 px-4 backdrop-blur-xl lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-text-secondary hover:bg-surface-300 hover:text-text-primary transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-400" />
            <span className="text-sm font-semibold text-text-primary">
              Painel Admin
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
