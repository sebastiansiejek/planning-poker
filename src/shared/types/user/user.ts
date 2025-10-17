import z from 'zod';

export const UserUpsertPayloadSchema = z.object({
  name: z.string(),
});

export type UserUpsertPayload = z.infer<typeof UserUpsertPayloadSchema>;

export type User = {
  id: string;
  email: string;
  image: string;
  name: string;
};
