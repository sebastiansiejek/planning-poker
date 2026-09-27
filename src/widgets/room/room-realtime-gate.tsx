'use client';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { z } from 'zod';

import { useRouter } from '@/i18n/navigation';
import { createRoomRealtimeClient } from '@/shared/realtime/lib/supabase-realtime-client';
import { routes } from '@/shared/routes/routes';
import { RoomLoadingSkeleton } from '@/widgets/room/room-loading-skeleton';

const RealtimeContext = createContext<SupabaseClient | null>(null);
const tokenSchema = z.object({
  token: z.string().min(1),
  expiresAt: z.number().int().positive(),
});

export const useRoomRealtimeClient = () => {
  const client = useContext(RealtimeContext);
  if (!client) throw new Error('Room Realtime is not connected');
  return client;
};

export const RoomRealtimeGate = ({
  roomId,
  children,
}: PropsWithChildren<{ roomId: string }>) => {
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [failed, setFailed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let accessToken: string | null = null;
    const connection = createRoomRealtimeClient(async () => accessToken);
    const abort = new AbortController();
    let active = true;
    let refreshing = false;
    let expiresAt = 0;
    let refreshTimer: ReturnType<typeof setTimeout>;
    let expiryTimer: ReturnType<typeof setTimeout>;
    setClient(null);
    setFailed(false);

    const disconnect = () => {
      setClient(null);
      void connection.removeAllChannels();
      connection.realtime.disconnect();
    };

    const refresh = async () => {
      if (!active || refreshing) return;
      refreshing = true;
      clearTimeout(refreshTimer);
      try {
        const response = await fetch(
          routes.api.roomRealtimeToken.getPath(roomId),
          {
            cache: 'no-store',
            signal: AbortSignal.any([
              abort.signal,
              AbortSignal.timeout(10_000),
            ]),
          },
        );
        if (!active) return;
        if (response.status === 403) {
          active = false;
          clearTimeout(expiryTimer);
          disconnect();
          router.replace(routes.game.join.getPath());
          return;
        }
        if (!response.ok) throw new Error('Could not renew room access');
        const credentials = tokenSchema.parse(await response.json());
        if (!active) return;
        accessToken = credentials.token;
        await connection.realtime.setAuth();
        if (!active) return;
        expiresAt = credentials.expiresAt * 1000;
        if (expiresAt <= Date.now()) throw new Error('Room access expired');
        setFailed(false);
        setClient(connection);
        clearTimeout(expiryTimer);
        expiryTimer = setTimeout(() => {
          disconnect();
          setFailed(true);
          void refresh();
        }, expiresAt - Date.now());
        refreshTimer = setTimeout(() => void refresh(), 30_000);
      } catch {
        if (!active) return;
        if (Date.now() >= expiresAt) {
          disconnect();
          setFailed(true);
        }
        refreshTimer = setTimeout(() => void refresh(), 5_000);
      } finally {
        refreshing = false;
      }
    };

    const resume = () => {
      if (document.visibilityState === 'visible') void refresh();
    };
    window.addEventListener('online', resume);
    document.addEventListener('visibilitychange', resume);
    void refresh();
    return () => {
      active = false;
      abort.abort();
      clearTimeout(refreshTimer);
      clearTimeout(expiryTimer);
      window.removeEventListener('online', resume);
      document.removeEventListener('visibilitychange', resume);
      void connection.removeAllChannels();
      connection.realtime.disconnect();
    };
  }, [roomId, router]);

  if (client)
    return (
      <RealtimeContext.Provider value={client}>
        {children}
      </RealtimeContext.Provider>
    );
  return <RoomLoadingSkeleton failed={failed} />;
};
