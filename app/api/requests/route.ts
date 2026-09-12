import { NextResponse } from 'next/server'
import { createAdminSupabase } from '../../../lib/supabaseClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    console.log('\n====== [GET /api/requests] START ======')
    console.log('Timestamp:', new Date().toISOString())
    
    const admin = createAdminSupabase()
    console.log('✓ Admin client created')
    
    // Log the query being executed
    console.log('Executing: SELECT * FROM support_requests ORDER BY created_at DESC')
    
    const { data, error } = await admin.from('support_requests').select('*').order('created_at', { ascending: false })
    
    console.log('Query completed:')
    console.log('  Error:', error ? JSON.stringify(error) : 'null')
    console.log('  Data type:', typeof data)
    console.log('  Data is Array:', Array.isArray(data))
    console.log('  Data length:', data?.length || 0)
    
    if (data && data.length > 0) {
      console.log('  First record ID:', data[0].id)
      console.log('  First record name:', data[0].name)
    }
    
    if (error) {
      console.error('❌ Supabase error:', error.message)
      console.error('   Code:', error.code)
      console.error('   Details:', error.details)
      return NextResponse.json({ error: `DB fetch failed: ${error.message}`, requests: [] }, { status: 500 })
    }
    
    console.log(`✓ Query successful. Returning ${data?.length || 0} records`)
    console.log('====== [GET /api/requests] END ======\n')
    
    return NextResponse.json({ requests: data || [] })
  } catch (err: any) {
    console.error('\n❌ [GET /api/requests] Server error:', err.message)
    console.error('Stack:', err.stack)
    console.log('====== [GET /api/requests] END (ERROR) ======\n')
    return NextResponse.json({ error: `Server error: ${err.message}`, requests: [] }, { status: 500 })
  }
}
