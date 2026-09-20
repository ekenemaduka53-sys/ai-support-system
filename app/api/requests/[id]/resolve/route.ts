import { NextResponse } from 'next/server'
import { createAdminSupabase } from '../../../../../lib/supabaseClient'
import { readAdminSession } from '../../../../../lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    const adminSession = readAdminSession()
    if (!adminSession) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 401 })
    }

    const { id } = params
    if (!id) return NextResponse.json({ error: 'Missing ticket id' }, { status: 400 })

    const admin = createAdminSupabase()
    const { error } = await admin.from('support_requests').update({ status: 'resolved' }).eq('id', id)
    if (error) {
      console.error('[POST /api/requests/[id]/resolve] Error:', error)
      return NextResponse.json({ error: `Could not update ticket: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ ok: true, id, status: 'resolved' })
  } catch (err: any) {
    console.error('[POST /api/requests/[id]/resolve] Server error:', err)
    return NextResponse.json({ error: err.message || 'Unknown' }, { status: 500 })
  }
}
