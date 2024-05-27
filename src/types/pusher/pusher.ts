export type PusherMember = {
  id: string;
  name: string;
  vote?: string | number;
}

export type PusherMembers = {
  count: number;
  me: PusherMember;
  members: Record<string, PusherMember>;
  myID: string;
}
