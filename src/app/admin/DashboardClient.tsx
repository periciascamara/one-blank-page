'use client'

import { motion } from 'framer-motion'
import {
  Users,
  LayoutDashboard,
  Shield,
  TrendingUp,
  CreditCard,
  Activity,
  ArrowUpRight,
  Clock,
  UserPlus,
  RefreshCw,
} from 'lucide-react'
import type { PlanoEnum } from '@/lib/types/database'

interface KpiCard {
  label: string
  value: number | string
  icon: React.ElementType
  color: string
  bgGradient: string
  change?: string
}

export interface ActivityItem {
  id: string
  message: string
  timestamp: string
  type: 'plan_change' | 'new_signup' | 'card_update' | 'setting_change'
}

export interface PlanDistribution {
  plano: PlanoEnum
  label: string
  count: number
  percentage: number
  color: string
  barColor: string
}

export interface DashboardData {
  totalUsers: number
  activeCards: number
  totalCards: number
  simplePlan: number
  mediumPlan: number
  completePlan: number
  recentActivity: ActivityItem[]
  planDistribution: PlanDistribution[]
}

const activityTypeColors: Record<ActivityItem['type'], string> = {
  plan_change: 'bg-blue-500/15 text-blue-400',
  new_signup: 'bg-emerald-500/15 text-emerald-400',
  card_update: 'bg-brand-500/15 text-brand-400',
  setting_change: 'bg-amber-500/15 text-amber-400',
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export default function DashboardClient({ data }: { data: DashboardData }) {
  const kpiCards: KpiCard[] = [
    {
      label: 'Total Usuários',
      value: data.totalUsers,
      icon: Users,
      color: 'text-brand-400',
      bgGradient: 'from-brand-500/20 to-brand-600/5',
    },
    {
      label: 'Cartões Ativos',
      value: data.activeCards,
      icon: CreditCard,
      color: 'text-emerald-400',
      bgGradient: 'from-emerald-500/20 to-emerald-600/5',
      change: data.totalCards > 0 ? `${Math.round((data.activeCards / data.totalCards) * 100)}% do total` : '0% do total',
    },
    {
      label: 'Plano Simples',
      value: data.simplePlan,
      icon: LayoutDashboard,
      color: 'text-zinc-400',
      bgGradient: 'from-zinc-500/20 to-zinc-600/5',
    },
    {
      label: 'Plano Médio',
      value: data.mediumPlan,
      icon: Shield,
      color: 'text-blue-400',
      bgGradient: 'from-blue-500/20 to-blue-600/5',
    },
    {
      label: 'Plano Completo',
      value: data.completePlan,
      icon: TrendingUp,
      color: 'text-purple-400',
      bgGradient: 'from-purple-500/20 to-purple-600/5',
    },
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
          Painel Administrativo
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Visão geral da plataforma One Blank Page
        </p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      >
        {kpiCards.map((card) => (
          <motion.div
            key={card.label}
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="glass-card group relative overflow-hidden rounded-2xl p-5"
          >
            {/* Background gradient accent */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
            />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.bgGradient}`}
                >
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <ArrowUpRight className="h-4 w-4 text-text-tertiary opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <p className="mt-4 text-3xl font-bold text-text-primary">
                {card.value}
              </p>
              <p className="mt-1 text-sm text-text-secondary">{card.label}</p>
              {card.change && (
                <p className="mt-2 text-xs text-text-tertiary">{card.change}</p>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Growth Chart Placeholder */}
        <motion.div
          variants={itemVariants}
          className="glass-card col-span-1 overflow-hidden rounded-2xl lg:col-span-2"
        >
          <div className="border-b border-white/[0.06] p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  Crescimento de Usuários
                </h2>
                <p className="text-sm text-text-secondary">
                  Últimos 6 meses
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-surface-300/50 px-3 py-1.5 text-xs font-medium text-text-secondary">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                Em crescimento
              </div>
            </div>
          </div>
          <div className="p-5">
            {/* Styled chart placeholder */}
            <div className="relative h-56 w-full overflow-hidden rounded-xl">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="border-b border-white/[0.04]"
                  />
                ))}
              </div>

              {/* Gradient area */}
              <svg
                viewBox="0 0 600 220"
                className="absolute inset-0 h-full w-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="chartGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor="rgba(99, 102, 241, 0.3)"
                    />
                    <stop
                      offset="100%"
                      stopColor="rgba(99, 102, 241, 0)"
                    />
                  </linearGradient>
                  <linearGradient
                    id="lineGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
                {/* Area */}
                <path
                  d="M 0 180 Q 60 170 100 160 T 200 130 T 300 110 T 400 80 T 500 55 T 600 30 L 600 220 L 0 220 Z"
                  fill="url(#chartGradient)"
                />
                {/* Line */}
                <path
                  d="M 0 180 Q 60 170 100 160 T 200 130 T 300 110 T 400 80 T 500 55 T 600 30"
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Data points */}
                {[
                  [0, 180],
                  [100, 160],
                  [200, 130],
                  [300, 110],
                  [400, 80],
                  [500, 55],
                  [600, 30],
                ].map(([cx, cy], i) => (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r="4"
                    fill="#131318"
                    stroke="#818cf8"
                    strokeWidth="2"
                  />
                ))}
              </svg>

              {/* Month labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pb-1 text-[10px] text-text-tertiary">
                <span>Jan</span>
                <span>Fev</span>
                <span>Mar</span>
                <span>Abr</span>
                <span>Mai</span>
                <span>Jun</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Plan Distribution */}
        <motion.div
          variants={itemVariants}
          className="glass-card overflow-hidden rounded-2xl"
        >
          <div className="border-b border-white/[0.06] p-5">
            <h2 className="text-lg font-semibold text-text-primary">
              Distribuição de Planos
            </h2>
            <p className="text-sm text-text-secondary">
              Por tipo de assinatura
            </p>
          </div>
          <div className="space-y-5 p-5">
            {data.planDistribution.map((plan) => (
              <div key={plan.plano}>
                <div className="mb-2 flex items-center justify-between">
                  <span className={`text-sm font-medium ${plan.color}`}>
                    {plan.label}
                  </span>
                  <span className="text-sm text-text-secondary">
                    {plan.count} usuários ({plan.percentage}%)
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-300">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${plan.percentage}%` }}
                    transition={{
                      duration: 1,
                      delay: 0.5,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className={`h-full rounded-full ${plan.barColor}`}
                  />
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="mt-4 rounded-xl bg-surface-200/50 p-4 text-center">
              <p className="text-3xl font-bold text-text-primary">{data.totalUsers}</p>
              <p className="text-sm text-text-secondary">
                Total de usuários registrados
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        variants={itemVariants}
        className="glass-card overflow-hidden rounded-2xl"
      >
        <div className="border-b border-white/[0.06] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Atividade Recente
              </h2>
              <p className="text-sm text-text-secondary">
                Últimos cadastros e ativações
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-tertiary">
              <Clock className="h-4 w-4" />
              Atualizado agora
            </div>
          </div>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {data.recentActivity.length === 0 ? (
            <div className="p-8 text-center text-sm text-text-tertiary">
              Nenhuma atividade recente.
            </div>
          ) : (
            data.recentActivity.map((item, index) => {
              const IconComponent = 
                item.type === 'new_signup' ? UserPlus :
                item.type === 'card_update' ? CreditCard :
                item.type === 'plan_change' ? RefreshCw : Activity;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.08 }}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-surface-200/30"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${activityTypeColors[item.type]}`}
                  >
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-text-primary">{item.message}</p>
                    <p className="text-xs text-text-tertiary">{item.timestamp}</p>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
