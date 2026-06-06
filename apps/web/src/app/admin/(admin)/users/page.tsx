"use server";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

export default async function UsersPage() {
  return (
    <main>
      <div>
        <h2 className="text-2xl">Users</h2>
      </div>
      <ChartAreaInteractive />
    </main>
  );
}
