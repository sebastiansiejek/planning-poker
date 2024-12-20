export const PUSHER_EVENTS = {
  SUBSCRIPTION_SUCCEEDED: 'pusher:subscription_succeeded',
  MEMBER_ADDED: 'pusher:member_added',
  MEMBER_REMOVED: 'pusher:member_removed',
  VOTED: 'voted',
  SHOW_VOTES: 'SHOW_VOTES',
  REVEAL_VOTES: 'REVEAL_VOTES',
  RESET_VOTES: 'RESET_VOTES',
  USER_ID: (id: string) => `USER_ID:${id}`,
  PAPER_THROWN: 'PAPER_THROWN',
};
