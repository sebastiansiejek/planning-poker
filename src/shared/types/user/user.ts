import z from 'zod';

export const UserUpsertPayloadSchema = z.object({
  name: z.string().trim().min(1).max(100),
});

export type UserUpsertPayload = z.infer<typeof UserUpsertPayloadSchema>;

export type User = {
  id: string;
  email: string;
  image: string;
  name: string;
};
