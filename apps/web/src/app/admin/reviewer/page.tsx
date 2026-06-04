"use client";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { adminCrumbs } from "../(nav)/_breadcrumb";
import { SiteBody } from "../(nav)/site-body";
import { SiteHeader } from "../(nav)/site-header";

export default function Page() {
  return (
    <>
      <SiteHeader breadcrumbs={adminCrumbs} />
      <SiteBody>
        <ChartAreaInteractive />
      </SiteBody>
    </>
  );
}
