'use server'

import {pusherServer} from "@/shared/pusher/lib/pusherServer";

export const voting = async (data: FormData) => {
  const userId = data.get("userId");
  const value = data.get("value");
  const channelName = data.get("channelName") as string;

  await pusherServer.trigger(channelName, "voting", {userId, value});
}
