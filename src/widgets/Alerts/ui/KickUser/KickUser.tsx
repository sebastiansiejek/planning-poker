import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';

import { ButtonIcon } from '@/shared/UIKit/Button/ButtonIcon/ButtonIcon';
import { leftGame } from '@/widgets/Room/actions/leftGame';
import { useRoomContext } from '@/widgets/Room/model/RoomContext';

export const KickUser = ({ userId }: { userId: string }) => {
  const t = useTranslations('Member');
  const {
    room: { game, roomId },
  } = useRoomContext();
  const { execute, isPending } = useAction(leftGame);

  return (
    <ButtonIcon
      aria-label={t('notification.trigger')}
      type="button"
      disabled={isPending}
      onClick={() => {
        if (game) {
          execute({ userId, roomId, gameId: game?.id });
        }
      }}
      icon={<LogOut />}
    />
  );
};
