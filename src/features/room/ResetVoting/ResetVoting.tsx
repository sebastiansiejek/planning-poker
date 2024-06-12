import { useTranslations } from 'next-intl';

import { resetVotes } from '@/app/actions/resetVotes';
import { Button } from '@/shared/UIKit/Button/Button';

export const ResetVoting = ({ channelName }: { channelName: string }) => {
  const t = useTranslations('Room');

  return (
    <form action={resetVotes}>
      <input type="hidden" name="channelName" defaultValue={channelName} />
      <Button type="submit" variant="secondary">
        {t('reset.button')}
      </Button>
    </form>
  );
};
