"use server";
import { SiteBody } from "@/app/admin/(nav)/site-body";
import { SiteHeader } from "@/app/admin/(nav)/site-header";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

export default async function Page() {
  return (
    <>
      <SiteHeader type="admin" />
      <SiteBody>
        <ChartAreaInteractive />
      </SiteBody>
    </>
  );
}
