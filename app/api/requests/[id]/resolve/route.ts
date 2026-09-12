import { NextResponse } from 'next/server'
import { createAdminSupabase } from '../../../../../lib/supabaseClient'

export const dynamic = 'force-dynamic'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!id) return NextResponse.json({ error: 'Missing ticket id' }, { status: 400 })

    const admin = createAdminSupabase()
    const { error } = await admin.from('support_requests').update({ status: 'resolved' }).eq('id', id)
    if (error) {
      console.error('[POST /api/requests/[id]/resolve] Error updating status in Supabase:', error)
      return NextResponse.json({ error: `DB update failed: ${error.message}` }, { status: 500 })
    }

    console.log(`[POST /api/requests/[id]/resolve] Ticket ${id} marked as resolved`)
    return NextResponse.json({ ok: true, id, status: 'resolved' })
  } catch (err: any) {
    console.error('[POST /api/requests/[id]/resolve] Server error:', err)
    return NextResponse.json({ error: `Server error: ${err.message || 'Unknown'}` }, { status: 500 })
  }
}

