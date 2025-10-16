import { Loader2 } from 'lucide-react';

import { Button } from '@/shared/ui-kit/button/button';
import type { ButtonIconProperties } from '@/shared/ui-kit/button/button-icon/button-icon.types';

export const ButtonIcon = ({
  icon,
  isLoading,
  size = 'icon',
  ...rest
}: ButtonIconProperties) => {
  return (
    <Button variant="outline" disabled={isLoading} size={size} {...rest}>
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
    </Button>
  );
};
