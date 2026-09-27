-- Application data is served by Prisma, never directly by browser roles.
-- RLS without browser policies denies access even if Supabase default grants exist.
DO $$
DECLARE
  app_table text;
BEGIN
  FOREACH app_table IN ARRAY ARRAY[
    'users', 'accounts', 'sessions', 'verification_requests', 'rooms',
    'games', 'participants', 'room_invitations', 'votes', '_prisma_migrations'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', app_table);
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon, authenticated', app_table);
  END LOOP;
END;
$$;

-- Retain the previous migration unchanged: it has already been applied locally.
-- A restrictive policy prevents any other permissive policy from bypassing room scope.
CREATE POLICY "room token scope is required"
ON realtime.messages AS RESTRICTIVE
FOR SELECT TO authenticated
USING (
  extension = 'broadcast'
  AND auth.jwt() ->> 'iss' = 'planning-poker'
  AND public.can_receive_room_realtime()
);

-- Browsers consume app events. Only the server may publish them.
CREATE POLICY "room clients cannot publish"
ON realtime.messages AS RESTRICTIVE
FOR INSERT TO authenticated
WITH CHECK (false);
