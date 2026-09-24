import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';

import { ButtonIcon } from '@/shared/ui-kit/button/button-icon/button-icon';
import { leftGame } from '@/widgets/room/actions/left-game';
import { useRoomContext } from '@/widgets/room/model/room-context';

export const KickUser = ({ userId: participantId }: { userId: string }) => {
  const t = useTranslations('Member');
  const {
    room: { roomId },
  } = useRoomContext();
  const { execute, isPending } = useAction(leftGame);

  return (
    <ButtonIcon
      aria-label={t('notification.trigger')}
      type="button"
      disabled={isPending}
      onClick={() => {
        execute({ participantId, roomId });
      }}
      icon={<LogOut />}
    />
  );
};
