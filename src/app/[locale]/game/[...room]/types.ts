import type { RoomParticipant } from '@/shared/factories/participant-service-factory';
import type { Vote } from '@/shared/types/types';

export type RoomMember = RoomParticipant;

export type RoomProperties = {
  id: string;
  name: string;
  currentParticipantId: string;
  members: RoomMember[];
  initialVotes: string[];
  finishedGameVotes: Vote[];
};
