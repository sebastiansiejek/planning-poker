import { useRoomContext } from '@/widgets/Room/model/room-context';

export const useIsFinishedGame = () => {
  const { room } = useRoomContext();

  return room?.game?.status === 'FINISHED';
};
