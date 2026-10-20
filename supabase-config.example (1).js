// Example only: adapt to the existing framework/build system.
// npm install @supabase/supabase-js, then copy alongside your source code.
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './supabase-config.local.js';

if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(SUPABASE_URL) ||
    !SUPABASE_PUBLISHABLE_KEY.startsWith('sb_publishable_')) {
  throw new Error('Configure verified Supabase URL and publishable key first');
}
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});
