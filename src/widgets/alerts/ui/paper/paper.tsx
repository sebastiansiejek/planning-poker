import Image from 'next/image';

import {usePaper, UsePaperProps} from '@/widgets/alerts/ui/model/usePaper';

export const Paper = ({
  onEnd,
  triggerUser,
  targetUser,
}: UsePaperProps
) => {
  const {position, animationPaperScope} = usePaper({
    onEnd,
    triggerUser,
    targetUser
  })

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
