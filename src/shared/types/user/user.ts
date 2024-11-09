import z from 'zod';

export const UserUpsertPayloadSchema = z.object({
  name: z.string(),
});

// type
export type UserUpsertPayload = z.infer<typeof UserUpsertPayloadSchema>;
