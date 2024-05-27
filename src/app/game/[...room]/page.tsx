'use client'

import {useEffect, useState} from "react";
import {PusherMember, PusherMembers} from "@/types/pusher/pusher";
import {pusherClient} from "@/shared/pusher/lib/pusherClient";
import {voting} from "@/app/actions/voting";

const votingValues = [0, 1, 3, 5, 8, 13, '?', '☕️']
type Vote = { value: string, userId: string }

const pusher = pusherClient({name: "John Doe"});

export default function Page({params}: {
  params: {
    room: string
  }
}) {
  const channelName = `presence-${params.room.toString()}`;
  const [members, setMembers] = useState<PusherMember[]>([])
  const [votes, setVotes] = useState<Vote[]>([])
  const [me, setMe] = useState<PusherMember>()

  useEffect(() => {
    const channel = pusher.subscribe(channelName);

    channel.bind('pusher:subscription_succeeded', function (members: PusherMembers) {
      setMembers(Object.values(members.members));
      setMe(members.me)
    })

    channel.bind('voting', function (vote: Vote) {
      setVotes(votes => {
        const newVotes = votes.filter(v => v.userId !== vote.userId)
        return [...newVotes, vote]
      })
    });

    return () => {
      pusher.unsubscribe(channelName);
    }
  }, []);

  return (
    <div>
      <h1>Game</h1>
      {members.map((member) => {
        const vote = votes.find(vote => vote.userId === member.id)?.value

        return (
          <div key={member.id}>{member.name} {member.id} {vote}</div>
        )
      })}
      <form action={voting}>
        {votingValues.map((option) => (
          <label key={option}>
            <input
              name={'value'}
              type={'radio'}
              value={option}
              onClick={e => {
                e.currentTarget.form?.requestSubmit()
              }}
            />
            {option}
          </label>
        ))}
        <input type={'hidden'} name={'userId'} value={me?.id}/>
        <input type={'hidden'} name={'channelName'} value={channelName}/>
      </form>
    </div>
  );
}
