'use client';

import { createClient } from '@supabase/supabase-js';

// Each mounted room owns a connection. Tokens cannot leak across room switches.
export const createRoomRealtimeClient = (accessToken: () => Promise<string | null>) => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { accessToken, auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } },
);
