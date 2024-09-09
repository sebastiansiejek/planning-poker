import { useEffect, useState } from 'react';

import type { UseCounterParams } from '@/shared/hooks/useCounter/useCounter.types';

export const useCounter = ({ time, enabled = true }: UseCounterParams) => {
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    setCounter(time / 1000);

    const interval = setInterval(() => {
      setCounter((prevCounter) => {
        const nextCounter = prevCounter - 1;

        if (nextCounter === 0) {
          clearInterval(interval);
        }

        return nextCounter;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [enabled, time]);

  return {
    counter,
  };
};
