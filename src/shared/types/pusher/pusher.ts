export type PusherMember = {
  id: string;
  name: string;
  vote?: string | number;
  avatarUrl?: string;
};

export type PusherNewMember = {
  id: string;
  info: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
};

export type PusherNotification = {
  type: 'alarm' | 'paper';
};
