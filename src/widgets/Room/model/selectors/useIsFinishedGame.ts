import { useRoomContext } from '@/widgets/Room/model/RoomContext';

export const useIsFinishedGame = () => {
  const { room } = useRoomContext();

  return room?.game?.status === 'FINISHED';
};
