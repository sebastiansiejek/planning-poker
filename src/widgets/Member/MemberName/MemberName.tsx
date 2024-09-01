import Skeleton from 'react-loading-skeleton';

import type { MemberNameProps } from '@/widgets/Member/MemberName/types';

export const MemberName = ({ name, isLoading }: MemberNameProps) => {
  return (
    <div className="font-semibold mt-2">
      {isLoading ? <Skeleton height={12} width={80} /> : name}
    </div>
  );
};
