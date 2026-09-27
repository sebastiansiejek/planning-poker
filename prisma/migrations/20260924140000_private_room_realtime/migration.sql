CREATE OR REPLACE FUNCTION public.can_receive_room_realtime()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    EXISTS (
      SELECT 1
      FROM public.participants AS participant
      WHERE participant.id = auth.jwt() ->> 'participant_id'
        AND participant."roomId" = auth.jwt() ->> 'room_id'
        AND participant."userId" = auth.jwt() ->> 'sub'
        AND participant."leftAt" IS NULL
    )
    AND realtime.topic() IN (
      'room:' || (auth.jwt() ->> 'room_id') || ':events',
      'room:' || (auth.jwt() ->> 'room_id') || ':notifications'
    );
$$;

REVOKE ALL ON FUNCTION public.can_receive_room_realtime() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_receive_room_realtime() TO authenticated;

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "active room participants receive private events"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  extension IN ('broadcast', 'presence')
  AND public.can_receive_room_realtime()
);
