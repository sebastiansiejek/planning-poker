import { useState } from 'react';
import { usePopper } from 'react-popper';

import type { MemberTooltipParameters } from '@/widgets/Member/ui/MemberTooltip/types';

export const MemberTooltip = ({
  children,
  triggerElem: memberReference,
  setIsOpenTooltip,
  isOpenTooltip,
}: MemberTooltipParameters) => {
  const [popperElement, setPopperElement] = useState<HTMLDivElement>();
  const { styles, attributes } = usePopper(memberReference, popperElement, {
    placement: 'top',
  });
  if (!isOpenTooltip) return null;

  return (
    <div
      className="flex gap-1 p-1"
      ref={(reference) => {
        setPopperElement(reference as HTMLDivElement);
      }}
      style={styles.popper}
      onMouseEnter={() => setIsOpenTooltip(true)}
      onMouseLeave={() => setIsOpenTooltip(false)}
      {...attributes.popper}
    >
      {children}
    </div>
  );
};
