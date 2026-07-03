import { env } from "@realityware/env";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: RouteContext<"/admin/users/[id]">,
) {
  const id = (await params).id;

  return NextResponse.redirect(
    `${env.NEXT_PUBLIC_APP_URL}/admin/users/${id}/overview`,
  );
}
