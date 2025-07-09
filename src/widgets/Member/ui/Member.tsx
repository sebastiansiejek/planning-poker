'use client';

import { useRef, useState } from 'react';

import { AlarmTrigger } from '@/widgets/Alerts/ui/AlarmTrigger/alarm-trigger';
import { KickUser } from '@/widgets/Alerts/ui/KickUser/kick-user';
import { PaperTrigger } from '@/widgets/Alerts/ui/PaperTrigger/paper-trigger';
import { MemberAvatar } from '@/widgets/Member/ui/MemberAvatar/member-avatar';
import { MemberCard } from '@/widgets/Member/ui/MemberCard/member-card';
import { MemberName } from '@/widgets/Member/ui/MemberName/member-name';
import { MemberTooltip } from '@/widgets/Member/ui/MemberTooltip/member-tooltip';
import type { MemberProperties } from '@/widgets/Room/ui/RoomMember/types';

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
