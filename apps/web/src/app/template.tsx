import { ReactScan } from "@/components/react-scan";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ReactScan />
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Toaster />
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
    </>
  );
}
