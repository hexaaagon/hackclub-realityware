"use client";
import type { account } from "@realityware/database/schema/user";
import { createContext, useState } from "react";

export type Account = {
  user: typeof account.$inferSelect;
  setUser: React.Dispatch<React.SetStateAction<typeof account.$inferSelect>>;
};
export const userContext = createContext<Account>({} as any);

export function ContextProvider({
  children,
  content
}: {
  children: React.ReactNode;
  content: { user: Account["user"] }
}) {
  const [user, setUser] = useState<typeof account.$inferSelect>(content.user);

  const shareDataUseState = {
    user,
    setUser,
  };

  return (
    <userContext.Provider value={{ ...shareDataUseState }}>
      {children}
    </userContext.Provider>
  )
}
