import type { User } from '@prisma/client';

import { ApiClient } from '@/shared/api/api-client';
import type { UserUpsertPayload } from '@/shared/types/user/user';

export class ApiUserClient extends ApiClient {
  async update(payload: UserUpsertPayload) {
    const { data, ...rest } = await this.fetcher<User>('api/user', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return {
      ...rest,
      data,
    };
  }
}
