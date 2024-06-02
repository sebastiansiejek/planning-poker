import { resetVotes } from '@/app/actions/resetVotes';
import { Button } from '@/shared/UIKit/Button/Button';

export const ResetVoting = ({ channelName }: { channelName: string }) => {
  return (
    <form action={resetVotes}>
      <input type="hidden" name="channelName" defaultValue={channelName} />
      <Button type="submit" variant="secondary">
        Reset
      </Button>
    </form>
  );
};
