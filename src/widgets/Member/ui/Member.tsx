'use client';

import { useRef, useState } from 'react';

import { AlarmTrigger } from '@/widgets/alerts/ui/alarm-trigger/alarm-trigger';
import { KickUser } from '@/widgets/alerts/ui/kick-user/kick-user';
import { PaperTrigger } from '@/widgets/alerts/ui/paper-trigger/paper-trigger';
import { MemberAvatar } from '@/widgets/member/ui/member-avatar/member-avatar';
import { MemberCard } from '@/widgets/member/ui/member-card/member-card';
import { MemberName } from '@/widgets/member/ui/member-name/member-name';
import { MemberTooltip } from '@/widgets/member/ui/member-tooltip/member-tooltip';
import type { MemberProperties } from '@/widgets/room/ui/room-member/types';

export const Member = ({
  image,
  id,
  vote,
  isRevealedCards,
  isVoted,
  name,
  isActionTooltip,
  isLoading,
}: MemberProperties) => {
  const [isOpenTooltip, setIsOpenTooltip] = useState(false);
  const reference = useRef<HTMLDivElement>(null);

  return (
    <div
      className="flex items-center flex-col min-w-16 min-h-28 text-center relative max-w-56"
      ref={reference}
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
          triggerElem={reference?.current}
          isOpenTooltip={isOpenTooltip}
          setIsOpenTooltip={setIsOpenTooltip}
        >
          <AlarmTrigger userId={id} />
          <PaperTrigger userId={id} memberRef={reference} />
          <KickUser userId={id} />
        </MemberTooltip>
      )}
      <MemberAvatar image={image} />
      <MemberName name={name} isLoading={isLoading} />
    </div>
  );
};
