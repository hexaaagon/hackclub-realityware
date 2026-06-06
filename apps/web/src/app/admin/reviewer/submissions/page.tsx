"use server";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

export default async function SubmissionsPage() {
  return (
    <main>
      <div>
        <h2 className="text-2xl">Submissions</h2>
      </div>
      <ChartAreaInteractive />
    </main>
  );
}
