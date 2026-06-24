import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminLayoutClient, { AdminUser } from './AdminLayoutClient'

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data } = await supabase
    .from('profiles')
    .select('nome, email, role')
    .eq('id', user.id)
    .single()

  const profile = data as any

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  const adminUser: AdminUser = {
    nome: profile.nome || 'Admin',
    email: profile.email || user.email || '',
    role: 'admin',
  }

  return <AdminLayoutClient adminUser={adminUser}>{children}</AdminLayoutClient>
}
