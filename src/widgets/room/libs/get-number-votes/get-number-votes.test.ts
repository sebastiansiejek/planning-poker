
import type { Vote } from '@/shared/types/types';
import { getNumberVotes } from '@/widgets/room/libs/get-number-votes/get-number-votes';

describe('getNumberVotes', () => {
  const votes: Vote[] = [
    { vote: '0.5', participantId: '1' },
    { vote: '2', participantId: '2' },
    { vote: '3', participantId: '3' },
    { vote: '4', participantId: '4' },
    { vote: '5', participantId: '5' },
    { vote: 'NaN', participantId: '6' },
    { vote: '☕️', participantId: '7' },
  ];

  it('should return an array of numbers', () => {
    expect(getNumberVotes(votes)).toEqual([0.5, 2, 3, 4, 5]);
  });
});
