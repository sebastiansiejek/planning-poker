import type {
  ApiSessionClientGetSessionParameters,
  ApiSessionClientGetSessionResponse,
} from '@/shared/api/session/api-session-client.types';

export class ApiSessionClient {

  async getSession({ cookie, url }: ApiSessionClientGetSessionParameters) {
    const response = await fetch(`${url}/api/check-session`, {
      headers: {
        Cookie: cookie,
      },
    });

    const data = await response.json();

    return {
      status: response.status,
      data,
    } as ApiSessionClientGetSessionResponse;
  }
}
