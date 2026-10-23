import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Only the public anon key belongs here. Never the service_role key.
export const supabaseConfigError = !url || !anonKey
  ? 'Supabase is not configured: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local, then restart npm run dev.'
  : null

export const supabase = supabaseConfigError ? null : createClient(url, anonKey)

// Lets the work cards' security checks call `supabase.from(...)` in the browser console.
if (import.meta.env.DEV && supabase) {
  window.supabase = supabase
}
