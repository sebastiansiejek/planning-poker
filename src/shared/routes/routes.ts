export const routes = {
  home: {
    getPath: () => '/',
  },
  game: {
    getPath: () => '/game',
    singleGame: {
      getPath: (gameId: string) => `${routes.game.getPath()}/${gameId}`,
    },
  },
  login: {
    getPath: (room?: string) => `/login${room ? `?room=${room}` : ''}`,
  },
};
