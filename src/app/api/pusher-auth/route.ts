import z from 'zod';

import { pusherServer } from '@/shared/pusher/lib/pusherServer';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const formData = await req.formData();
  const socketId = formData.get('socket_id') as string;
  const channelName = formData.get('channel_name') as string;
  const userInfo = JSON.parse(formData.get('userInfo') as string);

  try {
    z.object({
      socketId: z.string(),
      channelName: z.string(),
      userInfo: z.object({
        id: z.string(),
        name: z.string(),
      }),
    }).parse({ socketId, channelName, userInfo });

    const { id: userId, ...user } = userInfo;

    const auth = pusherServer.authorizeChannel(socketId, channelName, {
      user_id: userId,
      user_info: {
        id: userId,
        ...user,
      },
    });

    return Response.json(auth);
  } catch (e) {
    return Response.json(e, {
      status: 400,
    });
  }
}
