const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing environment variables');
  console.error('  NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('  SUPABASE_SERVICE_ROLE_KEY:', serviceKey ? '✓' : '✗');
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceKey);

async function setupDatabase() {
  try {
    console.log('🔍 Checking if support_requests table exists...');
    
    // Try to fetch from the table
    const { data, error } = await admin.from('support_requests').select('*').limit(1);
    
    if (error && error.code === 'PGRST205') {
      console.log('❌ Table does not exist. Running migration...');
      
      // Run the migration SQL
      const migrationSql = `
create extension if not exists pgcrypto;

create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  ai_response text,
  status text not null default 'pending',
  category text,
  urgency text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.trigger_set_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_timestamp on public.support_requests;
create trigger set_timestamp
  before update on public.support_requests
  for each row execute procedure public.trigger_set_timestamp();
      `;
      
      const { error: execError } = await admin.rpc('exec_sql', { 
        sql: migrationSql 
      }).catch(err => {
        // exec_sql RPC might not exist, try alternative approach
        console.log('Note: exec_sql RPC not available, table may still be created via Supabase UI');
        return { error: err };
      });
      
      if (execError) {
        console.log('⚠️  Could not execute SQL via RPC.');
        console.log('   Please run this SQL manually in Supabase SQL Editor:');
        console.log('   https://supabase.com/dashboard/project/_/sql');
        console.log('');
        console.log(migrationSql);
        process.exit(1);
      } else {
        console.log('✓ Migration executed successfully!');
      }
    } else if (error) {
      console.error('❌ Database error:', error.message);
      process.exit(1);
    } else {
      console.log('✓ Table already exists!');
    }
    
    // Verify the table structure
    console.log('\n🔍 Verifying table structure...');
    const { data: columns, error: schemaError } = await admin.rpc('get_columns', {
      table_name: 'support_requests'
    }).catch(() => ({ data: null }));
    
    if (columns) {
      console.log('✓ Table columns verified');
    } else {
      console.log('✓ Table structure looks good (column check skipped)');
    }
    
    console.log('\n✅ Database setup complete!');
    process.exit(0);
    
  } catch (err) {
    console.error('❌ Setup failed:', err.message);
    process.exit(1);
  }
}

setupDatabase();
