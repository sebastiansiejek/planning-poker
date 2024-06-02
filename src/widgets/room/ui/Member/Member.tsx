import { cva } from 'class-variance-authority';

import type { MemberProps } from '@/widgets/room/ui/Member/types';

export const Member = ({ id, name, isVoted }: MemberProps) => {
  return (
    <div className="flex items-center flex-col min-w-16 min-h-28 text-center">
      <div
        key={id}
        className={cva('h-20 w-16 items-center justify-center rounded', {
          variants: {
            isVoted: {
              true: 'bg-primary-500',
              false: 'bg-gray-200',
            },
          },
        })({ isVoted })}
      />
      <div className="font-semibold mt-2">{name}</div>
    </div>
  );
};
