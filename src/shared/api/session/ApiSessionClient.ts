import type {
  ApiSessionClientGetSessionParams,
  ApiSessionClientGetSessionResponse,
} from '@/shared/api/session/ApiSessionClient.types';

export class ApiSessionClient {
  // eslint-disable-next-line class-methods-use-this
  async getSession({ cookie, url }: ApiSessionClientGetSessionParams) {
    const res = await fetch(`${url}/api/check-session`, {
      headers: {
        Cookie: cookie,
      },
    });

    const data = await res.json();

    return {
      status: res.status,
      data,
    } as ApiSessionClientGetSessionResponse;
  }
}
