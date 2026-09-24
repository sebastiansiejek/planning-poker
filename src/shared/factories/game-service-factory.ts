import type { Game } from '@prisma/client';

import { PrismaGameService } from '@/shared/api/services/prisma/prisma-game-service';

type GameSummary = Pick<Game, 'description' | 'id' | 'name' | 'status'>;

export type GameService = {
  getLatestRoomGame: (roomId: string) => Promise<GameSummary | null>;
  create: (data: {
    name?: string;
    roomId: string;
    description?: string;
  }) => Promise<{
    id: string;
  }>;
  getActiveGame: (data: { roomId: string }) => Promise<number>;
  finishGame: ({
    roomId,
    gameId,
  }: {
    roomId: string;
    gameId: string;
  }) => Promise<{
    id: string;
  }>;
};

export const GameServiceFactory = {
  getService(): GameService {
    return new PrismaGameService();
  },
};
