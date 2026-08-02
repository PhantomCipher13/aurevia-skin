"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const dotPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });

  const lerp = useCallback(
    (a: number, b: number, f: number) => a + (b - a) * f,
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    // No custom cursor on touch devices or small screens
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.innerWidth < 768) return;

    setIsVisible(true);
    document.body.classList.add("custom-cursor-active");

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const onEnter = () => setIsVisible(true);
    const onLeave = () => setIsVisible(false);
    const hoverOn = () => setIsHovering(true);
    const hoverOff = () => setIsHovering(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseleave", onLeave);

    const attachHover = () => {
      const els = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, select, .magnetic-btn, [role="slider"]'
      );
      els.forEach((el) => {
        el.addEventListener("mouseenter", hoverOn);
        el.addEventListener("mouseleave", hoverOff);
      });
      return els;
    };

    const els = attachHover();
    const obs = new MutationObserver(() => attachHover());
    obs.observe(document.body, { childList: true, subtree: true });

    let raf: number;
    const tick = () => {
      // Dot follows tightly
      dotPos.current.x = lerp(dotPos.current.x, target.current.x, 0.25);
      dotPos.current.y = lerp(dotPos.current.y, target.current.y, 0.25);
      // Ring trails more loosely
      ringPos.current.x = lerp(ringPos.current.x, target.current.x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, target.current.y, 0.12);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseleave", onLeave);
      els.forEach((el) => {
        el.removeEventListener("mouseenter", hoverOn);
        el.removeEventListener("mouseleave", hoverOff);
      });
      obs.disconnect();
      cancelAnimationFrame(raf);
      document.body.classList.remove("custom-cursor-active");
    };
  }, [lerp]);

  if (!isVisible) return null;

  return (
    <>
      {/* Dot — tight follow */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          width: "6px",
          height: "6px",
          marginLeft: "-3px",
          marginTop: "-3px",
          borderRadius: "50%",
          background: "#493E36",
          opacity: isHovering ? 0 : 1,
          transition: "opacity 0.25s ease",
          willChange: "transform",
        }}
      />
      {/* Ring — trails behind, expands on hover */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          width: isHovering ? "52px" : "28px",
          height: isHovering ? "52px" : "28px",
          marginLeft: isHovering ? "-26px" : "-14px",
          marginTop: isHovering ? "-26px" : "-14px",
          borderRadius: "50%",
          border: `1.5px solid ${isHovering ? "#C7A064" : "rgba(73,62,54,0.25)"}`,
          background: isHovering
            ? "rgba(199,160,100,0.06)"
            : "transparent",
          transition:
            "width 0.35s cubic-bezier(0.16,1,0.3,1), height 0.35s cubic-bezier(0.16,1,0.3,1), margin 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease, background 0.3s ease",
          willChange: "transform",
        }}
      />
    </>
  );
}
