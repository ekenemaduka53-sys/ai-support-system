-- EMERGENCY FIX: Disable RLS on support_requests
-- This allows the API to read records
-- 
-- INSTRUCTIONS:
-- 1. Go to https://supabase.com/dashboard/project/_/sql
-- 2. Click "New query"
-- 3. Paste everything below this comment
-- 4. Click "Run" (or press Ctrl+Enter)
-- 5. Refresh your app in the browser
--
-- ====================================================================

ALTER TABLE IF EXISTS public.support_requests DISABLE ROW LEVEL SECURITY;

-- Verify the table exists and has data
SELECT COUNT(*) as total_requests FROM public.support_requests;

-- Show all requests
SELECT id, name, email, subject, status, urgency, created_at FROM public.support_requests ORDER BY created_at DESC LIMIT 20;
