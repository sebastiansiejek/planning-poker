'use client';

import type { Game } from '@prisma/client';
import type { Dispatch, PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useReducer } from 'react';

export type RoomContextType = {
  roomId: string;
  vote?: string;
  game?: Pick<Game, 'id' | 'name' | 'description' | 'status'>;
};

const initialState: RoomContextType = {
  roomId: '',
};

type Action =
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
  room: RoomContextType;
  dispatch: Dispatch<Action>;
}>({
  room: initialState,
  dispatch: () => {},
});

const roomReducer = (
  state: RoomContextType,
  action: Action,
): RoomContextType => {
  switch (action.type) {
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
  roomId,
  game,
}: PropsWithChildren<Pick<RoomContextType, 'roomId' | 'game'>>) => {
  const [room, dispatch] = useReducer(roomReducer, {
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
