"use server";

export async function passwordVerify(password: string, hash: string) {
  return await Bun.password.verify(password, hash);
}

export async function passwordVerifyPreProduction(password: string) {
  console.log(process.env.NEXT_PUBLIC_PREPRODUCTION_PASSWORD);
  const hash = atob(process.env.NEXT_PUBLIC_PREPRODUCTION_PASSWORD);
  console.log(hash);

  return await Bun.password.verify(password, hash);
}
