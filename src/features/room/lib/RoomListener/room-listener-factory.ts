import type { SupabaseClient } from '@supabase/supabase-js';

import { RoomPrismaListener } from '@/features/room/lib/RoomListener/room-prisma-listener';

export const RoomListenerFactory = {
  getService(roomId: string, client: SupabaseClient) {
    return new RoomPrismaListener(roomId, client);
  },
};
