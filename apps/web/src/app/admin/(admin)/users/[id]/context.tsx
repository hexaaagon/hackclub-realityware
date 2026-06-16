"use client";
import type { account } from "@realityware/database/schema/user";
import { createContext, useState } from "react";

export type ContextUser = {
  user: typeof account.$inferSelect;
  setUser: React.Dispatch<React.SetStateAction<typeof account.$inferSelect>>;
};
export const userContext = createContext<ContextUser>({} as any);

export function ContextProvider({
  children,
  content,
}: {
  children: React.ReactNode;
  content: { user: ContextUser["user"] };
}) {
  const [user, setUser] = useState<ContextUser["user"]>(content.user);

  const shareDataUseState = {
    user,
    setUser,
  };

  return (
    <userContext.Provider value={{ ...shareDataUseState }}>
      {children}
    </userContext.Provider>
  );
}
