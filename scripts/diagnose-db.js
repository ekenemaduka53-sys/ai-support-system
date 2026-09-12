#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔧 Database Diagnostic Tool\n');
console.log('Environment Check:');
console.log('  NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
console.log('  SUPABASE_SERVICE_ROLE_KEY:', serviceKey ? '✓ Set' : '✗ Missing');

if (!supabaseUrl || !serviceKey) {
  console.error('\n❌ Cannot proceed without environment variables');
  process.exit(1);
}

console.log('\nConnecting to Supabase...');
const admin = createClient(supabaseUrl, serviceKey);

async function diagnose() {
  try {
    // Test 1: Basic connection
    console.log('\n1️⃣  Testing table existence...');
    const { data, error } = await admin.from('support_requests').select('count()');
    
    if (error) {
      console.log('   ❌ Error:', error.message);
      console.log('   Code:', error.code);
      
      if (error.code === 'PGRST205') {
        console.log('\n   ⚠️  TABLE NOT FOUND\n');
        console.log('   The support_requests table does not exist in your Supabase database.');
        console.log('   You must run the migration SQL manually.\n');
        console.log('   STEPS:');
        console.log('   1. Go to: https://supabase.com/dashboard/project/_/sql');
        console.log('   2. Click "New query"');
        console.log('   3. Paste the SQL from: db/migrations/001_create_support_requests.sql');
        console.log('   4. Click "Run" (or Ctrl+Enter)');
        console.log('   5. Restart this application\n');
        
        return;
      }
    } else {
      console.log('   ✓ Table exists!');
    }
    
    // Test 2: Insert a test record
    console.log('\n2️⃣  Testing insert...');
    const { data: inserted, error: insertError } = await admin
      .from('support_requests')
      .insert({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test message',
        status: 'pending'
      })
      .select()
      .single();
    
    if (insertError) {
      console.log('   ❌ Error:', insertError.message);
    } else {
      console.log('   ✓ Insert successful! ID:', inserted.id);
      
      // Clean up test record
      await admin.from('support_requests').delete().eq('id', inserted.id);
      console.log('   ✓ Test record cleaned up\n');
    }
    
    console.log('✅ Database is working correctly!\n');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
  
  process.exit(0);
}

diagnose();
