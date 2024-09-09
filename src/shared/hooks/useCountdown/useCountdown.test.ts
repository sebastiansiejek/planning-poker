import { renderHook } from '@testing-library/react';

import { useCountdown } from '@/shared/hooks/useCountdown/useCountdown';

describe('useCountdown', () => {
  it('should return counter 1', () => {
    const time = 2000;
    const { result: counter } = renderHook(() => useCountdown({ time }));

    setTimeout(() => {
      expect(counter).toBe(1);
    }, time);
  });
});
