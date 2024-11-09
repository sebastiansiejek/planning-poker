import { BadgePlus, Gamepad, Home } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { routes } from '@/shared/routes/routes';

export const useNavbarItems = () => {
  const translate = useTranslations();

  return useMemo(
    () => [
      {
        label: translate('Navbar.home'),
        href: routes.home.getPath(),
        icon: <Home size={16} />,
      },
      {
        label: translate('Game.create.label'),
        href: routes.game.create.getPath(),
        icon: <BadgePlus size={16} />,
      },
      {
        label: translate('Game.join.label'),
        href: routes.game.join.getPath(),
        icon: <Gamepad size={16} />,
      },
    ],
    [translate],
  );
};
