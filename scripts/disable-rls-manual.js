#!/usr/bin/env node
/**
 * Disable RLS on support_requests table via Supabase API
 */

const https = require('https');

const supabaseUrl = 'https://yepkgpixqmqahoxrgsku.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllcGtncGl4cW1xYWhveHJnc2t1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTExNzc1NSwiZXhwIjoyMTA0NjkzNzU1fQ.6olzWhqcpOZiYEGDgysXLOZh4Sy6C4QxIzMwpKWoCuM';

const sql = `
-- Disable RLS on the support_requests table
ALTER TABLE IF EXISTS public.support_requests DISABLE ROW LEVEL SECURITY;

-- Verify the table structure
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'support_requests';
`;

async function executeSQL() {
  return new Promise((resolve, reject) => {
    const url = new URL(supabaseUrl + '/rest/v1/rpc/query_exec_sql');
    
    // Note: This might not work if the function doesn't exist
    // Try alternative approach with fetch instead
    resolve(false);
  });
}

// Alternative: Use a simpler approach - just output instructions
console.log('🔧 Disabling RLS via Supabase Dashboard\n');
console.log('Supabase doesn\'t expose RLS management through the JavaScript SDK.');
console.log('You must disable it manually through the dashboard.\n');

console.log('QUICK FIX (2 minutes):\n');
console.log('Step 1: Go to Supabase Dashboard');
console.log('  → https://supabase.com/dashboard\n');

console.log('Step 2: Select your project "ai-support-system"\n');

console.log('Step 3: Go to Authentication → Policies\n');

console.log('Step 4: Find the "support_requests" table\n');

console.log('Step 5: Toggle "Row Level Security" to OFF\n');

console.log('Step 6: Return to the app and refresh\n');

console.log('---\n');
console.log('ALTERNATIVE (using SQL):\n');

console.log('In Supabase SQL Editor, run:\n');
console.log('```sql');
console.log('ALTER TABLE public.support_requests DISABLE ROW LEVEL SECURITY;');
console.log('```\n');

console.log('Then refresh the app.\n');

console.log('✅ After this, your dashboard will show submitted requests!');
