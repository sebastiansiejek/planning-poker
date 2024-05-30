import Room from "@/app/game/[...room]/Room";
import {redirect} from "next/navigation";
import {UserModel} from "@/shared/user/model/UserModel";

export default async function Page({params}: {
  params: {
    room: string[]
  }
}) {
  const userName = UserModel.getUserName();
  const room = params.room.toString()

  if (!userName) {
    redirect(`/login?room=${room}`)
  }

  const channelName = `presence-${room}`;

  return (
    <Room channelName={channelName} userName={userName}/>
  )
}
