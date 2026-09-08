import { useRef, useEffect, useCallback, useState } from "react";
import SectionHeading from "./SectionHeading";

/* ─────────────────── card data ─────────────────── */
const CARDS = [
  {
    id: "sophie",
    name: "Sophie Laurent",
    role: "Senior UX Designer",
    color: "linear-gradient(145deg,#1e2640,#162038)",
    initials: "SL",
    avatarBg: "linear-gradient(135deg,#6366f1 0%,#8b5cf6 60%,#06b6d4 100%)",
  },
  {
    id: "marcus",
    name: "Marcus Chen",
    role: "Full-Stack Engineer",
    color: "linear-gradient(145deg,#1a2535,#0f1c2d)",
    initials: "MC",
    avatarBg: "linear-gradient(135deg,#0ea5e9 0%,#06b6d4 50%,#10b981 100%)",
  },
  {
    id: "julian",
    name: "Julian Reyes",
    role: "Product Manager",
    color: "linear-gradient(145deg,#1e1a2e,#141024)",
    initials: "JR",
    avatarBg: "linear-gradient(135deg,#a855f7 0%,#ec4899 60%,#f97316 100%)",
  },
  {
    id: "amara",
    name: "Amara Osei",
    role: "Data Scientist",
    color: "linear-gradient(145deg,#162028,#0d1a1a)",
    initials: "AO",
    avatarBg: "linear-gradient(135deg,#10b981 0%,#14b8a6 50%,#06b6d4 100%)",
  },
  {
    id: "elena",
    name: "Elena Vasquez",
    role: "DevOps Engineer",
    color: "linear-gradient(145deg,#28191a,#1a0f10)",
    initials: "EV",
    avatarBg: "linear-gradient(135deg,#f43f5e 0%,#fb7185 50%,#fda4af 100%)",
  },
];

const lerp = (a, b, t) => a + (b - a) * t;

/* rAF loop hook */
function useAnimationLoop(cb) {
  const rafRef = useRef(null);
  const cbRef = useRef(cb);
  cbRef.current = cb;
  useEffect(() => {
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      cbRef.current(dt);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
}

/* ──────────────── WaveCard ──────────────── */
function WaveCard({ card, index, total, pointerRef, stageRef, focusIndex, onFocus }) {
  const cardRef = useRef(null);
  const state = useRef({
    x: 0, y: 0, vx: 0, vy: 0,
    rx: 0, ry: 0, vrx: 0, vry: 0,
    focus: 0, blur: 0,
  });
  const isFocused = focusIndex === index;

  const tick = useCallback((dt) => {
    const el = cardRef.current;
    const stage = stageRef.current;
    if (!el || !stage) return;
    const s = state.current;
    const W = stage.offsetWidth;
    const H = stage.offsetHeight;
    const spread = Math.min(W * 0.16, 140);
    const mid = (total - 1) / 2;
    const baseX = (index - mid) * spread;
    const baseY = Math.abs(index - mid) * 18;
    const px = pointerRef.current.x - W / 2;
    const py = pointerRef.current.y - H / 2;
    const dist = Math.sqrt(px * px + py * py);
    const maxDist = Math.sqrt((W / 2) ** 2 + (H / 2) ** 2);
    const waveScale = 1 - (dist / maxDist) * 0.04;
    const targetX = baseX + px * 0.06 * (1 - Math.abs(index - mid) / total);
    const targetY = baseY + py * 0.02;
    const targetZ = (isFocused ? 60 : 0) + s.focus * 20;
    const rx = (py / H) * 18;
    const ry = -(px / W) * 22;
    const sp = 8, damp = 0.72;
    s.vx += (targetX - s.x) * sp * dt; s.vx *= Math.pow(damp, dt * 60); s.x += s.vx * dt;
    s.vy += (targetY - s.y) * sp * dt; s.vy *= Math.pow(damp, dt * 60); s.y += s.vy * dt;
    s.vrx += (rx - s.rx) * sp * dt; s.vrx *= Math.pow(damp, dt * 60); s.rx += s.vrx * dt;
    s.vry += (ry - s.ry) * sp * dt; s.vry *= Math.pow(damp, dt * 60); s.ry += s.vry * dt;
    s.focus = lerp(s.focus, isFocused ? 1 : 0, 1 - Math.pow(0.1, dt * 8));
    const zDepth = -Math.abs(index - mid) * 8 + s.focus * 40;
    const blurTarget =
      focusIndex !== -1 && !isFocused ? Math.abs(index - focusIndex) * 1.5 : 0;
    s.blur = lerp(s.blur, blurTarget, 1 - Math.pow(0.1, dt * 8));
    el.style.transform = [
      `translateX(${s.x}px)`,
      `translateY(${s.y}px)`,
      `translateZ(${targetZ + zDepth}px)`,
      `rotateX(${s.rx}deg)`,
      `rotateY(${s.ry}deg)`,
      `scale(${waveScale + s.focus * 0.04})`,
    ].join(" ");
    el.style.filter = s.blur > 0.1 ? `blur(${s.blur}px)` : "";
    el.style.opacity = String(
      1 - (focusIndex !== -1 && !isFocused ? Math.abs(index - focusIndex) * 0.12 : 0)
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, total, isFocused, focusIndex]);

  useAnimationLoop(tick);

  return (
    <button
      ref={cardRef}
      onClick={() => onFocus(isFocused ? -1 : index)}
      onFocus={() => onFocus(index)}
      onBlur={() => onFocus(-1)}
      aria-label={`${card.name}, ${card.role}`}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: "-100px",
        marginLeft: "-66px",
        width: "132px",
        aspectRatio: "0.69",
        padding: "10px",
        border: 0,
        borderRadius: "14px",
        color: "#f3f0e9",
        background: `linear-gradient(145deg,rgba(255,255,255,0.045),transparent 34%), ${card.color}`,
        boxShadow:
          "0 10px 30px rgba(0,0,0,0.35), inset 0 1px rgba(255,255,255,0.06), inset 0 0 0 1px rgba(0,0,0,0.24)",
        cursor: "pointer",
        outline: "none",
        transformStyle: "preserve-3d",
        willChange: "transform, filter",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: "100%",
          aspectRatio: "1",
          overflow: "hidden",
          borderRadius: "10px",
          background: "rgba(8,9,9,0.24)",
          boxShadow:
            "inset 0 1px rgba(255,255,255,0.04), inset 0 -16px 28px rgba(0,0,0,0.13)",
          transform: "translateZ(7px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: card.avatarBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            fontWeight: 700,
            color: "white",
            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          {card.initials}
        </div>
      </div>

      {/* Name / role / follow */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "3px",
          marginTop: "8px",
          textAlign: "center",
          transform: "translateZ(8px)",
        }}
      >
        <p
          style={{
            fontSize: "10px",
            fontWeight: 500,
            lineHeight: 1.15,
            letterSpacing: "-0.035em",
            color: "rgba(255,255,255,0.93)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            maxWidth: "100%",
            textOverflow: "ellipsis",
            margin: 0,
          }}
        >
          {card.name}
        </p>
        <p
          style={{
            fontSize: "6px",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            color: "rgba(255,255,255,0.48)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            maxWidth: "100%",
            textOverflow: "ellipsis",
            margin: 0,
          }}
        >
          {card.role}
        </p>
        <div
          style={{
            marginTop: "4px",
            padding: "3px 11px",
            border: `1px solid rgba(255,255,255,${isFocused ? 0.17 : 0.055})`,
            borderRadius: "999px",
            color: "rgba(255,255,255,0.82)",
            background: "rgba(0,0,0,0.86)",
            fontSize: "5px",
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Follow
        </div>
      </div>
    </button>
  );
}

/* ──────────────── CharacterWave section ──────────────── */
export default function CharacterWave() {
  const stageRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [focusIndex, setFocusIndex] = useState(-1);
  const [interacted, setInteracted] = useState(false);
  const idleT = useRef(0);

  /* Pointer tracking */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onMove = (e) => {
      const rect = stage.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      pointerRef.current = { x: cx - rect.left, y: cy - rect.top };
      setInteracted(true);
    };
    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("touchmove", onMove, { passive: true });
    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("touchmove", onMove);
    };
  }, []);

  /* Idle drift when no interaction */
  useAnimationLoop(
    useCallback(
      (dt) => {
        if (interacted) return;
        const stage = stageRef.current;
        if (!stage) return;
        idleT.current += dt;
        const t = idleT.current;
        pointerRef.current = {
          x: stage.offsetWidth / 2 + Math.sin(t * 0.4) * stage.offsetWidth * 0.25,
          y: stage.offsetHeight / 2 + Math.cos(t * 0.3) * stage.offsetHeight * 0.2,
        };
      },
      [interacted]
    )
  );

  const handleFocus = useCallback((idx) => setFocusIndex(idx), []);

  return (
    <section id="wave" className="section-padding" style={{ overflow: "hidden" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Character Wave"
          subtitle="Hover or tap the stage — spring-physics 3D wave in real time"
        />

        {/* ── Stage ── */}
        <div
          ref={stageRef}
          role="region"
          aria-label="Interactive character card wave"
          style={{
            position: "relative",
            width: "100%",
            height: "420px",
            overflow: "hidden",
            isolation: "isolate",
            background:
              "radial-gradient(ellipse at center,rgba(99,102,241,0.07) 0%,transparent 70%), #0f172a",
            borderRadius: "24px",
            border: "1px solid rgba(148,163,184,0.08)",
            perspective: "1100px",
            touchAction: "none",
            cursor: "crosshair",
          }}
        >
          {/* Film-grain noise */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: "-20%",
              zIndex: 0,
              pointerEvents: "none",
              opacity: 0.12,
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.32'/%3E%3C/svg%3E\")",
              transform: "rotate(7deg)",
              mixBlendMode: "soft-light",
            }}
          />

          {/* Vignette */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 4,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse at center,transparent 34%,rgba(0,0,0,0.12) 70%,rgba(0,0,0,0.32) 120%)",
            }}
          />

          {/* Cards deck */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              transformStyle: "preserve-3d",
            }}
          >
            {CARDS.map((card, i) => (
              <WaveCard
                key={card.id}
                card={card}
                index={i}
                total={CARDS.length}
                pointerRef={pointerRef}
                stageRef={stageRef}
                focusIndex={focusIndex}
                onFocus={handleFocus}
              />
            ))}
          </div>

          {/* Interaction hint */}
          {!interacted && (
            <p
              aria-hidden
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
                color: "rgba(255,255,255,0.35)",
                fontSize: "11px",
                letterSpacing: "0.08em",
                pointerEvents: "none",
                margin: 0,
                animation: "wave-hint 2s ease-in-out infinite alternate",
              }}
            >
              Move cursor to interact
            </p>
          )}
        </div>

        <p className="text-center mt-5 text-xs text-surface-500 light:text-surface-400">
          Spring-physics · 3D perspective transforms · Real-time pointer tracking
        </p>
      </div>

      <style>{`
        @keyframes wave-hint {
          from { opacity: 0.15; }
          to   { opacity: 0.55; }
        }
      `}</style>
    </section>
  );
}
