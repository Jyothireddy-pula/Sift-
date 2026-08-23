import { useEffect, useRef } from "react";

// Fixed (non-random) layout so server and client markup match on hydration.
// Kept close to the viewport edges and well behind the content column (max-w-2xl)
// so the geometry frames the UI instead of sitting underneath it.
const CUBES = [
  { size: 100, top: "10%", left: "3%", z: -320, dur: "24s", dir: "normal", hue: "rgba(200,255,63,0.32)" },
  { size: 80, top: "64%", left: "92%", z: -280, dur: "30s", dir: "reverse", hue: "rgba(126,230,196,0.28)" },
  { size: 54, top: "14%", left: "93%", z: -400, dur: "36s", dir: "normal", hue: "rgba(255,138,92,0.24)" },
  { size: 42, top: "82%", left: "4%", z: -220, dur: "27s", dir: "reverse", hue: "rgba(200,255,63,0.2)" },
];

const PARTICLES = [
  { top: "14%", left: "20%", size: 2, z: -80, delay: "0s" },
  { top: "30%", left: "66%", size: 2, z: -140, delay: "0.6s" },
  { top: "48%", left: "10%", size: 2, z: -60, delay: "1.2s" },
  { top: "58%", left: "86%", size: 2, z: -200, delay: "1.8s" },
  { top: "70%", left: "38%", size: 2, z: -100, delay: "0.3s" },
  { top: "20%", left: "48%", size: 2, z: -40, delay: "1.5s" },
  { top: "84%", left: "60%", size: 2, z: -180, delay: "0.9s" },
];

function WireframeCube({ size, top, left, z, dur, dir, hue }) {
  const half = size / 2;
  const faceStyle = {
    position: "absolute",
    width: size,
    height: size,
    border: `1px solid ${hue}`,
    background: `linear-gradient(135deg, ${hue.replace(/[\d.]+\)$/, "0.03)")}, transparent)`,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  };
  return (
    <div
      className="cube-rig"
      style={{ top, left, transform: `translateZ(${z}px)` }}
    >
      <div
        className="cube"
        style={{ width: size, height: size, animationDuration: dur, animationDirection: dir }}
      >
        <div style={{ ...faceStyle, transform: `translateZ(${half}px)` }} />
        <div style={{ ...faceStyle, transform: `rotateY(180deg) translateZ(${half}px)` }} />
        <div style={{ ...faceStyle, transform: `rotateY(90deg) translateZ(${half}px)` }} />
        <div style={{ ...faceStyle, transform: `rotateY(-90deg) translateZ(${half}px)` }} />
        <div style={{ ...faceStyle, transform: `rotateX(90deg) translateZ(${half}px)` }} />
        <div style={{ ...faceStyle, transform: `rotateX(-90deg) translateZ(${half}px)` }} />
      </div>
    </div>
  );
}

export default function Background3D() {
  const sceneRef = useRef(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    let raf = null;
    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };

    function onMove(e) {
      const nx = (e.clientX / window.innerWidth) - 0.5;
      const ny = (e.clientY / window.innerHeight) - 0.5;
      target = { x: nx, y: ny };
    }

    function tick() {
      current.x += (target.x - current.x) * 0.035;
      current.y += (target.y - current.y) * 0.035;
      scene.style.transform = `rotateY(${current.x * 8}deg) rotateX(${-current.y * 8}deg) scale(1.05)`;
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
    <>
      <div className="scene" ref={sceneRef} aria-hidden="true">
        <div className="floor-grid" />

        {CUBES.map((c, i) => (
          <WireframeCube key={i} {...c} />
        ))}

        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="particle animate-pulseGlow"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              transform: `translateZ(${p.z}px)`,
              animationDelay: p.delay,
            }}
          />
        ))}

        <div className="scanline" style={{ animationDelay: "0s" }} />
        <div className="scanline" style={{ animationDelay: "4s" }} />
      </div>
      <div className="grain" />
    </>
  );
}
