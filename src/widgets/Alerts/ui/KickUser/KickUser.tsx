import { LogOut } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';

import { ButtonIcon } from '@/shared/UIKit/Button/ButtonIcon/ButtonIcon';
import { leftGame } from '@/widgets/Room/actions/leftGame';

export const KickUser = ({ userId }: { userId: string }) => {
  const t = useTranslations('Member');
  const params = useParams();
  const roomId = params.room.toString();
  const { execute, isPending } = useAction(leftGame);

  return (
    <ButtonIcon
      aria-label={t('notification.trigger')}
      type="button"
      disabled={isPending}
      onClick={() => {
        execute({ userId, channelId: roomId });
      }}
      icon={<LogOut />}
    />
  );
};
