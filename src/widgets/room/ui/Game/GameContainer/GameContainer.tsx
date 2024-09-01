import type { PropsWithChildren } from 'react';

export const GameContainer = ({ children }: PropsWithChildren) => {
  return (
    <div className="game-grid flex flex-col lg:grid lg:grid-cols-[12rem_1fr_12rem] lg:grid-rows-[repeat(3,0.6fr)] gap-8 justify-center min-h-20 items-center">
      {children}
    </div>
  );
};
