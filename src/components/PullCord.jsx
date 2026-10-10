import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "../hooks/useTheme";

/**
 * PullCord — 3-D realistic hanging-cord theme switch.
 *
 * Physics
 *  • True 3-D Verlet integration (x, y, z) with gravity + friction.
 *  • 10 Jakobsen constraint iterations per frame — rope never tears.
 *  • Tail node pinned to pointer while dragging; free on release.
 *  • Hold Shift while dragging (or scroll wheel) to move in Z-depth.
 *
 * Rendering
 *  • Perspective projection: scale = FOCAL / (FOCAL + z)
 *  • Cord drawn as a quadratic-Bézier chain through projected midpoints.
 *  • Stroke width, knob scale, and drop-shadow scale with depth.
 *  • SVG `transform` attribute (not CSS px transform) keeps knob welded to cord.
 *
 * Theme toggle
 *  • Fires when tail.y > REST_Y + TRIGGER on pointer release.
 *  • Quick tap (< 260 ms, < 12 px movement) triggers an animated pull.
 */
export default function PullCord() {
  const { theme, toggleTheme } = useTheme();

  // ── geometry constants ───────────────────────────────────────────────────
  const SVG_W  = 210;
  const SVG_H  = 460;
  const AX     = SVG_W - 38;               // anchor X (right side of panel)
  const AY     = 0;                         // anchor Y (ceiling)
  const N      = 9;                         // rope node count
  const SEG    = 26;                        // natural segment length (px)
  const REST_Y = AY + (N - 1) * SEG;       // = 208  resting tail Y
  const TRIGGER = 46;                       // extra-Y beyond REST_Y to toggle
  const FOCAL  = 340;                       // perspective focal length

  // ── physics refs (60 fps loop, never cause re-render directly) ───────────
  const nodesRef  = useRef(
    Array.from({ length: N }, (_, i) => ({
      x:  AX, y:  AY + i * SEG, z:  0,
      ox: AX, oy: AY + i * SEG, oz: 0,
    }))
  );
  const isDragRef  = useRef(false);
  const primedRef  = useRef(false);
  const dTRef      = useRef({ x: AX, y: REST_Y, z: 0 }); // drag target (3-D)
  const lastPRef   = useRef({ x: 0, y: 0 });              // last pointer client pos
  const downTimeRef = useRef(0);                           // pointer-down timestamp
  const svgRef     = useRef(null);

  // ── render state ─────────────────────────────────────────────────────────
  const [pts,       setPts]       = useState([
    ...Array.from({ length: N }, (_, i) => ({ x: AX, y: AY + i * SEG, z: 0 }))
  ]);
  const [isPrimed,  setIsPrimed]  = useState(false);
  const [interacted, setInteracted] = useState(false);

  // ── perspective projection ────────────────────────────────────────────────
  // Pure function — reads only its argument and the FOCAL / AX / AY constants.
  // Safe to call during render (no refs, no side-effects).
  const project = (p) => {
    const s = FOCAL / (FOCAL + p.z);
    return { x: AX + (p.x - AX) * s, y: AY + p.y * s, s };
  };

  // ── SVG coordinate helper ─────────────────────────────────────────────────
  const toSVG = (cx, cy) => {
    if (!svgRef.current) return { x: cx, y: cy };
    const pt = svgRef.current.createSVGPoint();
    pt.x = cx; pt.y = cy;
    return pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
  };

  // ── continuous physics loop (always running) ──────────────────────────────
  // Physics: Verlet + Jakobsen, same algorithm as the user's reference App.js
  // but extended to 3-D and wired to React state instead of setTick.
  useEffect(() => {
    const GRAV = 0.45;    // gravity (px / step²)
    const FRIC = 0.982;   // per-step velocity retention (air damping)
    const ITER = 10;      // constraint relaxation passes per step

    let raf;

    const tick = () => {
      const ns = nodesRef.current;

      // ── Verlet step ───────────────────────────────────────────────────────
      for (let i = 1; i < ns.length; i++) {
        if (isDragRef.current && i === ns.length - 1) {
          // Tail locked to pointer — zero velocity (pin in place)
          ns[i].x  = dTRef.current.x;  ns[i].ox = dTRef.current.x;
          ns[i].y  = dTRef.current.y;  ns[i].oy = dTRef.current.y;
          ns[i].z  = dTRef.current.z;  ns[i].oz = dTRef.current.z;
          continue;
        }
        const vx = (ns[i].x - ns[i].ox) * FRIC;
        const vy = (ns[i].y - ns[i].oy) * FRIC;
        const vz = (ns[i].z - ns[i].oz) * FRIC;
        ns[i].ox = ns[i].x;  ns[i].oy = ns[i].y;  ns[i].oz = ns[i].z;
        ns[i].x += vx;
        ns[i].y += vy + GRAV;   // gravity in Y
        ns[i].z += vz;           // Z drifts back to 0 via friction
      }

      // ── Jakobsen distance constraints ─────────────────────────────────────
      for (let it = 0; it < ITER; it++) {
        // Always re-pin anchor first
        ns[0].x = AX; ns[0].y = AY; ns[0].z = 0;

        for (let i = 0; i < ns.length - 1; i++) {
          const a = ns[i], b = ns[i + 1];
          const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
          const dist = Math.hypot(dx, dy, dz) || 0.0001;
          const diff = (dist - SEG) / dist * 0.5;
          const cx = dx * diff, cy2 = dy * diff, cz = dz * diff;

          if (i === 0) {
            // Anchor pinned — only push b
            b.x -= cx * 2; b.y -= cy2 * 2; b.z -= cz * 2;
          } else if (isDragRef.current && i + 1 === ns.length - 1) {
            // Tail locked to pointer — only push a
            a.x += cx * 2; a.y += cy2 * 2; a.z += cz * 2;
            // Re-pin tail
            b.x = dTRef.current.x; b.y = dTRef.current.y; b.z = dTRef.current.z;
          } else {
            a.x += cx; a.y += cy2; a.z += cz;
            b.x -= cx; b.y -= cy2; b.z -= cz;
          }
        }

        // Re-pin anchor at end of each pass
        ns[0].x = AX; ns[0].y = AY; ns[0].z = 0;
      }

      // Sync to React state (projects in render)
      setPts(ns.map(p => ({ x: p.x, y: p.y, z: p.z })));

      // Primed check — update state from loop (never read ref in render)
      const tail = ns[ns.length - 1];
      const np   = tail.y > REST_Y + TRIGGER;
      if (np !== primedRef.current) {
        primedRef.current = np;
        setIsPrimed(np);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [AX, REST_Y]); // AX and REST_Y are stable integer constants

  // ── pointer handlers (attached directly on <g> with setPointerCapture) ───

  const onDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* ok */ }

    isDragRef.current  = true;
    primedRef.current  = false;
    setIsPrimed(false);
    setInteracted(true);
    downTimeRef.current = performance.now();
    lastPRef.current    = { x: e.clientX, y: e.clientY };
  }, []);

  const onMove = useCallback((e) => {
    if (!isDragRef.current) return;

    if (e.shiftKey) {
      // Shift + vertical drag → Z depth (into / out of screen)
      const dy = e.clientY - lastPRef.current.y;
      dTRef.current.z = Math.max(-150, Math.min(180, dTRef.current.z - dy * 1.8));
    } else {
      // Normal drag → X / Y in SVG space with elastic constraints
      const sp = toSVG(e.clientX, e.clientY);

      // Lateral X — elastic resistance from anchor
      const dxA = sp.x - AX;
      dTRef.current.x = AX +
        Math.sign(dxA) * 110 * (1 - Math.exp(-Math.abs(dxA) / 80));

      // Vertical Y — elastic both upward and downward
      if (sp.y < REST_Y) {
        // Above rest: cord compresses toward anchor — soft ceiling
        const up = REST_Y - sp.y;
        dTRef.current.y = Math.max(AY + 8, REST_Y - 90 * (1 - Math.exp(-up / 70)));
      } else {
        // Below rest: cord stretches — soft floor
        const dn = sp.y - REST_Y;
        dTRef.current.y = REST_Y + 120 * (1 - Math.exp(-dn / 90));
      }
    }

    lastPRef.current = { x: e.clientX, y: e.clientY };
  }, [AX, AY, REST_Y]);

  const onUp = useCallback((e) => {
    if (!isDragRef.current) return;
    try { e.currentTarget?.releasePointerCapture?.(e.pointerId); } catch { /* ok */ }

    const elapsed  = performance.now() - downTimeRef.current;
    const tail     = nodesRef.current[nodesRef.current.length - 1];
    const totalMov = Math.abs(tail.y - REST_Y);

    // ── Quick tap (< 260 ms, < 12 px) → animated pull-down + toggle ─────
    if (elapsed < 260 && totalMov < 12) {
      // Keep drag locked; animate the target downward, then release
      let startMs = null;
      const pullY = REST_Y + 68;

      const animPull = (now) => {
        if (!startMs) startMs = now;
        const t    = Math.min((now - startMs) / 170, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        dTRef.current.y = REST_Y + (pullY - REST_Y) * ease;

        if (t < 1) {
          requestAnimationFrame(animPull);
        } else {
          // Toggle theme then release — physics handles snap-back
          toggleTheme();
          isDragRef.current = false;
          primedRef.current = false;
          setIsPrimed(false);
          // Give nodes a gentle upward kick so the cord whips back
          const ns = nodesRef.current;
          for (let i = 1; i < ns.length; i++) {
            const f = i / (ns.length - 1);
            ns[i].oy = ns[i].y + 5 * f; // oy > y → velocity upward
          }
        }
      };

      requestAnimationFrame(animPull);
      return;
    }

    // ── Regular drag release ─────────────────────────────────────────────
    isDragRef.current = false;

    if (primedRef.current) {
      toggleTheme();
    }
    primedRef.current = false;
    setIsPrimed(false);

    // Let Z drift back to neutral via physics friction automatically
    dTRef.current.z = 0;
  }, [toggleTheme, REST_Y]);

  // Scroll wheel while dragging → Z depth
  const onWheel = useCallback((e) => {
    if (!isDragRef.current) return;
    e.preventDefault();
    dTRef.current.z = Math.max(-150, Math.min(180, dTRef.current.z - e.deltaY * 0.4));
  }, []);

  // Keyboard access
  const onKeyDown = useCallback((e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    // Simulate a tap: set drag, pull target, release after animation
    isDragRef.current = true;
    downTimeRef.current = performance.now() - 999; // force "long drag" branch skipped
    primedRef.current   = false;
    let startMs = null;
    const pullY = REST_Y + 68;

    const animKb = (now) => {
      if (!startMs) startMs = now;
      const t    = Math.min((now - startMs) / 170, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      dTRef.current.y = REST_Y + (pullY - REST_Y) * ease;
      if (t < 1) {
        requestAnimationFrame(animKb);
      } else {
        toggleTheme();
        isDragRef.current = false;
        const ns = nodesRef.current;
        for (let i = 1; i < ns.length; i++) {
          const f = i / (ns.length - 1);
          ns[i].oy = ns[i].y + 5 * f;
        }
      }
    };
    requestAnimationFrame(animKb);
  }, [REST_Y, toggleTheme]);

  // ── derive render values from pts state ──────────────────────────────────
  const proj   = pts.map(project);
  const tailP  = proj[proj.length - 1];
  const prevP  = proj[proj.length - 2] ?? { x: tailP.x, y: tailP.y - SEG };
  
  const segDx = tailP.x - prevP.x;
  const segDy = tailP.y - prevP.y;
  const segAngle = Math.atan2(segDy, segDx) * (180 / Math.PI) - 90;

  // Depth scale clamped so knob stays visible at extreme Z
  const kScale = Math.max(0.6, Math.min(1.5, tailP.s));

  // Stroke width scales with depth — thicker when close, thinner when far
  const strokeW = (2.4 * tailP.s).toFixed(2);

  // Quadratic-Bézier smooth path through projected points
  // (classic technique: control = prev point, end = midpoint between prev & curr)
  const cordPath = proj.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
    const prev = proj[i - 1];
    const mx = ((prev.x + p.x) / 2).toFixed(2);
    const my = ((prev.y + p.y) / 2).toFixed(2);
    return `${acc} Q ${prev.x.toFixed(2)} ${prev.y.toFixed(2)}, ${mx} ${my}`;
  }, "");

  const isDark       = theme === "dark";
  const textColor    = isDark ? "#cbd5e1" : "#475569";
  const annotOpacity = interacted ? 0.6 : 1;

  // Knob colours: amber in dark mode, blue in light mode; cyan when primed
  const cordColor  = isDark ? "#d1d5db" : "#64748b";

  return (
    <aside
      aria-label="Pull-cord theme switcher"
      className="fixed top-0 right-12 z-50 pointer-events-none select-none"
      style={{ width: SVG_W, height: SVG_H }}
    >
      <svg
        ref={svgRef}
        width={SVG_W}
        height={SVG_H}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        overflow="visible"
        style={{ display: "block" }}
      >
        <defs>
          {/* Spherical bead gradient — always neutral so it reads on both themes */}
          <radialGradient id="pc-knob" cx="36%" cy="32%" r="65%" fx="30%" fy="25%">
            <stop offset="0%"   stopColor="#ffffff" />
            <stop offset="40%"  stopColor="#f1f5f9" />
            <stop offset="80%"  stopColor="#c8d4e0" />
            <stop offset="100%" stopColor="#8da0b5" />
          </radialGradient>

          <filter id="pc-shadow" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="rgba(0,0,0,0.35)" />
          </filter>

          {/* Blur for drop-shadow under knob */}
          <filter id="pc-dshadow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" />
          </filter>

          {/* Glow when pull threshold is reached */}
          <filter id="pc-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Hanging cord — depth-aware stroke width ── */}
        <path
          d={cordPath}
          fill="none"
          stroke={cordColor}
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ── Depth shadow below the knob ── */}
        <ellipse
          cx={tailP.x}
          cy={tailP.y + 26 * kScale}
          rx={14 * kScale}
          ry={4  * kScale}
          fill="rgba(0,0,0,0.18)"
          filter="url(#pc-dshadow)"
        />

        {/* ── Knob group
              SVG `transform` attribute — always in SVG user-units,
              always welded to the cord endpoint.  No CSS px transform.    ── */}
        <g
          transform={`translate(${tailP.x.toFixed(2)},${tailP.y.toFixed(2)}) scale(${kScale.toFixed(3)})`}
          className="pointer-events-auto cursor-grab active:cursor-grabbing"
          style={{ touchAction: "none" }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onWheel={onWheel}
          onKeyDown={onKeyDown}
          role="button"
          tabIndex={0}
          aria-label={`Theme toggle — ${theme} mode. Drag down to switch.`}
        >
          {/* Generous transparent hit zone (easier to grab on touch) */}
          <circle cx={0} cy={12} r={32} fill="transparent" />

          {/* Metal crimp — rotated to match cord angle */}
          <rect
            x="-2"
            y={-15}
            width="4"
            height="8"
            rx="1.5"
            fill="#64748b"
            transform={`rotate(${segAngle.toFixed(1)})`}
          />

          {/* Bead body */}
          <circle
            cx="0"
            cy="0"
            r={9}
            fill="url(#pc-knob)"
            stroke={isPrimed ? "#38bdf8" : "#94a3b8"}
            strokeWidth={isPrimed ? "1.5" : "0.9"}
            filter={isPrimed ? "url(#pc-glow)" : "url(#pc-shadow)"}
            style={{ transition: "stroke 0.15s, stroke-width 0.15s" }}
          />

          {/* Specular highlight */}
          <circle cx="-2.8" cy="-2.8" r="2.2" fill="white" opacity="0.85" />
        </g>
      </svg>

      {/* ── Handwritten annotation ──────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none flex items-center gap-1"
        style={{
          top: REST_Y - 30,
          right: SVG_W - AX + 12,
          opacity: annotOpacity,
          transition: "opacity 0.4s",
          transform: `translateY(${Math.max(0, (tailP.y - REST_Y) * 0.32).toFixed(1)}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "'Caveat', cursive, sans-serif",
            fontSize: "20px",
            fontWeight: 700,
            lineHeight: 1.05,
            color: textColor,
            textAlign: "right",
            transform: "rotate(-4deg)",
            whiteSpace: "nowrap",
          }}
        >
          <div>pull the</div>
          <div>cord!</div>
        </div>

        {/* Hand-drawn curved arrow */}
        <svg
          width="36" height="30" viewBox="0 0 36 30"
          fill="none" overflow="visible"
          style={{ color: textColor, flexShrink: 0 }}
        >
          <path d="M 3 25 C 11 22, 20 14, 26 7"
            stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M 18 6 L 27 7 L 25 16"
            stroke="currentColor" strokeWidth="2.6"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </aside>
  );
}
