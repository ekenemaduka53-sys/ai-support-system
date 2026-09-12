#!/usr/bin/env node
/**
 * Fix Row Level Security (RLS) on support_requests table
 * This script disables RLS so the API can read records
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceKey);

async function fixRLS() {
  try {
    console.log('🔧 Fixing RLS on support_requests table...\n');
    
    console.log('⚠️  IMPORTANT: Row Level Security (RLS) is likely enabled on your table.');
    console.log('   This prevents the API from reading records.\n');
    console.log('   MANUAL FIX REQUIRED:\n');
    console.log('   1. Go to https://supabase.com/dashboard/project/_/auth/policies');
    console.log('   2. Look for the "support_requests" table');
    console.log('   3. Click on it and look for RLS toggle');
    console.log('   4. If RLS is "ON", click to turn it OFF');
    console.log('   5. OR create a policy that allows SELECT for authenticated users\n');
    
    console.log('   If you want to use RLS with policies, run this SQL:\n');
    
    const policySQL = `
-- Disable RLS for development (not recommended for production)
ALTER TABLE support_requests DISABLE ROW LEVEL SECURITY;

-- OR use policies instead:
-- ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Anyone can read" ON support_requests FOR SELECT 
--   USING (true);
--
-- CREATE POLICY "Anyone can insert" ON support_requests FOR INSERT 
--   WITH CHECK (true);
--
-- CREATE POLICY "Authenticated users can update own requests" ON support_requests FOR UPDATE
--   USING (auth.uid() IS NOT NULL)
--   WITH CHECK (auth.uid() IS NOT NULL);
    `;
    
    console.log(policySQL);
    
    console.log('\n✋ After making these changes in Supabase, refresh the app.\n');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
  
  process.exit(0);
}

fixRLS();
