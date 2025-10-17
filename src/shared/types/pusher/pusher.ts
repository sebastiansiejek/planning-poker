export type PusherMember = {
  id: string;
  name: string;
  vote?: string | number;
};

export type PusherNewMember = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type PusherNotification = {
  type: 'alarm' | 'paper';
};
