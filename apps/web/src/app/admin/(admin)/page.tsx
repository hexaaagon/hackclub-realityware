"use server";
import { SiteBody } from "@/app/admin/(_nav)/site-body";
import { SiteHeader } from "@/app/admin/(_nav)/site-header";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

export default async function Page() {
  return (
    <>
      <SiteHeader type="admin" />
      <SiteBody>
        <div>
          <h2 className="text-2xl">Dashboard</h2>
        </div>
        <ChartAreaInteractive />
      </SiteBody>
    </>
  );
}
