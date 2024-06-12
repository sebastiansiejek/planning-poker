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

export type PusherMembers = {
  count: number;
  me: PusherMember;
  members: Record<string, PusherMember>;
  myID: string;
};
