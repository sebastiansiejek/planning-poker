'use client';

import { useRef, useState } from 'react';

import { AlarmTrigger } from '@/widgets/Alerts/ui/AlarmTrigger/AlarmTrigger';
import { PaperTrigger } from '@/widgets/Alerts/ui/PaperTrigger/PaperTrigger';
import { MemberAvatar } from '@/widgets/Member/ui/MemberAvatar/MemberAvatar';
import { MemberCard } from '@/widgets/Member/ui/MemberCard/MemberCard';
import { MemberName } from '@/widgets/Member/ui/MemberName/MemberName';
import { MemberTooltip } from '@/widgets/Member/ui/MemberTooltip/MemberTooltip';
import type { MemberProps } from '@/widgets/Room/ui/RoomMember/types';

export const Member = ({
  image,
  id,
  vote,
  isRevealedCards,
  isVoted,
  name,
  isActionTooltip,
  isLoading,
}: MemberProps) => {
  const [isOpenTooltip, setIsOpenTooltip] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className="flex items-center flex-col min-w-16 min-h-28 text-center relative z-30 max-w-56"
      ref={ref}
    >
      <MemberCard
        vote={vote}
        isRevealedCards={isRevealedCards}
        isVoted={isVoted}
        isLoading={isLoading}
        htmlAttributes={{
          id,
          onMouseEnter: () => setIsOpenTooltip(true),
          onMouseLeave: () => setIsOpenTooltip(false),
        }}
      />
      {isActionTooltip && (
        <MemberTooltip
          triggerElem={ref?.current}
          isOpenTooltip={isOpenTooltip}
          setIsOpenTooltip={setIsOpenTooltip}
        >
          <AlarmTrigger userId={id} />
          <PaperTrigger userId={id} memberRef={ref} />
        </MemberTooltip>
      )}
      <MemberAvatar image={image} isLoading={isLoading} />
      <MemberName name={name} isLoading={isLoading} />
    </div>
  );
};
