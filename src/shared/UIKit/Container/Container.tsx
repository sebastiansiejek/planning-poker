import type { HTMLAttributes, PropsWithChildren } from 'react';

import { renderClass } from '@/shared/utils/renderClass/renderClass';

export const Container = ({
  children,
  className,
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => {
  return <div className={renderClass('container', className)}>{children}</div>;
};
