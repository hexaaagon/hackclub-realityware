"use server";

export async function passwordVerify(password: string, hash: string) {
  return await Bun.password.verify(password, hash);
}
