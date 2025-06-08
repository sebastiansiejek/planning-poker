import { animate, useAnimate } from 'motion/react';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';

import type { TriggerPaperThrowingParameters } from '@/widgets/Room/actions/alerts/triggerPaperThrowing';

export const Paper = ({
  onEnd,
  triggerUser,
  targetUser,
}: { onEnd?: () => void } & Pick<
  TriggerPaperThrowingParameters,
  'targetUser' | 'triggerUser'
>) => {
  const [animationPaperScope, animatePaper] = useAnimate();
  const [position, setPosition] = useState<CSSProperties>({
    left: 0,
    top: 0,
    visibility: 'hidden',
  });

  useEffect(() => {
    const { id: targetUserId } = targetUser;
    const { id: triggerUserId } = triggerUser;
    const targetUserDOM = document.querySelector(`#${targetUserId}}`);
    const triggerUserDOM = document.querySelector(`#${triggerUserId}}`);

    if (!targetUserDOM || !triggerUserDOM) return;

    if (animationPaperScope) {
      const triggerUserPosition = triggerUserDOM.getBoundingClientRect();
      const targetUserPosition = targetUserDOM.getBoundingClientRect();

      setPosition({
        left: triggerUserPosition.left,
        top: triggerUserPosition.top,
        visibility: 'visible',
      });
      animatePaper(
        animationPaperScope.current,
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
        animate(
          targetUserDOM,
          {
            rotate: [0, 10, -10, 10, -10, 10, -10, 0],
          },
          {
            duration: 0.5,
            ease: 'linear',
          },
        );
        onEnd?.();
      });
      animate(
        animationPaperScope.current,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Image
      className="fixed z-20"
      src="/paper.png"
      alt="paper"
      width={30}
      height={30}
      ref={animationPaperScope}
      style={position}
    />
  );
};
