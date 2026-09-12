import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars not set (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side admin client using the service role key. Only use this in server code.
export function createAdminSupabase(): SupabaseClient {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set — server-side operations require it')
  }
  return createClient(supabaseUrl, serviceKey)
}
