import type { RefObject } from 'react';

export type PaperTriggerProperties = {
  userId: string;
  memberRef: RefObject<HTMLDivElement | null>;
};
