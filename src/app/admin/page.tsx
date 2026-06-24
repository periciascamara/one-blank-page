import { createClient } from '@/lib/supabase/server'
import DashboardClient, { DashboardData, ActivityItem } from './DashboardClient'
import { UserPlus, CreditCard } from 'lucide-react'

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds} segundos atrás`
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes} minutos atrás`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} horas atrás`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) return `${diffInDays} dias atrás`
  return date.toLocaleDateString('pt-BR')
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // 1. Fetch total users & plan distribution
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('id, plano, created_at, username')
    .order('created_at', { ascending: false })
  const profiles = profilesData as any[]

  // 2. Fetch cards
  const { data: cardsData, error: cardsError } = await supabase
    .from('cards')
    .select('id, status, created_at, nome')
    .order('created_at', { ascending: false })
  const cards = cardsData as any[]

  const totalUsers = profiles?.length || 0
  const totalCards = cards?.length || 0
  const activeCards = cards?.filter((c) => c.status === 'ativo').length || 0

  let simplePlan = 0
  let mediumPlan = 0
  let completePlan = 0

  if (profiles) {
    profiles.forEach((p) => {
      if (p.plano === 'simples') simplePlan++
      if (p.plano === 'medio') mediumPlan++
      if (p.plano === 'completo') completePlan++
    })
  }

  // Calculate percentages
  const getPercentage = (count: number) => {
    if (totalUsers === 0) return 0
    return Math.round((count / totalUsers) * 100)
  }

  const planDistribution = [
    {
      plano: 'simples' as const,
      label: 'Simples',
      count: simplePlan,
      percentage: getPercentage(simplePlan),
      color: 'text-zinc-400',
      barColor: 'bg-zinc-500',
    },
    {
      plano: 'medio' as const,
      label: 'Médio',
      count: mediumPlan,
      percentage: getPercentage(mediumPlan),
      color: 'text-blue-400',
      barColor: 'bg-blue-500',
    },
    {
      plano: 'completo' as const,
      label: 'Completo',
      count: completePlan,
      percentage: getPercentage(completePlan),
      color: 'text-purple-400',
      barColor: 'bg-purple-500',
    },
  ]

  // Build timeline from newest profiles and cards
  const recentActivity: ActivityItem[] = []
  
  if (profiles) {
    profiles.slice(0, 5).forEach((p) => {
      recentActivity.push({
        id: `profile-${p.id}`,
        message: `Novo cadastro: ${p.username}`,
        timestamp: formatTimeAgo(p.created_at),
        type: 'new_signup',
        _date: new Date(p.created_at).getTime(),
      } as any)
    })
  }

  if (cards) {
    cards.slice(0, 5).forEach((c) => {
      recentActivity.push({
        id: `card-${c.id}`,
        message: `Novo cartão criado para ${c.nome}`,
        timestamp: formatTimeAgo(c.created_at),
        type: 'card_update',
        _date: new Date(c.created_at).getTime(),
      } as any)
    })
  }

  // Sort combined activity by date descending and take top 6
  recentActivity.sort((a: any, b: any) => b._date - a._date)
  const topRecentActivity = recentActivity.slice(0, 6)

  const dashboardData: DashboardData = {
    totalUsers,
    activeCards,
    totalCards,
    simplePlan,
    mediumPlan,
    completePlan,
    planDistribution,
    recentActivity: topRecentActivity,
  }

  return <DashboardClient data={dashboardData} />
}
