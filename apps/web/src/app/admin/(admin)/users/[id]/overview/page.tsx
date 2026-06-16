"use client";
import { useContext, useEffect } from "react";
import { breadCrumbContext } from "@/app/admin/(_nav)/site-provider";
import { userContext } from "../context";

export default function UserPage() {
  const { setParams } = useContext(breadCrumbContext);
  const { user } = useContext(userContext);

  useEffect(() => {
    setParams([
      {
        i: 2,
        s: [user.displayName, user.id],
      },
    ]);
  }, [setParams, user]);

  return (
    <main>
      <div>
        <h2 className="text-2xl">User</h2>
      </div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </main>
  );
}
