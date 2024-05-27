import Pusher from "pusher-js";
import {PusherMember} from "@/types/pusher/pusher";
import {getPusherUserId} from "@/shared/pusher/lib/getPusherUserId";

export const pusherClient = (userInfo: Omit<PusherMember, 'id'>) => new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  authEndpoint: "/api/pusher-auth", // OPTIONAL: For secure web sockets.
  authTransport: "ajax",
  auth: {
    params: {
      userInfo: JSON.stringify({...userInfo, id: getPusherUserId()}),
    }
  },
});
