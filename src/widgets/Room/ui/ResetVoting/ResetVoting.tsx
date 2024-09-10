import { useTranslations } from 'next-intl';

import { useCountdown } from '@/shared/hooks/useCountdown/useCountdown';
import { Button } from '@/shared/UIKit/Button/Button';
import { resetVotes } from '@/widgets/Room/actions/resetVotes';
import type { ResetVotingProps } from '@/widgets/Room/ui/ResetVoting/ResetVoting.types';

export const ResetVoting = ({ channelName }: ResetVotingProps) => {
  const t = useTranslations('Room');
  const { counter } = useCountdown({ time: 3000 });
  const isCounter = counter > 0;

  return (
    <form action={resetVotes}>
      <input type="hidden" name="channelName" defaultValue={channelName} />
      <Button type="submit" variant="secondary" disabled={isCounter}>
        <span>
          {t('reset.button')} {isCounter && `(${counter})`}
        </span>
      </Button>
    </form>
  );
};
