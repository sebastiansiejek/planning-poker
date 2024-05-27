'use client'

import Pusher from "pusher-js";
import {useEffect, useState} from "react";
import {getPusherUserId} from "@/shared/pusher/lib/getPusherUserId";
import {PusherMember, PusherMembers} from "@/types/pusher/pusher";

// Pusher.logToConsole = process.env.NODE_ENV === "development";

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  authEndpoint: "/api/pusher-auth", // OPTIONAL: For secure web sockets.
  authTransport: "ajax",
  auth: {
    params: {
      userInfo: JSON.stringify({
        name: "John Doe",
        id: getPusherUserId()
      })
    }
  },
});


export default function Page() {
  const GAME_CHANNEL = "presence-game-channel";
  const [members, setMembers] = useState([] as PusherMember[])

  useEffect(() => {
    const channel = pusher.subscribe(GAME_CHANNEL);

    channel.bind('pusher:subscription_succeeded', function (members: PusherMembers) {
      setMembers(Object.values(members.members));
    })

    return () => {
      pusher.unsubscribe(GAME_CHANNEL);
    }
  }, []);

  return (
    <div>
      <h1>Game</h1>
      {members.map((member) => (
        <div key={member.id}>{member.name}</div>
      ))}
    </div>
  );
}
