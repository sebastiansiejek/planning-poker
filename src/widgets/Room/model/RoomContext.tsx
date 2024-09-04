'use client';

import type { Dispatch, PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useReducer } from 'react';

type RoomContextType = {
  currentUserId?: string;
};

type Action = {
  type: 'SET_CURRENT_USER_ID';
  payload: Pick<RoomContextType, 'currentUserId'>;
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
      return action.payload;
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
