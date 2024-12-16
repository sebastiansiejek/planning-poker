'use client';

import { useMemo } from 'react';

import { pusherClient } from '@/shared/pusher/lib/pusherClient';

export const usePusherClient = () => useMemo(() => pusherClient(), []);
