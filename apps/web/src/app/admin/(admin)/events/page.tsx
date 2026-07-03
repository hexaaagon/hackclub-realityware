"use server";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

export default async function EventsPage() {
  return (
    <main>
      <div>
        <h2 className="text-2xl">Events</h2>
      </div>
      <ChartAreaInteractive />
    </main>
  );
}
