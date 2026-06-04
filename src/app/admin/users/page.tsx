'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Search,
  Filter,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Check,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PlanoEnum, StatusEnum, RoleEnum } from '@/lib/types/database'

interface UserMockData {
  id: string
  nome: string
  email: string
  role: RoleEnum
  plano: PlanoEnum
  cardStatus: StatusEnum
  created_at: string
}

const initialUsers: UserMockData[] = [
  {
    id: 'u1',
    nome: 'Admin Editora Viva',
    email: 'admin@editoraviva.art.br',
    role: 'admin',
    plano: 'completo',
    cardStatus: 'ativo',
    created_at: '2026-05-01T12:00:00Z',
  },
  {
    id: 'u2',
    nome: 'Usuário Teste 1',
    email: 'user1@exemplo.com',
    role: 'usuario',
    plano: 'simples',
    cardStatus: 'ativo',
    created_at: '2026-05-10T14:30:00Z',
  },
  {
    id: 'u3',
    nome: 'Usuário Teste 2',
    email: 'user2@exemplo.com',
    role: 'usuario',
    plano: 'medio',
    cardStatus: 'dormindo',
    created_at: '2026-05-15T09:15:00Z',
  },
  {
    id: 'u4',
    nome: 'Usuário Teste 3',
    email: 'user3@exemplo.com',
    role: 'usuario',
    plano: 'medio',
    cardStatus: 'ativo',
    created_at: '2026-05-18T16:45:00Z',
  },
  {
    id: 'u5',
    nome: 'Usuário Teste 4',
    email: 'user4@exemplo.com',
    role: 'usuario',
    plano: 'completo',
    cardStatus: 'ativo',
    created_at: '2026-05-22T10:00:00Z',
  },
  {
    id: 'u6',
    nome: 'Usuário Teste 5',
    email: 'user5@exemplo.com',
    role: 'usuario',
    plano: 'completo',
    cardStatus: 'apagado',
    created_at: '2026-05-25T11:20:00Z',
  },
]

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserMockData[]>(initialUsers)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState<string>('todos')

  // Modal State
  const [selectedUser, setSelectedUser] = useState<UserMockData | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [newPlan, setNewPlan] = useState<PlanoEnum>('simples')

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nome.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    const matchesPlan = planFilter === 'todos' || user.plano === planFilter
    return matchesSearch && matchesPlan
  })

  const openPlanChangeModal = (user: UserMockData) => {
    setSelectedUser(user)
    setNewPlan(user.plano)
    setModalOpen(true)
  }

  const handlePlanChange = () => {
    if (!selectedUser) return
    setUsers((prev) =>
      prev.map((u) => (u.id === selectedUser.id ? { ...u, plano: newPlan } : u))
    )
    setModalOpen(false)
    setSelectedUser(null)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Gerenciamento de Usuários</h1>
          <p className="text-text-tertiary text-sm mt-1">
            Pesquise, filtre e gerencie assinaturas de planos para os usuários cadastrados.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-brand-500/10 border border-brand-500/25 px-3 py-1.5 text-xs font-semibold text-brand-300">
          <Users className="h-4 w-4" />
          {users.length} Registrados
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder="Pesquisar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/8 bg-surface-200/50 py-2.5 pl-10 pr-4 text-xs text-text-primary outline-none focus:border-brand-500/50"
          />
        </div>

        {/* Plan Filter dropdown */}
        <div className="relative min-w-[160px]">
          <Filter className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="w-full rounded-xl border border-white/8 bg-surface-200/50 py-2.5 pl-10 pr-8 text-xs text-text-secondary outline-none appearance-none cursor-pointer"
          >
            <option value="todos">Todos os Planos</option>
            <option value="simples">Simples</option>
            <option value="medio">Médio</option>
            <option value="completo">Completo</option>
          </select>
        </div>
      </div>

      {/* User Table Card */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/[0.06] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02] text-text-secondary font-semibold uppercase tracking-wider">
                <th className="px-5 py-4">Nome</th>
                <th className="px-5 py-4">E-mail</th>
                <th className="px-5 py-4">Plano</th>
                <th className="px-5 py-4">Status Cartão</th>
                <th className="px-5 py-4">Criação</th>
                <th className="px-5 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-5 py-4 font-semibold text-text-primary">{user.nome}</td>
                  <td className="px-5 py-4 text-text-secondary">{user.email}</td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-md font-semibold text-[10px]',
                        user.plano === 'completo'
                          ? 'bg-purple-500/10 border border-purple-500/20 text-purple-300'
                          : user.plano === 'medio'
                            ? 'bg-blue-500/10 border border-blue-500/20 text-blue-300'
                            : 'bg-zinc-500/10 border border-zinc-500/20 text-zinc-300'
                      )}
                    >
                      {user.plano}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          user.cardStatus === 'ativo'
                            ? 'bg-success'
                            : user.cardStatus === 'dormindo'
                              ? 'bg-warning'
                              : 'bg-error'
                        )}
                      />
                      <span className="capitalize text-text-secondary">{user.cardStatus}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-text-tertiary">
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => openPlanChangeModal(user)}
                      className="glass-button rounded-lg px-2.5 py-1.5 text-[10px] font-semibold text-brand-300 inline-flex items-center gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      Alterar Plano
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-text-tertiary italic">
                    Nenhum usuário encontrado com as configurações de filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mock Pagination */}
        <div className="border-t border-white/[0.06] p-4 flex items-center justify-between">
          <span className="text-text-tertiary text-xs">
            Mostrando <strong>{filteredUsers.length}</strong> de <strong>{filteredUsers.length}</strong> usuários
          </span>
          <div className="flex gap-1.5">
            <button disabled className="glass-button p-1.5 rounded-lg opacity-40 cursor-not-allowed">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button disabled className="glass-button p-1.5 rounded-lg opacity-40 cursor-not-allowed">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Plan Change Modal */}
      <AnimatePresence>
        {modalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card max-w-sm w-full rounded-2xl p-6 border-white/5 bg-surface-100 shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-4 border-b border-white/[0.06] pb-3">
                <h3 className="text-sm font-bold text-text-primary">Alterar Plano de Usuário</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-text-tertiary hover:text-text-secondary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-text-tertiary font-semibold uppercase">Usuário</span>
                  <p className="text-sm font-bold text-text-primary mt-0.5">{selectedUser.nome}</p>
                  <p className="text-xs text-text-tertiary">{selectedUser.email}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-secondary">Selecione o Novo Plano</label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value as PlanoEnum)}
                    className="w-full rounded-xl border border-white/8 bg-surface-200/50 py-2.5 px-3 text-xs text-text-primary outline-none cursor-pointer"
                  >
                    <option value="simples">Simples</option>
                    <option value="medio">Médio</option>
                    <option value="completo">Completo</option>
                  </select>
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl bg-white/5 border border-white/5 text-text-secondary font-semibold text-xs px-4 py-2.5 hover:bg-white/10"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handlePlanChange}
                    className="rounded-xl bg-brand-500 text-white font-semibold text-xs px-5 py-2.5 hover:brightness-110 shadow-lg shadow-brand-500/15"
                  >
                    Confirmar Alteração
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
