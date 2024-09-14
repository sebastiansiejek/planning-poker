import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

const isEllipsisActive = (element: HTMLElement) => {
  return (
    element.scrollWidth > element.offsetWidth ||
    element.scrollHeight > element.clientHeight
  );
};

export const useIsEllipsisActive = (ref: RefObject<HTMLDivElement>) => {
  const [isEllipsis, setIsEllipsis] = useState(false);

  useEffect(() => {
    if (ref.current) {
      setIsEllipsis(isEllipsisActive(ref.current));
    }
  }, [ref]);

  return isEllipsis;
};
