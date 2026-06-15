"use client";
import { useContext } from "react";
import { SiteBody } from "@/app/admin/(_nav)/site-body";
import { SiteHeader } from "@/app/admin/(_nav)/site-header";
import { userContext } from "./context";

export default function UserPage() {
  const { user } = useContext(userContext);

  return (
    <>
      <SiteHeader
        type="admin"
        params={[
          {
            i: 2,
            s: [user.displayName],
          },
        ]}
      />
      <SiteBody className="flex flex-col gap-2">
        <div>
          <h2 className="text-2xl">User</h2>
        </div>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </SiteBody>
    </>
  );
}
