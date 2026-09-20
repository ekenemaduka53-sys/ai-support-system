import { NextResponse } from 'next/server'
import { createAdminSupabase } from '../../../../../lib/supabaseClient'
import { readAdminSession } from '../../../../../lib/auth'

export const dynamic = 'force-dynamic'

const ALLOWED_STATUSES = ['pending', 'ai_responded', 'resolved'] as const

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = readAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 401 })
    }

    const { id } = params
    if (!id) return NextResponse.json({ error: 'Missing ticket id' }, { status: 400 })

    const body = await req.json()
    const status = String(body.status || '')
    if (!ALLOWED_STATUSES.includes(status as (typeof ALLOWED_STATUSES)[number])) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const admin = createAdminSupabase()
    const { data, error } = await admin
      .from('support_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, request: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
