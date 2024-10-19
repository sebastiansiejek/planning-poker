import { Menu } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/shared/UIKit/Sheet/Sheet';
import { Navbar } from '@/widgets/Navbar/Navbar';

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
