import { RoomPrismaListener } from '@/features/room/lib/RoomListener/RoomPrismaListener';

export class RoomListenerFactory {
  static getService(roomId: string) {
    const provider = process.env.NEXT_PUBLIC_DATABASE_PROVIDER;

    switch (provider) {
      case 'firebase':
        // TODO: implement that
        return new RoomPrismaListener(roomId);
      case 'prisma':
        return new RoomPrismaListener(roomId);
      default:
        throw new Error(`Unsupported database provider: ${provider}`);
    }
  }
}
