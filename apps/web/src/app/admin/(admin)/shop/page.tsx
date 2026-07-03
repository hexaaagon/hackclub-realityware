"use server";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

export default async function ShopPage() {
  return (
    <main>
      <div>
        <h2 className="text-2xl">Shop</h2>
      </div>
      <ChartAreaInteractive />
    </main>
  );
}
