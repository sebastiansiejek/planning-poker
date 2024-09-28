import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { FaGamepad, FaHome } from 'react-icons/fa';

import { routes } from '@/shared/routes/routes';

export const useNavbarItems = () => {
  const translate = useTranslations('Navbar');

  return useMemo(
    () => [
      {
        label: translate('home'),
        href: routes.home.getPath(),
        icon: <FaHome />,
      },
      {
        label: translate('createGame'),
        href: routes.game.getPath(),
        icon: <FaGamepad />,
      },
    ],
    [translate],
  );
};
