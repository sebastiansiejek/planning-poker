import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

const isEllipsisActive = (element: HTMLElement) => {
  return (
    element.scrollWidth > element.offsetWidth ||
    element.scrollHeight > element.clientHeight
  );
};

export const useIsEllipsisActive = (reference: RefObject<HTMLDivElement | null>) => {
  const [isEllipsis, setIsEllipsis] = useState(false);

  useEffect(() => {
    if (reference.current) {
      setIsEllipsis(isEllipsisActive(reference.current));
    }
  }, [reference]);

  return isEllipsis;
};
