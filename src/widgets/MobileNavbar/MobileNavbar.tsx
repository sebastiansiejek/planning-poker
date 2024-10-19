import { Menu } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '@/shared/UIKit/Sheet/Sheet';
import { Navbar } from '@/widgets/Navbar/Navbar';

export const MobileNavbar = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent>
        <Navbar orientation="vertical" />
      </SheetContent>
    </Sheet>
  );
};
