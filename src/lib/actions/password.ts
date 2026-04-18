"use server";

export async function passwordVerify(password: string, hash: string) {
  return await Bun.password.verify(password, hash);
}

export async function passwordVerifyPreProduction(password: string) {
  const hash = atob(process.env.NEXT_PUBLIC_PREPRODUCTION_PASSWORD);

  return await Bun.password.verify(password, hash);
}
