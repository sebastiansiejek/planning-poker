import { useRoomContext } from '@/widgets/room/model/room-context';

export const useIsFinishedGame = () => {
  const { room } = useRoomContext();

  return room?.game?.status === 'FINISHED';
};
