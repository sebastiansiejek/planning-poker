'use client';

import { useMemo } from 'react';

import { pusherClient } from '@/shared/pusher/lib/pusher-client';

export const usePusherClient = () => useMemo(() => pusherClient(), []);
