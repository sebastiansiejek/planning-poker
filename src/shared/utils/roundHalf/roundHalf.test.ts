import { roundHalf } from './roundHalf';

describe('roundHalf', () => {
  it('should round to the nearest half', () => {
    expect(roundHalf(0.5)).toBe(0.5);
    expect(roundHalf(0.8)).toBe(1);
    expect(roundHalf(1.1)).toBe(1);
    expect(roundHalf(1.211111)).toBe(1);
    expect(roundHalf(1.299999)).toBe(1.5);
    expect(roundHalf(1.4)).toBe(1.5);
    expect(roundHalf(1.5)).toBe(1.5);
    expect(roundHalf(1.6)).toBe(1.5);
    expect(roundHalf(1.7)).toBe(1.5);
    expect(roundHalf(1.8)).toBe(2);
    expect(roundHalf(1.9)).toBe(2);
  });
});
