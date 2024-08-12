import { useAnimate } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import type { TriggerPaperThrowingParams } from '@/app/actions/notifications/triggerPaperThrowing';

export const Paper = ({
  onEnd,
  triggerUser,
  targetUser,
}: { onEnd?: () => void } & Pick<
  TriggerPaperThrowingParams,
  'targetUser' | 'triggerUser'
>) => {
  const [scope, animate] = useAnimate();
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
  });

  useEffect(() => {
    const { id: targetUserId } = targetUser;
    const { id: triggerUserId } = triggerUser;
    const targetUserDOM = document.getElementById(targetUserId);
    const triggerUserDOM = document.getElementById(triggerUserId);

    if (!targetUserDOM || !triggerUserDOM) return;

    if (scope) {
      const triggerUserPosition = triggerUserDOM.getBoundingClientRect();
      const targetUserPosition = targetUserDOM.getBoundingClientRect();
      setPosition({
        left: triggerUserPosition.left,
        top: triggerUserPosition.top,
      });
      animate(
        scope.current,
        {
          transformOrigin: 'center',
          translateX: targetUserPosition.left - triggerUserPosition.left,
          translateY: targetUserPosition.top - triggerUserPosition.top,
          visibility: 'hidden',
        },
        {
          duration: 1.5,
          ease: 'linear',
        },
      ).then(() => {
        onEnd?.();
      });
      animate(
        scope.current,
        {
          rotate: 360,
        },
        {
          duration: 0.7,
          repeat: Infinity,
          ease: 'linear',
        },
      );
    }
  }, []);

  return (
    <Image
      className="fixed z-50"
      src="/paper.png"
      alt="paper"
      width={30}
      height={30}
      ref={scope}
      style={position}
    />
  );
};
