export const routes = {
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
