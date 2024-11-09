import { Loader2 } from 'lucide-react';

import { Button } from '@/shared/UIKit/Button/Button';
import type { ButtonIconProps } from '@/shared/UIKit/Button/ButtonIcon/ButtonIcon.types';

export const ButtonIcon = ({
  icon,
  isLoading,
  size = 'icon',
  ...rest
}: ButtonIconProps) => {
  return (
    <Button variant="outline" disabled={isLoading} size={size} {...rest}>
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
    </Button>
  );
};
