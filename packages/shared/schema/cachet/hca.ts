import z from "zod";

export const userInfoSchema = z.object({
  sub: z.string(),
  email: z.email(),
  email_verified: z.boolean(),
  name: z.string(),
  given_name: z.string(),
  family_name: z.string(),
  nickname: z.string(),
  updated_at: z.number(),
  slack_id: z.string(),
  verification_status: z.enum([
    "needs_submission",
    "pending",
    "verified",
    "ineligible",
  ]),
  ysws_eligible: z.boolean(),
  // address
});
