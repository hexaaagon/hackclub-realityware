"use client";
import { createContext, useState } from "react";
import type { BreadCrumbOptions } from "./site-header";

export const breadCrumbContext = createContext<BreadCrumbContext>({} as any);
export type BreadCrumbContext = {
  type: BreadCrumbOptions["type"];
  setType: React.Dispatch<React.SetStateAction<BreadCrumbOptions["type"]>>;

  params: BreadCrumbOptions["params"];
  setParams: React.Dispatch<React.SetStateAction<BreadCrumbOptions["params"]>>;
};

export function BreadCrumbContextProvider({
  children,
  type: initialType,
}: {
  children: React.ReactNode;
  type: BreadCrumbOptions["type"];
}) {
  const [type, setType] = useState<BreadCrumbOptions["type"]>(initialType);
  const [params, setParams] = useState<BreadCrumbOptions["params"]>();

  const shareDataUseState = {
    type,
    setType,
    params,
    setParams,
  };

  return (
    <breadCrumbContext.Provider value={{ ...shareDataUseState }}>
      {children}
    </breadCrumbContext.Provider>
  );
}
