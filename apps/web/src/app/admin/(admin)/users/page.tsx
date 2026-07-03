"use server";
import { client } from "@realityware/rpc-backend";
import { headers } from "next/headers";
import ServerError from "../../(partials)/error-pages/server-error";
import UsersPageClient from "./page.client";

export default async function UsersPage() {
  const headerList = await headers();
  const data = await (
    await client.admin.users.$get(
      {},
      {
        headers: Object.fromEntries(headerList.entries()),
      },
    )
  ).json();

  if (!data.success) return <ServerError reason={data} />;

  return <UsersPageClient data={data} />;
}
