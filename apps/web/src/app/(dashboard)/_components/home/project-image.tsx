import { cn } from "@realityware/util";
import Image from "next/image";

/**
 * Framed project image (torn-paper / `.noise` style). Falls back to a textured
 * placeholder box when there's no `src` (empty DB), so layouts stay intact.
 */
export function ProjectImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border-2 border-black/20 bg-card",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <div
          aria-hidden
          className="noise absolute inset-0 bg-gradient-to-br from-gray/35 via-card to-gray/15"
        />
      )}
    </div>
  );
}
