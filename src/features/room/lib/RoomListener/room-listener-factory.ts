import { RoomPrismaListener } from '@/features/room/lib/RoomListener/room-prisma-listener';

export const RoomListenerFactory = {
  getService(roomId: string) {
    return new RoomPrismaListener(roomId);
  },
};
