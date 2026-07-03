"use server";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

export default async function Page() {
  return (
    <main>
      <div>
        <h2 className="text-2xl">Reviewer Dashboard</h2>
      </div>
      <ChartAreaInteractive />
    </main>
  );
}
