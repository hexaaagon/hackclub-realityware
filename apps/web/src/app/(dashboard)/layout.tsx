import { CityGate } from "./_components/city-picker";
import { DashboardFooter } from "./_components/dashboard-footer";
import { CropMarks, RwWatermark } from "./_components/dashboard-frame";
import { DashboardTopBar } from "./_components/dashboard-top-bar";
import { ParticipantSidebar } from "./_components/participant-sidebar";
import { getDashboardData } from "./_data";

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const data = await getDashboardData();

  return (
    <div className="min-h-screen w-full bg-background p-3 font-sans tracking-tight">
      <div className="noise relative flex min-h-[calc(100dvh-1.5rem)] overflow-hidden border-2 border-black/20 bg-background">
        <CropMarks />
        <ParticipantSidebar data={data} />
        <div className="relative isolate flex min-w-0 flex-1 flex-col">
          <RwWatermark />
          <DashboardTopBar onlineCount={data.onlineCount} data={data} />
          <main className="relative z-10 flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          <DashboardFooter />
        </div>
      </div>
      <CityGate />
    </div>
  );
}
