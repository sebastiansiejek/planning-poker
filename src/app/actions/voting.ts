'use server'

import {pusherServer} from "@/shared/pusher/lib/pusherServer";

export const voting = async (data: FormData) => {
  const userId = data.get("userId");
  const value = data.get("value");

  await pusherServer.trigger("presence-game-channel", "voting", {userId, value});
}
