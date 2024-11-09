import { useSession } from 'next-auth/react';
import useSWRMutation from 'swr/mutation';

import { ApiUserClient } from '@/shared/api/me/ApiUserClient';
import type { UserUpsertPayload } from '@/shared/types/user/user';

export const useUpdateUserSettings = () => {
  const { update: updateSession } = useSession();

  return useSWRMutation(
    'UPDATE_USER_SETTINGS',
    async (_, { arg }: { arg: UserUpsertPayload }) => {
      const apiUserClient = new ApiUserClient();
      const { data } = await apiUserClient.update(arg);
      await updateSession();

      return data;
    },
  );
};
