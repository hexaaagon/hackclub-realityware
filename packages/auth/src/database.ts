import { db } from "@realityware/database";
import { personalInfo } from "@realityware/database/schema/hackclub";
import { account } from "@realityware/database/schema/user";
import { encryptData } from "@realityware/util/crypto";
import type { AuthContext, GenericEndpointContext, User } from "better-auth";

export async function userRegistration(
  user: User,
  ctx: GenericEndpointContext | null,
) {
  console.log("Registering user in database:", user);

  // biome-ignore lint/style/noNonNullAssertion: we know this will always return a value since we're inserting a new account
  const accountData = (
    await db
      .insert(account)
      .values({
        userId: user.id,
        email: user.email,
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
