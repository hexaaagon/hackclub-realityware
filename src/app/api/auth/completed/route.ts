import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = await auth.api.getAccessToken();
  console.log(token.accessToken);

  return new Response(
    "wait the setup screen doesnt implemented yet, just wait lil bro",
  );
}
