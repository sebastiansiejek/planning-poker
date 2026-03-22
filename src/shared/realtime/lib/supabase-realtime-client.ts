'use client';

import { createClient as createSupabaseBrowserClient } from '@/shared/database/supabase/supabase-client';

type SupabaseRealtimeClient = ReturnType<typeof createSupabaseBrowserClient>;

let supabaseRealtimeClient: SupabaseRealtimeClient | null = null;

export const getSupabaseRealtimeClient = () => {
  if (!supabaseRealtimeClient) {
    supabaseRealtimeClient = createSupabaseBrowserClient();
  }

  return supabaseRealtimeClient;
};
