import type { Session } from 'next-auth';

import type { ResponseCommon } from '@/shared/api/api.types';

export type ApiSessionClientGetSessionParameters = {
  cookie: string;
  url: string;
};

export type ApiSessionClientGetSessionResponse = ResponseCommon<
  {
    message: string;
  } & Session
>;
