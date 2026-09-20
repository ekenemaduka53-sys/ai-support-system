import { NextResponse } from 'next/server'
import { createAdminSupabase } from '../../../lib/supabaseClient'
import { readCustomerSession } from '../../../lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const session = readCustomerSession()
    if (!session) {
      return NextResponse.json({ error: 'Please sign in', requests: [] }, { status: 401 })
    }

    try {
      const admin = createAdminSupabase()
      const { data, error } = await admin
        .from('support_requests')
        .select('id, name, email, subject, message, ai_response, status, category, urgency, created_at, updated_at')
        .ilike('email', session.email)
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('[GET /api/requests] Supabase query warning:', error.message)
        return NextResponse.json({ error: `Could not load requests: ${error.message}`, requests: [] }, { status: 200 })
      }

      const own = (data || []).filter(
        (row) => String(row.email || '').trim().toLowerCase() === session.email
      )

      return NextResponse.json({ requests: own })
    } catch (dbErr: any) {
      console.warn('[GET /api/requests] Database connection warning:', dbErr?.message || dbErr)
      return NextResponse.json({ requests: [], error: 'Database service is connecting' }, { status: 200 })
    }
  } catch (err: any) {
    console.error('[GET /api/requests] Server error:', err.message)
    return NextResponse.json({ error: err.message || 'Server error', requests: [] }, { status: 500 })
  }
}
