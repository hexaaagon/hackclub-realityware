"use server";
import { client } from "@realityware/rpc-backend";
import { headers } from "next/headers";
import ServerError from "../../(partials)/error-pages/server-error";
import ProjectsPageClient from "./page.client";

export default async function UsersPage() {
  const headerList = await headers();
  const data = await (
    await client.admin.projects.$get(
      {},
      {
        headers: Object.fromEntries(headerList.entries()),
      },
    )
  ).json();

  if (!data.success) return <ServerError reason={data} />;

  return <ProjectsPageClient {...data} />;
}
