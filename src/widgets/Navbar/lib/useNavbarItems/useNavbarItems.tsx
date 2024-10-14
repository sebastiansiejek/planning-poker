import { Gamepad, Home } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { routes } from '@/shared/routes/routes';

export const useNavbarItems = () => {
  const translate = useTranslations('Navbar');

  return useMemo(
    () => [
      {
        label: translate('home'),
        href: routes.home.getPath(),
        icon: <Home size={16} />,
      },
      {
        label: translate('createGame'),
        href: routes.game.getPath(),
        icon: <Gamepad size={16} />,
      },
    ],
    [translate],
  );
};
