import { useEffect, useRef, useState } from "react";

const WORDS = ["LIFT", "POWER", "BEAST", "ZERO G", "RISE", "IGNITE", "FORCE", "EVOLVE", "APEX", "DRIVE"];
const COLORS = [
  "rgba(232,41,26,.22)",
  "rgba(255,107,53,.18)",
  "rgba(255,165,0,.14)",
  "rgba(255,255,255,.07)",
];
const LABELS = [
  "Initiating protocol...",
  "Calibrating biomechanics...",
  "Loading your program...",
  "Defying gravity...",
];

interface GWord {
  text: string;
  fontSize: number;
  color: string;
  duration: number;
  delay: number;
  left: number;
  bottom: number;
}

interface Particle {
  x: number;
  y: number;
  r: number;
  speed: number;
  opacity: number;
  color: string;
  drift: number;
}

export default function Loader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [labelIndex, setLabelIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  // Generate floating words once
  const gwords: GWord[] = WORDS.map((text, i) => ({
    text,
    fontSize: Math.random() * 22 + 14,
    color: COLORS[i % COLORS.length],
    duration: parseFloat((Math.random() * 4 + 5).toFixed(1)),
    delay: parseFloat((Math.random() * 5).toFixed(1)),
    left: parseFloat((Math.random() * 80 + 5).toFixed(1)),
    bottom: parseFloat((Math.random() * 60 + 5).toFixed(1)),
  }));

  // Canvas particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    particlesRef.current = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 80,
      r: Math.random() * 2.2 + 0.6,
      speed: Math.random() * 1.2 + 0.4,
      opacity: Math.random() * 0.6 + 0.2,
      color: ["#E8291A", "#FF6B35", "#FFA500"][Math.floor(Math.random() * 3)],
      drift: (Math.random() - 0.5) * 0.8,
    }));

    const ctx = canvas.getContext("2d")!;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) => {
        p.y -= p.speed;
        p.x += p.drift;
        p.opacity -= 0.003;
        if (p.y < -10 || p.opacity <= 0) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
          p.opacity = Math.random() * 0.5 + 0.2;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Cycling labels
  useEffect(() => {
    const interval = setInterval(() => {
      setLabelIndex((i) => (i + 1) % LABELS.length);
    }, 875);
    return () => clearInterval(interval);
  }, []);

  // Auto-hide after 4s
  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 4000);
    const hideTimer = setTimeout(() => setVisible(false), 4700);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.6s ease",
        pointerEvents: fading ? "none" : "all",
      }}
    >
      {/* Google Fonts + Keyframe animations — dangerouslySetInnerHTML avoids OXC backtick parse error */}
      <style dangerouslySetInnerHTML={{ __html: [
        "@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;600;700&display=swap');",
        "@keyframes scan { 0% { top: 0%; opacity: .6; } 50% { opacity: 1; } 100% { top: 100%; opacity: .6; } }",
        "@keyframes wordFloat { 0% { opacity: 0; transform: translateY(20px) scale(.9); } 20% { opacity: .18; } 60% { opacity: .08; } 100% { opacity: 0; transform: translateY(-80px) scale(1.05); } }",
        "@keyframes spinRing { to { transform: rotate(360deg); } }",
        "@keyframes pulse { 0%,100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(232,41,26,.4); } 50% { transform: scale(1.08); box-shadow: 0 0 0 12px rgba(232,41,26,0); } }",
        "@keyframes riseIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }",
        "@keyframes fillBar { to { width: 100%; } }",
        ".sb-ring-1 { animation: spinRing 2.4s linear infinite; }",
        ".sb-ring-2 { animation: spinRing 1.8s linear infinite reverse; }",
        ".sb-ring-3 { animation: spinRing 3.2s linear infinite; }",
        ".sb-core   { animation: pulse 2s ease-in-out infinite; }",
        ".sb-logo-row  { animation: riseIn 1s .3s both; }",
        ".sb-tagline   { animation: riseIn 1s .5s both; }",
        ".sb-tagline2  { animation: riseIn 1s .6s both; }",
        ".sb-subline   { animation: riseIn 1s .75s both; }",
        ".sb-progress  { animation: riseIn 1s .9s both; }",
        ".sb-bar       { animation: fillBar 3.5s 1s ease-out forwards; }",
        ".sb-scanline  { animation: scan 4s ease-in-out infinite; }",
      ].join(" ") }} />

      {/* Canvas */}
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }} />

      {/* Floating words */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 1 }}>
        {gwords.map((w, i) => (
          <div
            key={i}
            className="sb-word"
            style={{
              position: "absolute",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: w.fontSize,
              color: w.color,
              opacity: 0,
              letterSpacing: ".05em",
              left: `${w.left}%`,
              bottom: `${w.bottom}%`,
              animation: `wordFloat ${w.duration}s ${w.delay}s ease-in-out infinite`,
            }}
          >
            {w.text}
          </div>
        ))}
      </div>

      {/* Scanline */}
      <div
        className="sb-scanline"
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 2,
          background: "linear-gradient(90deg, transparent, rgba(232,41,26,.4), transparent)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Rings */}
        <div style={{ position: "relative", width: 160, height: 160, marginBottom: "2.2rem" }}>
          {/* Ring 1 */}
          <div className="sb-ring-1" style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#E8291A", borderRightColor: "#E8291A" }} />
          {/* Ring 2 */}
          <div className="sb-ring-2" style={{ position: "absolute", inset: 14, borderRadius: "50%", border: "2px solid transparent", borderBottomColor: "#FF6B35", borderLeftColor: "#FF6B35" }} />
          {/* Ring 3 */}
          <div className="sb-ring-3" style={{ position: "absolute", inset: 28, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#FFA500", borderRightColor: "#FFA500" }} />
          {/* Core */}
          <div
            className="sb-core"
            style={{
              position: "absolute", inset: 42,
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 35%, #E8291A 0%, #8B0000 60%, #000 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 26, filter: "brightness(10)" }}>⚡</span>
          </div>
        </div>

        {/* Logo */}
        <div className="sb-logo-row" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: ".7rem" }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 28L18 8L30 28" stroke="#E8291A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 22L18 14L26 22" stroke="#FF6B35" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="18" cy="8" r="2.5" fill="#E8291A"/>
          </svg>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.2rem", letterSpacing: 2, color: "#fff" }}>
            SWAY <span style={{ color: "#E8291A" }}>BEAST</span>
          </div>
        </div>

        <div className="sb-tagline" style={{ fontSize: ".75rem", letterSpacing: ".25em", textTransform: "uppercase", color: "#555", marginBottom: "2rem" }}>
          Premium Fitness Engineering · Kondapur, Hyderabad
        </div>

        <div className="sb-tagline2" style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", lineHeight: 1.3, textAlign: "center", maxWidth: 360, marginBottom: ".5rem" }}>
          Train Like <span style={{ color: "#E8291A" }}>Gravity</span><br />Doesn't Exist
        </div>

        <div className="sb-subline" style={{ fontSize: ".82rem", color: "#555", fontWeight: 300, textAlign: "center", maxWidth: 340, marginBottom: "2.4rem", letterSpacing: ".02em" }}>
          Science-backed hypertrophy · Fat loss splits · Athletic longevity coaching
        </div>

        {/* Progress */}
        <div className="sb-progress" style={{ width: 240 }}>
          <div style={{ width: "100%", height: 3, background: "#1a1a1a", borderRadius: 2, overflow: "hidden", marginBottom: ".6rem" }}>
            <div className="sb-bar" style={{ height: "100%", width: "0%", background: "linear-gradient(90deg, #E8291A, #FF6B35)", borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: ".7rem", letterSpacing: ".18em", color: "#444", textTransform: "uppercase", textAlign: "center" }}>
            {LABELS[labelIndex]}
          </div>
        </div>
      </div>
    </div>
  );
}
