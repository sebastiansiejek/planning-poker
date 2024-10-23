'use client';

import type { Game } from '@prisma/client';
import type { Dispatch, PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useReducer } from 'react';

export type RoomContextType = {
  currentUserId?: string;
  vote?: string;
  roomId?: string;
  game?: Pick<Game, 'id' | 'name' | 'description' | 'status'>;
};

type Action =
  | {
      type: 'SET_CURRENT_USER_ID';
      payload: Pick<RoomContextType, 'currentUserId'>;
    }
  | {
      type: 'SET_VOTE';
      payload: {
        value: string;
      };
    }
  | {
      type: 'SET_GAME';
      payload: RoomContextType['game'];
    };

export const RoomContext = createContext<{
  room: RoomContextType | null;
  dispatch: Dispatch<Action>;
}>({
  room: null,
  dispatch: () => {},
});

const roomReducer = (
  state: RoomContextType | null,
  action: Action,
): RoomContextType | null => {
  switch (action.type) {
    case 'SET_CURRENT_USER_ID':
      return {
        ...state,
        currentUserId: action.payload.currentUserId,
      };
    case 'SET_VOTE':
      return {
        ...state,
        vote: action.payload.value,
      };
    case 'SET_GAME':
      return {
        ...state,
        game: action.payload,
      };
    default:
      return state;
  }
};

export const RoomProvider = ({
  children,
  currentUserId,
  roomId,
  game,
}: PropsWithChildren<
  Pick<RoomContextType, 'currentUserId' | 'roomId' | 'game'>
>) => {
  const [room, dispatch] = useReducer(roomReducer, {
    currentUserId,
    roomId,
    game,
  });
  const defaultValue = useMemo(() => ({ room, dispatch }), [room]);

  return (
    <RoomContext.Provider value={defaultValue}>{children}</RoomContext.Provider>
  );
};

export const useRoomContext = () => {
  const context = useContext(RoomContext);

  if (context === null) {
    throw new Error('useRoomContext must be used within a RoomProvider');
  }

  return context;
};
