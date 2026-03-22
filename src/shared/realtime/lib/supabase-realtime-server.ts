import 'server-only';

type BroadcastPayload = Record<string, unknown>;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const broadcastToRealtime = async (
  topic: string,
  event: string,
  payload: BroadcastPayload,
) => {
  const response = await fetch(`${supabaseUrl}/realtime/v1/api/broadcast`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      apikey: supabaseServiceRoleKey,
    },
    body: JSON.stringify({
      messages: [
        {
          topic,
          event,
          payload,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Supabase broadcast failed with status ${response.status}`);
  }
};
