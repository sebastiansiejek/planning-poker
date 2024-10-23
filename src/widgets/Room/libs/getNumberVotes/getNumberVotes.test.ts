import type { Vote } from '@/shared/types/types';

import { getNumberVotes } from './getNumberVotes';

describe('getNumberVotes', () => {
  const votes: Vote[] = [
    { vote: '0.5', userId: '1' },
    { vote: '2', userId: '2' },
    { vote: '3', userId: '3' },
    { vote: '4', userId: '4' },
    { vote: '5', userId: '5' },
    { vote: 'NaN', userId: '6' },
    { vote: '☕️', userId: '7' },
  ];

  it('should return an array of numbers', () => {
    expect(getNumberVotes(votes)).toEqual([0.5, 2, 3, 4, 5]);
  });
});
