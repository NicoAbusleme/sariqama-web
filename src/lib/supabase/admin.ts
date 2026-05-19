import { createClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase con service role — solo usar en server actions / API routes.
 * Nunca exponer al cliente (browser).
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
