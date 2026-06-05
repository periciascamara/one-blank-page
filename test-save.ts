import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  console.log("Signing in...")
  const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
    email: 'test@example.com', // wait, I don't know the user's password.
  })
}
test()
