import { Menu } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/shared/UIKit/sheet/sheet';
import { Navbar } from '@/widgets/navbar/navbar';

export const MobileNavbar = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent>
        <SheetTitle>Menu</SheetTitle>
        <Navbar orientation="vertical" />
      </SheetContent>
    </Sheet>
  );
};
