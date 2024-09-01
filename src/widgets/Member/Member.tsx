'use client';

import { useRef, useState } from 'react';

import { AlarmTrigger } from '@/app/alerts/widgets/AlarmTrigger/AlarmTrigger';
import { PaperTrigger } from '@/app/alerts/widgets/PaperTrigger/PaperTrigger';
import { MemberAvatar } from '@/widgets/Member/MemberAvatar/MemberAvatar';
import { MemberCard } from '@/widgets/Member/MemberCard/MemberCard';
import { MemberName } from '@/widgets/Member/MemberName/MemberName';
import { MemberTooltip } from '@/widgets/Member/MemberTooltip/MemberTooltip';
import type { MemberProps } from '@/widgets/room/ui/RoomMember/types';

export const Member = ({
  avatarUrl,
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
      className="flex items-center flex-col min-w-16 min-h-28 text-center relative z-30"
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
      <MemberAvatar avatarUrl={avatarUrl} isLoading={isLoading} />
      <MemberName name={name} isLoading={isLoading} />
    </div>
  );
};
