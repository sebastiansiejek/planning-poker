'use client';

import { useTranslations } from 'next-intl';

import { Container } from '@/shared/ui-kit/container/container';
import { Skeleton } from '@/shared/ui-kit/skeleton/skeleton';
import { Member } from '@/widgets/member/ui/member';
import { GameContainer } from '@/widgets/room/ui/game/game-container/game-container';
import { MemberContainer } from '@/widgets/room/ui/members-container/member-container';

export const RoomLoadingSkeleton = ({ failed = false }: { failed?: boolean }) => {
  const translate = useTranslations('Room');

  return (
    <Container>
      <div className="grid gap-6" role="status" aria-live="polite">
        <div className="mx-auto w-full max-w-5xl pb-10 pt-3 text-center lg:pb-16 lg:pt-10">
          <Skeleton className="mx-auto h-9 w-48" aria-hidden="true" />
          <p className="mt-4 text-sm text-muted-foreground">
            {translate(failed ? 'connectionError' : 'connecting')}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center" aria-hidden="true">
          <GameContainer>
            <MemberContainer place="top">
              <Member id="loading-top" name="" isLoading />
            </MemberContainer>
            <MemberContainer place="left" isVertical>
              <Member id="loading-left" name="" isLoading />
            </MemberContainer>
            <Skeleton className="h-[10rem] w-full min-w-72 [grid-area:table]" />
            <MemberContainer place="right" isVertical>
              <Member id="loading-right" name="" isLoading />
            </MemberContainer>
            <MemberContainer place="bottom">
              <Member id="loading-bottom" name="" isLoading />
            </MemberContainer>
          </GameContainer>
        </div>
      </div>
    </Container>
  );
};
