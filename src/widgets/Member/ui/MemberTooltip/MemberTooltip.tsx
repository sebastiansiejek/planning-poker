import { useState } from 'react';
import { usePopper } from 'react-popper';

import type { MemberTooltipProps } from '@/widgets/Member/ui/MemberTooltip/types';

export const MemberTooltip = ({
  children,
  triggerElem: memberRef,
  setIsOpenTooltip,
  isOpenTooltip,
}: MemberTooltipProps) => {
  const [popperElement, setPopperElement] = useState<HTMLDivElement>();
  const { styles, attributes } = usePopper(memberRef, popperElement, {
    placement: 'top',
  });
  if (!isOpenTooltip) return null;

  return (
    <div
      className="flex gap-1 p-1"
      ref={(ref) => setPopperElement(ref as HTMLDivElement)}
      style={styles.popper}
      onMouseEnter={() => setIsOpenTooltip(true)}
      onMouseLeave={() => setIsOpenTooltip(false)}
      {...attributes.popper}
    >
      {children}
    </div>
  );
};
