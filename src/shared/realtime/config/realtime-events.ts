export const RealtimeEvents = {
  MEMBER_ADDED: 'MEMBER_JOIN_TO_ROOM',
  MEMBER_REMOVED: 'MEMBER_LEFT_ROOM',
  VOTED: 'voted',
  REVEAL_VOTES: 'REVEAL_VOTES',
  RESET_VOTES: 'RESET_VOTES',
  GAME_CREATED: 'GAME_CREATED',
  USER_ID: (id: string) => `USER_ID:${id}`,
  PAPER_THROWN: 'PAPER_THROWN',
} as const;

export const RealtimeTopics = {
  roomEvents: (roomId: string) => `room:${roomId}:events`,
  roomNotifications: (roomId: string) => `room:${roomId}:notifications`,
} as const;
