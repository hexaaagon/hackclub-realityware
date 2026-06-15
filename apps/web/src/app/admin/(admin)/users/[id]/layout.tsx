import type { account } from "@realityware/database/schema/user";
import { client } from "@realityware/rpc-backend";
import { headers } from "next/headers";
import ServerError from "@/app/admin/(partials)/error-pages/server-error";
import { ContextProvider } from "./context";

export default async function UserLayout({
  children,
  params,
}: LayoutProps<"/admin/users/[id]">) {
  const { id } = await params;
  const headerList = await headers();

  const response = await client.admin.users[":id"].$get(
    {
      param: { id },
    },
    {
      headers: Object.fromEntries(headerList.entries()),
    },
  );
  const data = (await response.json()) as
    | {
        success: false;
        message: string;
      }
    | {
        success: true;
        user: typeof account.$inferSelect;
      };

  if (!data.success) return <ServerError reason={data} />;

  return (
    <ContextProvider content={{ user: data.user }}>{children}</ContextProvider>
  );
}
