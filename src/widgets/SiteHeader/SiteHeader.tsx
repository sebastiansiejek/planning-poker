import { getSession } from '@/shared/auth/auth';
import { UserAvatar } from '@/widgets/SiteHeader/ui/UserAvatar/UserAvatar';
import { UserMenu } from '@/widgets/SiteHeader/ui/UserMenu/UserMenu';

export const SiteHeader = async () => {
  const session = await getSession();
  const isLogged = !!session;

  return (
    <div className="sticky flex items-center justify-between top-0 p-2">
      <div className="flex items-center gap-1 ml-auto">
        {session && <UserAvatar image={session.user.image} />}
        <UserMenu isLogged={isLogged} />
      </div>
    </div>
  );
};
