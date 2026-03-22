export type RealtimeMember = {
  id: string;
  name: string;
  vote?: string | number;
};

export type RealtimeNewMember = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type RealtimeNotification = {
  type: 'alarm' | 'paper';
};
