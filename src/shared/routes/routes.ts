export const routes = {
  api: {
    roomRealtimeToken: { getPath: (roomId: string) => `/api/rooms/${encodeURIComponent(roomId)}/realtime-token` },
  },
  home: {
    getPath: () => '/',
  },
  game: {
    create: {
      getPath: () => '/game/create',
    },
    join: {
      getPath: () => '/game/join',
    },
    singleGame: {
      getPath: (gameId: string) => `/game/${gameId}`,
    },
  },
  login: {
    getPath: () => '/login',
  },
  dashboard: {
    getPath: () => '/dashboard',
  },
  userSettings: {
    getPath: () => '/dashboard/user-settings',
  },
};
