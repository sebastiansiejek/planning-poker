import type { PropsWithChildren } from 'react';

export type MemberTooltipParameters = PropsWithChildren<{
  isOpenTooltip: boolean;
  setIsOpenTooltip: (isOpen: boolean) => void;
  triggerElem: HTMLDivElement | null;
}>;
