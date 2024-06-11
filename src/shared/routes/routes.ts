export const routes = {
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
