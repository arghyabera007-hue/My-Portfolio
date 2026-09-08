// Radial Reveal Button — Originkit (converted to JSX)
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAnimate, useReducedMotion } from "framer-motion";

/** Rounded is a percent of the MAXIMUM possible radius — half the short side —
 *  so 100 is a true pill at any button size and 0 is a square corner. */
const radiusFromPercent = (w, h, pct) =>
  (Math.min(w, h) / 2) * (Math.max(0, Math.min(100, pct)) / 100);

const num = (v) => {
  const parsed = parseFloat(String(v ?? ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

const bandWidthsOf = (b) => {
  const fused = num(b?.borderWidth);
  return {
    top: b?.borderTopWidth !== undefined ? num(b.borderTopWidth) : fused,
    right: b?.borderRightWidth !== undefined ? num(b.borderRightWidth) : fused,
    bottom: b?.borderBottomWidth !== undefined ? num(b.borderBottomWidth) : fused,
    left: b?.borderLeftWidth !== undefined ? num(b.borderLeftWidth) : fused,
  };
};

const innerRadiusOf = (radius, b) => {
  const inset = (v) => `${Math.max(0, radius - v)}px`;
  return (
    `${inset(b.left)} ${inset(b.right)} ${inset(b.right)} ${inset(b.left)}` +
    ` / ${inset(b.top)} ${inset(b.top)} ${inset(b.bottom)} ${inset(b.bottom)}`
  );
};

const DEFAULT_TRANSITION = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.45,
};

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function RadialRevealButton({
  // content
  label = "Button",
  showText = true,
  children,
  // layout
  padding = "12px 28px",
  rounded = 100,
  gap = 8,
  // colours
  fill = "#6366f1",
  textColor = "#ffffff",
  hoverFill = "#ffffff",
  hoverTextColor = "#6366f1",
  // border
  border = { borderWidth: 2, borderStyle: "solid", borderColor: "#6366f1" },
  // icon
  addIcon = false,
  icon = { type: "symbol", symbol: "→", color: "#fff", hoverColor: "#6366f1", size: 16, side: "left" },
  // link / button behaviour
  link = "",
  newTab = true,
  type = "button",
  disabled = false,
  onClick,
  // animation
  transition = DEFAULT_TRANSITION,
  // extra style
  style,
  className = "",
}) {
  const [scope, animate] = useAnimate();
  const [radiusBox, setRadiusBox] = useState({ w: 0, h: 0 });

  useIsoLayoutEffect(() => {
    const el = scope.current;
    if (!el) return;
    const read = () =>
      setRadiusBox((prev) =>
        prev.w === el.offsetWidth && prev.h === el.offsetHeight
          ? prev
          : { w: el.offsetWidth, h: el.offsetHeight }
      );
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [scope]);

  const radiusPx = radiusFromPercent(radiusBox.w, radiusBox.h, rounded);
  const overlayRef = useRef(null);
  const clipCtrl = useRef(null);
  const reducedMotion = useReducedMotion();
  const clip = useRef({ r: 0, x: 100, y: 100, max: 160 });
  const band = bandWidthsOf(border);

  const applyClip = () => {
    const el = overlayRef.current;
    if (!el) return;
    const { r, x, y } = clip.current;
    const value = `circle(${r}% at ${x}% ${y}%)`;
    el.style.clipPath = value;
    el.style.webkitClipPath = value;
  };

  const anchorTo = (e) => {
    const el = overlayRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    const unit = Math.hypot(r.width, r.height) / Math.SQRT2;
    const far = Math.max(
      Math.hypot(px, py),
      Math.hypot(r.width - px, py),
      Math.hypot(px, r.height - py),
      Math.hypot(r.width - px, r.height - py)
    );
    clip.current.x = (px / r.width) * 100;
    clip.current.y = (py / r.height) * 100;
    clip.current.max = (far / unit) * 100 + 2;
  };

  const growTo = (to) => {
    clipCtrl.current?.stop();
    if (reducedMotion) {
      clip.current.r = to;
      applyClip();
      return;
    }
    clipCtrl.current = animate(clip.current.r, to, {
      ...transition,
      onUpdate: (v) => {
        clip.current.r = v;
        applyClip();
      },
    });
  };

  const onEnter = (e) => { anchorTo(e); applyClip(); growTo(clip.current.max); };
  const onLeave = (e) => {
    if (clip.current.r >= clip.current.max - 0.5) {
      anchorTo(e);
      clip.current.r = clip.current.max;
      applyClip();
    }
    growTo(0);
  };

  useIsoLayoutEffect(() => {
    applyClip();
    return () => clipCtrl.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Tag = link ? "a" : "button";
  const tagProps = {
    "aria-label": showText ? undefined : label || undefined,
    ...(link
      ? { href: link, target: newTab ? "_blank" : undefined, rel: newTab ? "noopener noreferrer" : undefined }
      : { type, disabled, onClick }),
  };

  const {
    type: iconKind = "symbol",
    symbol: iconSymbol = "→",
    color: iconColor = "#fff",
    hoverColor: iconHoverColor = "#6366f1",
    side: iconSide = "left",
    size: iconSize = 16,
  } = icon;

  const faceStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    gap: addIcon && showText ? gap : 0,
    flexDirection: iconSide === "right" ? "row-reverse" : "row",
  };

  const content = (isHover) => (
    <>
      {addIcon && iconKind === "symbol" && (
        <span aria-hidden style={{ fontSize: iconSize, lineHeight: 1, color: isHover ? iconHoverColor : iconColor, flex: "none", pointerEvents: "none" }}>
          {iconSymbol}
        </span>
      )}
      {showText && <span>{children ?? label}</span>}
    </>
  );

  return (
    <Tag
      {...tagProps}
      ref={scope}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      className={className}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radiusPx,
        borderWidth: border?.borderWidth,
        borderStyle: border?.borderStyle ?? "solid",
        borderColor: border?.borderColor,
        backgroundColor: fill,
        textDecoration: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        overflow: "hidden",
        boxSizing: "border-box",
        userSelect: "none",
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    >
      {/* Resting face */}
      <span style={{ ...faceStyle, color: textColor }}>{content(false)}</span>

      {/* Hover face — revealed by radial clip */}
      <span
        ref={overlayRef}
        aria-hidden
        style={{
          ...faceStyle,
          position: "absolute",
          inset: 0,
          backgroundColor: hoverFill,
          color: hoverTextColor,
          pointerEvents: "none",
          borderRadius: innerRadiusOf(radiusPx, band),
          clipPath: "circle(0% at 100% 100%)",
          WebkitClipPath: "circle(0% at 100% 100%)",
        }}
      >
        {content(true)}
      </span>
    </Tag>
  );
}
