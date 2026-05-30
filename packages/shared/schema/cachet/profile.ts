import z from "zod";

export const profileSchema = z.union([
  z.object({
    id: z.string(),
    userId: z.string(),
    displayName: z.string(),
    pronouns: z.string(),
    imageUrl: z.string(),
  }),
  z.object({
    message: z.string(),
  }),
]);
