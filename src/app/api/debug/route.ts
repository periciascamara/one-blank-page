import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: profile } = await supabase.from('profiles').select('*').eq('username', 'guilherme-ribeiro-camara').single()
  
  if (!profile) return NextResponse.json({ error: 'Profile not found' })

  const { data: card } = await supabase.from('cards').select('*').eq('user_id', profile.id).single()

  return NextResponse.json({
    supabaseUrl: supabaseUrl.substring(0, 15) + '...',
    profile,
    card
  })
}
