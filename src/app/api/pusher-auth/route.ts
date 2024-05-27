import {pusherServer} from "@/shared/pusher/lib/pusherServer";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const formData = await req.formData()
  // TODO: add zod validation
  const socketId = formData.get("socket_id") as string
  const channelName = formData.get("channel_name") as string
  const {id: user_id, ...user} = JSON.parse(formData.get("userInfo") as string)

  const auth = pusherServer.authorizeChannel(
    socketId,
    channelName,
    {
      user_id: user_id,
      user_info: {
        user_id,
        ...user
      }
    }
  )

  return Response.json(auth)
}
