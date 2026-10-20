// Browser-module alternative if the app has no NPM bundler.
// This script needs a network connection to esm.sh; use an installed
// pinned package when the local build is capable of bundling dependencies.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './supabase-config.local.js';
if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(SUPABASE_URL) ||
  !SUPABASE_PUBLISHABLE_KEY.startsWith('sb_publishable_')) {
  throw new Error('Verify Supabase project before connecting');
}
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});
