"use server";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

export default async function OrdersPage() {
  return (
    <main>
      <div>
        <h2 className="text-2xl">Orders</h2>
      </div>
      <ChartAreaInteractive />
    </main>
  );
}
