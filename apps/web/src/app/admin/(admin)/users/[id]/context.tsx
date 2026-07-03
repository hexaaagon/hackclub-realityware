"use client";
import type { UserInfo } from "@realityware/database/types/user.d";
import { createContext, useState } from "react";

export type ContextUser = {
  user: UserInfo;
  setUser: React.Dispatch<React.SetStateAction<UserInfo>>;
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
