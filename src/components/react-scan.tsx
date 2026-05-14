"use client";
// biome-ignore assist/source/organizeImports: react-scan needs ts
import { scan } from "react-scan/all-environments";
import { type JSX, useEffect } from "react";

export function ReactScan() {
  useEffect(() => {
    scan({
      enabled: true,
      dangerouslyForceRunInProduction: true,
    });
  }, []);

  return <></>;
}
