import { useEffect, useState } from 'react';

import type { UseCounterParameters } from './useCountdown.types';

export const useCountdown = ({ time, enabled = true }: UseCounterParameters) => {
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    setCounter(time / 1000);

    const interval = setInterval(() => {
      setCounter((previousCounter) => {
        const nextCounter = previousCounter - 1;

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
