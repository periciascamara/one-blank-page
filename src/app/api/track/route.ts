import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { user_id, event_type, target_id, target_label } = body

    if (!user_id || !event_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Usamos um client service_role ou o anon mesmo, já que o RLS permite insert anônimo
    // Para simplificar, vamos instanciar com as variáveis públicas
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase env vars not found in API route.')
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error } = await supabase.from('analytics_events').insert({
      user_id,
      event_type,
      target_id,
      target_label,
    })

    if (error) {
      console.error('Error inserting analytics event:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API /track error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
