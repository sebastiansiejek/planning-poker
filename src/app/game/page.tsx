'use client'

import {useEffect, useState} from "react";
import {PusherMember, PusherMembers} from "@/types/pusher/pusher";
import {pusherClient} from "@/shared/pusher/lib/pusherClient";

// Pusher.logToConsole = process.env.NODE_ENV === "development";


export default function Page() {
  const GAME_CHANNEL = "presence-game-channel";
  const [members, setMembers] = useState([] as PusherMember[])

  useEffect(() => {
    const pusher = pusherClient({name: "John Doe"});
    const channel = pusher.subscribe(GAME_CHANNEL);

    channel.bind('pusher:subscription_succeeded', function (members: PusherMembers) {
      setMembers(Object.values(members.members));
    })

    return () => {
      pusher.unsubscribe(GAME_CHANNEL);
    }
  }, []);
  console.log(members)

  return (
    <div>
      <h1>Game</h1>
      {members.map((member) => (
        <div key={member.id}>{member.name} {member.id}</div>
      ))}
    </div>
  );
}
