import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { buildApiUrl } from '@/lib/api'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      if (data.session?.access_token) {
        await fetch(buildApiUrl('/api/profile/sync'), {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${data.session.access_token}`,
          },
        }).catch(() => null)
      }

      return NextResponse.redirect(`${origin}/`)
    }
  }

  return NextResponse.redirect(`${origin}/login`)
}