import { useEffect, useRef } from "react";

export default function Spotlight() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = null;
    let target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let current = { ...target };

    function onMove(e) {
      target = { x: e.clientX, y: e.clientY };
    }

    function tick() {
      current.x += (target.x - current.x) * 0.12;
      current.y += (target.y - current.y) * 0.12;
      el.style.background = `radial-gradient(520px circle at ${current.x}px ${current.y}px, rgba(200,255,63,0.07), rgba(126,230,196,0.03) 40%, transparent 70%)`;
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[2] mix-blend-screen"
      aria-hidden="true"
    />
  );
}
