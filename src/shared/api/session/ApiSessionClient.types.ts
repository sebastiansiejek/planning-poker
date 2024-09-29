import type { Session } from 'next-auth';

import type { ResponseCommon } from '@/shared/api/api.types';

export type ApiSessionClientGetSessionParams = {
  cookie: string;
  url: string;
};

export type ApiSessionClientGetSessionResponse = ResponseCommon<
  {
    message: string;
  } & Session
>;
