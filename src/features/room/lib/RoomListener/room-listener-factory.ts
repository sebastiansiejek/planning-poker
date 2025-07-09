import { RoomFirebaseListener } from '@/features/room/lib/RoomListener/room-firebase-listener';
import { RoomPrismaListener } from '@/features/room/lib/RoomListener/room-prisma-listener';

export const RoomListenerFactory = {
  getService(roomId: string) {
    const provider = process.env.NEXT_PUBLIC_DATABASE_PROVIDER;

    switch (provider) {
      case 'firebase': {
        return new RoomFirebaseListener(roomId);
      }
      case 'prisma': {
        return new RoomPrismaListener(roomId);
      }
      default: {
        throw new Error(`Unsupported database provider: ${provider}`);
      }
    }
  },
};
