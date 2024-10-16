export const routes = {
  home: {
    getPath: () => '/',
  },
  game: {
    create: {
      getPath: () => `/game/create`,
    },
    join: {
      getPath: () => `/game/join`,
    },
    singleGame: {
      getPath: (gameId: string) => `/game/${gameId}`,
    },
  },
  login: {
    getPath: () => '/api/auth/signin',
  },
  dashboard: {
    getPath: () => '/dashboard',
  },
};
