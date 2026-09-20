import { NextResponse } from 'next/server'
import { createAdminSupabase } from '../../../../lib/supabaseClient'
import { readAdminSession } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const session = readAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Admin access required', requests: [] }, { status: 401 })
    }

    try {
      const admin = createAdminSupabase()
      const { data, error } = await admin
        .from('support_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('[GET /api/admin/requests] Supabase query warning:', error.message)
        return NextResponse.json({ error: error.message, requests: [] }, { status: 200 })
      }

      return NextResponse.json({ requests: data || [] })
    } catch (dbErr: any) {
      console.warn('[GET /api/admin/requests] Database error:', dbErr?.message || dbErr)
      return NextResponse.json({ requests: [], error: 'Database service is connecting' }, { status: 200 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error', requests: [] }, { status: 500 })
  }
}
