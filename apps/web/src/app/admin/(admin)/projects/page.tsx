"use server";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

export default async function ProjectsPage() {
  return (
    <main>
      <div>
        <h2 className="text-2xl">Projects</h2>
      </div>
      <ChartAreaInteractive />
    </main>
  );
}
