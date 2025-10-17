import {RoomProperties} from '@/app/game/[...room]/types';
import type { Vote } from '@/shared/types/types';

export type VotingAvgProperties = {
  votes: Vote[];
} & Pick<RoomProperties, 'issueEstimate'>;
