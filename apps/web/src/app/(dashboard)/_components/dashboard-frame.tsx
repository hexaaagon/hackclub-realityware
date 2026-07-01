/** The 4 crop-mark corner squares for the framed canvas (copied from home/page.tsx). */
export function CropMarks() {
  return (
    <>
      <div className="absolute top-0 left-0 z-20 size-[33.5px] border-black/20 border-r-2 border-b-2" />
      <div className="absolute top-0 right-0 z-20 size-[33.5px] border-black/20 border-b-2 border-l-2" />
      <div className="absolute bottom-0 left-0 z-20 size-[33.5px] border-black/20 border-t-2 border-r-2" />
      <div className="absolute right-0 bottom-0 z-20 size-[33.5px] border-black/20 border-t-2 border-l-2" />
    </>
  );
}

/** Faint giant "RW" watermark sitting behind the dashboard content. */
export function RwWatermark() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 grid select-none place-items-center font-sacco text-[28vw] text-black/[0.035] leading-none"
    >
      RW
    </span>
  );
}
