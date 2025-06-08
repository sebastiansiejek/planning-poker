import { RoomFirebaseListener } from '@/features/room/lib/RoomListener/RoomFirebaseListener';
import { RoomPrismaListener } from '@/features/room/lib/RoomListener/RoomPrismaListener';

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
