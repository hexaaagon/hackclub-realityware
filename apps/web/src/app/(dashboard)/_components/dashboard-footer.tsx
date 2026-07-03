import { Marquee } from "@/components/motion";

const TAGS = ["26 GREEN", "MADE BY TEENAGERS", "BUILD FOR REAL", "SHIP IT"];

/** Brand ticker + bottom-of-canvas footer with bracket marks. */
export function DashboardFooter() {
  return (
    <footer className="relative z-10 mt-auto">
      <Marquee
        className="border-black/20 border-t-2 bg-card py-1.5 font-medium text-black/55 text-xs uppercase tracking-widest"
        speed={22}
      >
        {TAGS.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-3">
            {tag}
            <span className="text-orange">•</span>
          </span>
        ))}
      </Marquee>
      <div className="flex items-center justify-center gap-2 py-4 text-black/40">
        <span aria-hidden className="font-sacco text-lg leading-none">
          [
        </span>
        <span className="font-sacco text-xs uppercase tracking-wide">
          Made by teenagers, for teenagers
        </span>
        <span aria-hidden className="font-sacco text-lg leading-none">
          ]
        </span>
      </div>
    </footer>
  );
}
