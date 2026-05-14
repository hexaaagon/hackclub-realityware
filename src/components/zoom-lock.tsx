"use client";

import { useEffect } from "react";

export default function ZoomLock() {
  useEffect(() => {
    const lockZoomLevel = () => {
      window.requestAnimationFrame(() => {
        const wrapper = document.getElementById("zoom-wrapper");
        if (!wrapper) return;

        const currentPixelRatio = window.devicePixelRatio || 1;
        const targetZoom = 1.25;
        const scaleFactor = targetZoom / currentPixelRatio;

        wrapper.style.setProperty("--zoom-scale", `${scaleFactor}`);

        if ("zoom" in wrapper.style) {
          wrapper.style.zoom = `${scaleFactor}`;
          wrapper.style.transform = "";
          wrapper.style.transformOrigin = "";
          wrapper.style.width = "";
          wrapper.style.height = "";
          return;
        }

        // Fallback for browsers without CSS zoom support
        (wrapper.style as any).transform = `scale(${scaleFactor})`;
        (wrapper.style as any).transformOrigin = "top left";
        (wrapper.style as any).width = `${100 / scaleFactor}%`;
        (wrapper.style as any).height = `${100 / scaleFactor}%`;
      });
    };

    lockZoomLevel();

    window.addEventListener("resize", lockZoomLevel);

    return () => {
      window.removeEventListener("resize", lockZoomLevel);
    };
  }, []);

  return null;
}
