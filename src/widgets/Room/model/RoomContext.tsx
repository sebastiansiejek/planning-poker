'use client';

import type { Dispatch, PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useReducer } from 'react';

type RoomContextType = {
  currentUserId?: string;
  vote?: string;
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
    default:
      return state;
  }
};

export const RoomProvider = ({ children }: PropsWithChildren) => {
  const [room, dispatch] = useReducer(roomReducer, null);
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
