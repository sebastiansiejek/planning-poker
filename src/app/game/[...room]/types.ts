import type { User } from '@prisma/client';

import type { Vote } from '@/shared/types/types';

export type RoomMember = Pick<User, 'id' | 'name' | 'image'>;

export type RoomProperties = {
  id: string;
  name: string;
  members: RoomMember[];
  initialVotes: string[];
  finishedGameVotes: Vote[];
  issueKey?: string
  summaryDescription?: string
  issueAnalyze?: {
    missing: string[],
    questions_to_FE: string[],
    questions_to_BE: string[],
    questions_to_PO: string[],
    questions_to_QA: string[],
    test_scenarios: string[],
  }
};

