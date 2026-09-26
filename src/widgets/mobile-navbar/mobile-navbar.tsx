import { Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui-kit/sheet/sheet';
import { Navbar } from '@/widgets/navbar/navbar';

export const MobileNavbar = () => {
  const translate = useTranslations('Common');
  return (
    <Sheet>
      <SheetTrigger aria-label={translate('menu')}>
        <Menu />
      </SheetTrigger>
      <SheetContent>
        <SheetTitle>{translate('menu')}</SheetTitle>
        <Navbar orientation="vertical" />
      </SheetContent>
    </Sheet>
  );
};
