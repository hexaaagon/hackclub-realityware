"use server";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

export default async function AuditLogPage() {
  return (
    <main>
      <div>
        <h2 className="text-2xl">Audit Log</h2>
      </div>
      <ChartAreaInteractive />
    </main>
  );
}
