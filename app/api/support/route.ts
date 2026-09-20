import { NextResponse } from 'next/server'
import { createAdminSupabase } from '../../../lib/supabaseClient'
import { generateSupportReply, SupportReplyResult } from '../../../lib/gemini'
import { normalizeEmail, readCustomerSession } from '../../../lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const session = readCustomerSession()
    if (!session) {
      return NextResponse.json({ error: 'Please sign in to send a request' }, { status: 401 })
    }

    const body = await req.json()
    const name = String(body.name || session.name || '').trim()
    const email = session.email
    const subject = String(body.subject || '').trim()
    const message = String(body.message || '').trim()

    if (!name || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (body.email && normalizeEmail(body.email) !== email) {
      return NextResponse.json({ error: 'You can only submit requests from your signed-in account' }, { status: 403 })
    }

    const admin = createAdminSupabase()

    const { data: initialRecord, error: insertErr } = await admin
      .from('support_requests')
      .insert({
        name,
        email,
        subject,
        message,
        status: 'pending',
      })
      .select()
      .single()

    if (insertErr || !initialRecord) {
      console.error('[POST /api/support] Supabase insert error:', insertErr)
      return NextResponse.json(
        { error: `Could not save your request: ${insertErr?.message || 'Unknown error'}` },
        { status: 500 }
      )
    }

    let aiResult: SupportReplyResult | null = null
    let aiError: string | null = null

    try {
      aiResult = await generateSupportReply(message)
    } catch (err: any) {
      aiError = err.message || 'Reply generation failed'
      console.error('[POST /api/support] generation failed:', aiError)
    }

    let finalRecord = initialRecord

    if (aiResult && aiResult.response) {
      const { response, category, urgency } = aiResult
      const { data: updatedRecord, error: updateErr } = await admin
        .from('support_requests')
        .update({
          ai_response: response,
          status: 'ai_responded',
          category: category || null,
          urgency: urgency || null,
        })
        .eq('id', initialRecord.id)
        .select()
        .single()

      if (updateErr) {
        console.error('[POST /api/support] Supabase update error:', updateErr)
      } else if (updatedRecord) {
        finalRecord = updatedRecord
      }
    }

    return NextResponse.json({
      ok: true,
      request: finalRecord,
      replyPending: !finalRecord.ai_response,
      aiError: aiError || null,
    })
  } catch (err: any) {
    console.error('[POST /api/support] Server error:', err)
    return NextResponse.json({ error: `Server error: ${err.message || 'Unknown'}` }, { status: 500 })
  }
}
