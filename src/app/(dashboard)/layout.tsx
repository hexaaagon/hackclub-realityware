export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="noise flex min-h-screen flex-col gap-2 p-3 px-4">
      {children}
    </main>
  );
}
