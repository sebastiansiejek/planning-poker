import type { Vote } from '@/shared/types/types';

import { getNumberVotes } from './getNumberVotes';

describe('getNumberVotes', () => {
  const votes: Vote[] = [
    { value: '0.5', userId: '1' },
    { value: '2', userId: '2' },
    { value: '3', userId: '3' },
    { value: '4', userId: '4' },
    { value: '5', userId: '5' },
    { value: 'NaN', userId: '6' },
    { value: '☕️', userId: '7' },
  ];

  it('should return an array of numbers', () => {
    expect(getNumberVotes(votes)).toEqual([0.5, 2, 3, 4, 5]);
  });
});
