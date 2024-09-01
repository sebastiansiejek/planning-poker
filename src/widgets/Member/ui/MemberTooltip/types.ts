import type { PropsWithChildren } from 'react';

export type MemberTooltipProps = PropsWithChildren<{
  isOpenTooltip: boolean;
  setIsOpenTooltip: (isOpen: boolean) => void;
  triggerElem: HTMLDivElement | null;
}>;
