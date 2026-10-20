# Supabase setup

The local app currently uses its own Node account store. This migration prepares the profile layer for Supabase Auth; it does not switch the app runtime by itself.

Before applying, verify that the Supabase project is the BLOXFORGE project. Apply migrations only to development first. Never use a service role key in browser code. Browser configuration may contain only the project URL and publishable key, supplied through the build environment. Configure email confirmation, password recovery redirect URLs, rate limits, and SMTP in Supabase Auth before enabling public registration.

The profile trigger creates only a profile row. Users cannot assign roles through this table; admin and creator approval must be implemented in privileged, audited server functions and RLS policies.
