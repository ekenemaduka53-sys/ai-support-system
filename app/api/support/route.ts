import { NextResponse } from 'next/server'
import { createAdminSupabase } from '../../../lib/supabaseClient'
import { generateSupportReply, SupportReplyResult } from '../../../lib/gemini'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const admin = createAdminSupabase()

    // 1. Insert initial request with pending status
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
      return NextResponse.json({ error: `Database insert failed: ${insertErr?.message || 'Unknown error'}` }, { status: 500 })
    }

    console.log(`[POST /api/support] Request created with ID: ${initialRecord.id}`)

    // 2. Call AI to generate response + urgency + category
    let aiResult: SupportReplyResult | null = null
    let aiError: string | null = null

    try {
      aiResult = await generateSupportReply(message)
    } catch (err: any) {
      aiError = err.message || 'AI generation failed'
      console.error('[POST /api/support] AI generation failed:', aiError)
    }

    // 3. Update Supabase with AI response if available
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
    } else {
      console.warn(`[POST /api/support] Ticket ${initialRecord.id} remains pending due to AI error: ${aiError}`)
    }

    return NextResponse.json({
      ok: true,
      request: finalRecord,
      aiError: aiError || null,
    })
  } catch (err: any) {
    console.error('[POST /api/support] Server error:', err)
    return NextResponse.json({ error: `Server error: ${err.message || 'Unknown'}` }, { status: 500 })
  }
}

