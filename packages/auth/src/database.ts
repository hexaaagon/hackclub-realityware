import { betterFetch } from "@better-fetch/fetch";
import { db, eq } from "@realityware/database";
import { personalInfo } from "@realityware/database/schema/hackclub";
import { account } from "@realityware/database/schema/user";
import { userInfoSchema } from "@realityware/shared/schema/cachet/hca";
import { profileSchema } from "@realityware/shared/schema/cachet/profile";
import { encryptData } from "@realityware/util/crypto";
import type { User } from "better-auth";
import { auth } from ".";

export async function userRegistration(user: User) {
  const existingAccount = await db
    .select({ id: account.id })
    .from(account)
    .where(eq(account.userId, user.id))
    .limit(1);

  if (existingAccount.length > 0) {
    return;
  }

  const hcaApiKey = await auth.api.getAccessToken({
    body: {
      providerId: "hca",
      userId: user.id,
    },
  });

  const hcaData = await betterFetch(
    "https://auth.hackclub.com/oauth/userinfo",
    {
      output: userInfoSchema,
      headers: {
        Authorization: `Bearer ${hcaApiKey.accessToken}`,
      },
    },
  );

  if (!hcaData.data) {
    throw new Error(
      `Failed to fetch user info from HCA: ${hcaData.error?.message ?? "Unknown error"}`,
    );
  }

  const profile = await betterFetch(
    `https://cachet.dunkirk.sh/users/${hcaData.data.slack_id}`,
    {
      output: profileSchema,
    },
  );

  if (!profile.data || "message" in profile.data) {
    throw new Error(
      `Failed to fetch user profile from Cachet: ${profile.error?.message ?? "Unknown error"}`,
    );
  }

  // biome-ignore lint/style/noNonNullAssertion: we know this will always return a value since we're inserting a new account
  const accountData = (
    await db
      .insert(account)
      .values({
        userId: user.id,
        email: user.email,
        slackId: hcaData.data.slack_id,
        displayName: profile.data.displayName,
        avatar: profile.data.imageUrl,
      })
      .returning()
  )[0]!;

  const loremData = "lorem ipsum bla bla";
  const encryptedLoremData = await encryptData(loremData);

  // TODO: hack club personal data inserting thing
  await db.insert(personalInfo).values({
    id: accountData.id,
    email: user.email,
    e_firstName: encryptedLoremData,
    e_lastName: encryptedLoremData,
    e_addressOne: encryptedLoremData,
    e_addressTwo: encryptedLoremData,
    e_city: encryptedLoremData,
    e_state: encryptedLoremData,
    e_country: encryptedLoremData,
    e_zipCode: encryptedLoremData,
    e_birthdate: encryptedLoremData,
  });
}
