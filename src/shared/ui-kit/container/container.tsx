import type { HTMLAttributes, PropsWithChildren } from 'react';

import { renderClass } from '@/shared/utils/render-class/render-class';

export const Container = ({
  children,
  className,
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => {
  return <div className={renderClass('container', className)}>{children}</div>;
};
