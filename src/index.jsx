import { useState, useEffect, useRef, useCallback, useMemo } from "react";

import p1 from "./assets/img1.jpeg";
import p2 from "./assets/img2.jpeg";
import p3 from "./assets/img3.jpeg";
import p4 from "./assets/img4.jpeg";
import p5 from "./assets/img5.jpeg";

/* ============================================================
   CONFIGURATION — replace with your own photos in src/assets
   ============================================================ */
const PHOTOS = [p1, p2, p3, p4, p5, p1];
const HER_NAME = "Vinaya"; // ← change this to her real name! // ← change this

/* ============================================================
   UTILS
   ============================================================ */
const rnd = (a, b) => Math.random() * (b - a) + a;
const TAU = Math.PI * 2;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

function evXY(e, el) {
  const r = el.getBoundingClientRect();
  const s = e.touches?.[0] ?? e.changedTouches?.[0] ?? e;
  return { x: s.clientX - r.left, y: s.clientY - r.top };
}

function scatter(cx, cy, color, n = 14) {
  for (let i = 0; i < n; i++) {
    const el = document.createElement("div");
    const angle = (i / n) * TAU + rnd(-0.3, 0.3);
    const dist = rnd(24, 68);
    const size = rnd(2, 6);
    el.style.cssText = `
      position:fixed;left:${cx}px;top:${cy}px;
      width:${size}px;height:${size}px;border-radius:50%;
      background:${color};pointer-events:none;z-index:9999;
      animation:_sc .9s ${i * 0.025}s ease-out forwards;
      --sx:${Math.cos(angle) * dist}px;--sy:${Math.sin(angle) * dist}px;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1050);
  }
}

function useInView(ref, thresh = 0.3) {
  const [v, setV] = useState(false);
  useEffect(() => {
    if (!ref?.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setV(true); },
      { threshold: thresh }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return v;
}

/* ============================================================
   GLOBAL STYLES
   ============================================================ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;1,300;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Syncopate:wght@400;700&family=Great+Vibes&display=swap');

/* keyframes */
@keyframes _sc     { 0%{opacity:1;transform:translate(0,0)scale(1)} 100%{opacity:0;transform:translate(var(--sx),var(--sy))scale(0)} }
@keyframes _fadeup { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
@keyframes _fade   { from{opacity:0} to{opacity:1} }
@keyframes _ken    { from{transform:scale(1.1) translate(-1%,0)} to{transform:scale(1) translate(1%,0)} }
@keyframes _float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
@keyframes _pulse  { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.04)} }
@keyframes _orbit  { from{transform:rotate(var(--os))translateX(var(--or))rotate(calc(-1*var(--os)))} to{transform:rotate(calc(var(--os) + 360deg))translateX(var(--or))rotate(calc(-1*(var(--os) + 360deg)))} }
@keyframes _wipeR  { from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0% 0 0)} }
@keyframes _wipeU  { from{clip-path:inset(100% 0 0 0)} to{clip-path:inset(0 0 0 0)} }
@keyframes _ripple { 0%{transform:translate(-50%,-50%)scale(0);opacity:.7} 100%{transform:translate(-50%,-50%)scale(4);opacity:0} }
@keyframes _glimmer{ 0%{background-position:-200% center} 100%{background-position:200% center} }
@keyframes _breathe{ 0%,100%{opacity:.4} 50%{opacity:1} }
@keyframes _spin   { from{transform:rotate(0)} to{transform:rotate(360deg)} }
@keyframes _tick   { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(1.08)} }
@keyframes _slideL { from{transform:translateX(40px);opacity:0} to{transform:translateX(0);opacity:1} }
@keyframes _flipIn { 0%{transform:rotateY(90deg);opacity:0} 100%{transform:rotateY(0);opacity:1} }
@keyframes _glow   { 0%,100%{text-shadow:0 0 20px var(--gc,#b8936a),0 0 50px var(--gc,#b8936a)} 50%{text-shadow:0 0 40px var(--gc,#b8936a),0 0 100px var(--gc,#b8936a),0 0 160px var(--gc,#b8936a)} }

*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; -webkit-tap-highlight-color:transparent }
html { scroll-snap-type:y mandatory; scroll-behavior:smooth; overflow-x:hidden }
body { background:#060209; overscroll-behavior:none; -webkit-font-smoothing:antialiased }
:root {
  --gold:#b8936a; --rose:#a8687a; --silver:#8c9aaa; --cream:#ede8e0;
  --ink:#060209; --deep:#0c0415;
  --f1:'Cormorant',Georgia,serif;
  --f2:'Syncopate',sans-serif;
  --f3:'Great Vibes',cursive;
  --f4:'Cormorant Garamond',Georgia,serif;
}
.app { color:var(--cream); background:var(--ink); font-family:var(--f1); user-select:none; -webkit-user-select:none; overflow-x:hidden }

/* SECTIONS */
.sc { position:relative; min-height:100svh; display:flex; flex-direction:column; align-items:center; justify-content:center; overflow:hidden; scroll-snap-align:start; padding:2.5rem 1.5rem }

/* TYPE */
.eyebrow { font-family:var(--f2); font-size:.5rem; font-weight:700; letter-spacing:.5em; text-transform:uppercase; color:var(--gold); opacity:.9; margin-bottom:1.6rem; text-shadow:0 2px 10px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.9) }
.display  { font-family:var(--f1); font-size:clamp(1.8rem,8vw,4.2rem); font-weight:500; line-height:1.08; color:var(--cream); text-shadow:0 3px 15px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.9) }
.display em { font-style:italic; color:var(--gold); font-weight:700 }
.title    { font-family:var(--f1); font-size:clamp(1.3rem,6.5vw,2.8rem); font-weight:500; line-height:1.15; text-align:center; color:var(--cream); text-shadow:0 3px 15px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.9) }
.title em { font-style:italic; color:var(--rose); font-weight:700 }
.prose    { font-family:var(--f4); font-size:clamp(.82rem,2.5vw,.92rem); font-weight:500; line-height:2; color:rgba(237,232,224,.9); text-align:center; max-width:300px; text-shadow:0 2px 12px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.9) }
.label    { font-family:var(--f2); font-size:.48rem; letter-spacing:.38em; text-transform:uppercase; color:rgba(184,147,106,.8); font-weight:700; text-shadow:0 2px 8px rgba(0,0,0,0.9) }

/* BTN */
.btn { font-family:var(--f2); font-size:.5rem; font-weight:700; letter-spacing:.35em; text-transform:uppercase; padding:.9rem 2.4rem; background:transparent; border:1px solid rgba(184,147,106,.3); color:var(--gold); cursor:pointer; transition:all .4s; touch-action:manipulation; position:relative; overflow:hidden }
.btn::before { content:''; position:absolute; inset:0; background:rgba(184,147,106,.06); transform:scaleX(0); transform-origin:left; transition:transform .4s }
.btn:hover::before, .btn:active::before { transform:scaleX(1) }
.btn:hover, .btn:active { border-color:rgba(184,147,106,.7); letter-spacing:.42em }
.btn:active { transform:scale(.98) }

/* NAV */
.nav { position:fixed; right:.9rem; top:50%; transform:translateY(-50%); display:flex; flex-direction:column; gap:8px; z-index:500 }
.nd  { width:3px; height:12px; background:rgba(255,255,255,.1); border-radius:2px; cursor:pointer; transition:all .45s }
.nd.on   { background:var(--gold); height:22px; box-shadow:0 0 8px var(--gold) }
.nd.done { background:rgba(184,147,106,.3); }

@media (max-width: 600px) {
  .nav { right: 0.3rem; transform: translateY(-50%) scale(0.85); transform-origin: right center; }
  .sc { padding: 3rem 1rem; }
}

/* SCROLL HINT */
.hint { position:absolute; bottom:2rem; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:5px; animation:_breathe 3s ease-in-out infinite }
.hint .line { width:1px; height:36px; background:linear-gradient(to bottom,rgba(184,147,106,.5),transparent) }
.hint p { font-family:var(--f2); font-size:.4rem; letter-spacing:.4em; color:rgba(184,147,106,.35) }

/* PHOTO LAYER */
.photo-bg { position:absolute; inset:0; background-size:cover; background-position:center; animation:_ken 16s ease-in-out both }
.vignette  { position:absolute; inset:0; background:radial-gradient(ellipse at center, transparent 30%, rgba(6,2,9,.85) 100%); pointer-events:none; z-index:2 }
.grade     { position:absolute; inset:0; pointer-events:none; z-index:1 }
.grain     { position:absolute; inset:0; pointer-events:none; z-index:3; opacity:.3; mix-blend-mode:overlay; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='.08'/%3E%3C/svg%3E") }

/* MEMORY CARD */
.m-grid { display:grid; gap:6px }
.m-card { perspective:700px; cursor:pointer; touch-action:manipulation }
.m-inner { width:100%; height:100%; position:relative; transform-style:preserve-3d; transition:transform .6s cubic-bezier(.4,0,.2,1); border-radius:5px }
.m-card.flipped .m-inner, .m-card.matched .m-inner { transform:rotateY(180deg) }
.m-front, .m-back { position:absolute; inset:0; border-radius:5px; backface-visibility:hidden; display:flex; align-items:center; justify-content:center }
.m-front { background:linear-gradient(135deg,#110820,#0a0418); border:1px solid rgba(184,147,106,.12) }
.m-back  { transform:rotateY(180deg); overflow:hidden }
.m-card.matched .m-front { background:linear-gradient(135deg,#0a180a,#051205); border-color:rgba(106,184,120,.2) }

/* SCRATCH */
.scratch { position:relative; border-radius:6px; overflow:hidden; cursor:crosshair; touch-action:none }

/* CONSTELLATION */
.star-hit { position:absolute; transform:translate(-50%,-50%); border-radius:50%; cursor:pointer; touch-action:manipulation }

/* LETTER */
.letter-wrap { background:rgba(184,147,106,.04); border:1px solid rgba(184,147,106,.12); border-radius:4px; padding:1.8rem 1.5rem; text-align:left; max-width:340px; width:100% }
.letter-line  { font-family:var(--f4); font-size:.83rem; font-weight:300; line-height:2.1; color:rgba(237,232,224,.68); margin-bottom:.9rem; border-left:1px solid rgba(184,147,106,.2); padding-left:1rem }
`;

/* ============================================================
   SHARED ATOMS
   ============================================================ */

function Dust({ n = 28, col = "184,147,106" }) {
  const pts = useMemo(() =>
    Array.from({ length: n }, () => ({
      x: rnd(0, 100), y: rnd(0, 100),
      s: rnd(0.8, 2.5), op: rnd(0.04, 0.18),
      d: rnd(3, 9) + "s", dl: rnd(0, 8) + "s",
    })), []);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {pts.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: p.x + "%", top: p.y + "%",
          width: p.s, height: p.s, borderRadius: "50%",
          background: `rgba(${col},${p.op})`,
          animation: `_pulse ${p.d} ${p.dl} ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

function Vignette({ strength = 0.85 }) {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
      background: `radial-gradient(ellipse at center,transparent 30%,rgba(6,2,9,${strength}) 100%)`,
    }} />
  );
}

function Grade({ stops }) {
  return (
    <div className="grade" style={{ background: stops }} />
  );
}

function RippleDot({ x, y, color }) {
  return (
    <div style={{
      position: "absolute", left: x, top: y,
      width: 36, height: 36, borderRadius: "50%",
      border: `1px solid ${color}`,
      pointerEvents: "none", zIndex: 10,
      animation: "_ripple .8s ease-out forwards",
    }} />
  );
}

/* ============================================================
   CHAPTER 1 — OPENING
   Full-bleed portrait. Touch leaves golden ripples.
   Words cycle: warmth / depth / you.
   ============================================================ */
function C1({ sref }) {
  const canvRef = useRef();
  const ripsRef = useRef([]);
  const afRef = useRef();
  const [widx, setWidx] = useState(0);
  const WORDS = ["my favorite chat buddy", "my 'online friend'", "the 'night owl'", "friend-zoning me"];

  useEffect(() => {
    const iv = setInterval(() => setWidx(w => (w + 1) % WORDS.length), 2400);
    return () => clearInterval(iv);
  }, []);

  const addRip = useCallback(e => {
    const cv = canvRef.current; if (!cv) return;
    const { x, y } = evXY(e, cv);
    ripsRef.current.push({ x, y, born: Date.now(), maxR: rnd(50, 110) });
  }, []);

  useEffect(() => {
    const cv = canvRef.current; if (!cv) return;
    const resize = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv);
    const draw = () => {
      const ctx = cv.getContext("2d");
      ctx.clearRect(0, 0, cv.width, cv.height);
      const now = Date.now();
      ripsRef.current = ripsRef.current.filter(r => now - r.born < 2000);
      ripsRef.current.forEach(r => {
        const t = (now - r.born) / 2000;
        const radius = r.maxR * t;
        const alpha = 1 - t;
        ctx.beginPath(); ctx.arc(r.x, r.y, radius, 0, TAU);
        ctx.strokeStyle = `rgba(184,147,106,${alpha * 0.55})`; ctx.lineWidth = 1;
        ctx.stroke();
        if (radius > 18) {
          ctx.beginPath(); ctx.arc(r.x, r.y, radius * 0.5, 0, TAU);
          ctx.strokeStyle = `rgba(220,190,140,${alpha * 0.25})`; ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
      afRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(afRef.current); ro.disconnect(); };
  }, []);

  return (
    <section ref={sref} className="sc" style={{ padding: 0, cursor: "crosshair" }}
      onMouseMove={addRip} onTouchMove={e => { e.preventDefault(); addRip(e); }} onTouchStart={addRip}>
      <div className="photo-bg grain" style={{ backgroundImage: `url(${PHOTOS[0]})` }} />
      <Grade stops="linear-gradient(to bottom,rgba(6,2,9,.3) 0%,rgba(6,2,9,.55) 100%)" />
      <Vignette strength={.8} />
      <canvas ref={canvRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 4 }} />

      <div style={{ position: "relative", zIndex: 5, textAlign: "center", padding: "0 2rem" }}>
        <p className="eyebrow" style={{ animation: "_fadeup 1.2s .5s ease both", opacity: 0 }}>
          chapter one
        </p>
        <h1 className="display" style={{ animation: "_fadeup 1.2s .8s ease both", opacity: 0, textAlign: "center", maxWidth: 360, margin: "0 auto .6rem" }}>
          You are mostly{" "}
          <em key={widx} style={{ animation: "_fade .6s ease forwards", display: "inline-block" }}>
            {WORDS[widx]}
          </em>
        </h1>
        <p className="prose" style={{ animation: "_fadeup 1.2s 1.1s ease both", opacity: 0, margin: "1rem auto 0" }}>
          A heavily biased presentation on why you should give this 'kiddo' a chance. (Move your finger!)
        </p>
        <p className="label" style={{ marginTop: "2rem", animation: "_fadeup 1s 1.6s ease both", opacity: 0 }}>
          touch · scroll
        </p>
      </div>
      <div className="hint" style={{ zIndex: 6 }}>
        <p>scroll</p><div className="line" />
      </div>
    </section>
  );
}

/* ============================================================
   CHAPTER 2 — CURTAIN DRAG
   A dark curtain hides her portrait. Drag it away.
   ============================================================ */
function C2({ sref }) {
  const [pct, setPct] = useState(0); // 0=hidden 100=revealed
  const [done, setDone] = useState(false);
  const dragging = useRef(false);
  const boxRef = useRef();

  const move = useCallback(e => {
    if (!dragging.current || !boxRef.current) return;
    const r = boxRef.current.getBoundingClientRect();
    const { x } = evXY(e, boxRef.current);
    const p = clamp((x / r.width) * 100, 0, 100);
    setPct(p);
    if (p > 90 && !done) { setDone(true); scatter(r.left + r.width * .5, r.top + r.height * .4, "#b8936a", 16); }
  }, [done]);

  return (
    <section ref={sref} className="sc" style={{ background: var_("--deep") }}>
      <Dust n={22} />
      <div style={{ position: "relative", zIndex: 5, textAlign: "center", width: "100%", maxWidth: 400 }}>
        <p className="eyebrow">chapter two</p>
        <p className="title" style={{ marginBottom: "1.4rem", fontSize: "clamp(1.2rem,4vw,2rem)" }}>
          {done ? <em>Still totally worth the effort.</em> : "Reveal the one I'm trying to impress"}
        </p>

        <div ref={boxRef}
          style={{ position: "relative", width: "100%", height: 360, borderRadius: 6, overflow: "hidden", touchAction: "none", cursor: "ew-resize" }}
          onMouseDown={() => dragging.current = true} onMouseMove={move}
          onMouseUp={() => dragging.current = false} onMouseLeave={() => dragging.current = false}
          onTouchStart={() => dragging.current = true} onTouchMove={move} onTouchEnd={() => dragging.current = false}
        >
          {/* photo */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${PHOTOS[1]})`, backgroundSize: "cover", backgroundPosition: "center top" }} />
          <Grade stops="linear-gradient(to bottom,rgba(6,2,9,.15),rgba(6,2,9,.4))" />
          <Vignette strength={.35} />

          {/* curtain */}
          <div style={{
            position: "absolute", top: 0, right: 0, bottom: 0,
            width: `${100 - pct}%`,
            background: "linear-gradient(to right,rgba(6,2,9,.05) 0%,#060209 8%)",
            transition: dragging.current ? "none" : "width .08s",
            borderLeft: pct > 1 ? "1px solid rgba(184,147,106,.3)" : "none",
          }} />

          {/* handle */}
          <div style={{
            position: "absolute", top: "50%", left: `${pct}%`,
            transform: "translate(-50%,-50%)",
            width: 28, height: 28, borderRadius: "50%",
            background: "rgba(184,147,106,.12)", border: "1px solid rgba(184,147,106,.45)",
            backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center",
            pointerEvents: "none", transition: dragging.current ? "none" : "left .08s",
          }}>
            <div style={{ display: "flex", gap: 3 }}>
              <div style={{ width: 1, height: 12, background: "rgba(184,147,106,.8)" }} />
              <div style={{ width: 1, height: 12, background: "rgba(184,147,106,.8)" }} />
            </div>
          </div>

          {done && (
            <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, textAlign: "center", zIndex: 5 }}>
              <p className="label" style={{ animation: "_fadeup .7s ease forwards" }}>"how did a 22-year-old end up here?"</p>
            </div>
          )}
        </div>

        {!done && <p className="prose" style={{ marginTop: "1rem", margin: "1rem auto 0" }}>Drag right to reveal the one who just wants to be 'online friends'</p>}
      </div>
      <div className="hint"><p>scroll</p><div className="line" /></div>
    </section>
  );
}

function var_(v) { return `var(${v})`; }

/* ============================================================
   CHAPTER 3 — SCRATCH CARD
   Gold surface — scratch to uncover message over portrait.
   ============================================================ */
function C3({ sref }) {
  const canvRef = useRef();
  const painting = useRef(false);
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const cv = canvRef.current; if (!cv) return;
    const setup = () => {
      cv.width = cv.offsetWidth; cv.height = cv.offsetHeight;
      const ctx = cv.getContext("2d");
      const W = cv.width, H = cv.height;
      const grd = ctx.createLinearGradient(0, 0, W, H);
      grd.addColorStop(0, "#b8936a"); grd.addColorStop(.4, "#d4aa7a");
      grd.addColorStop(.7, "#a07848"); grd.addColorStop(1, "#c09058");
      ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);
      // subtle lines
      ctx.strokeStyle = "rgba(0,0,0,.08)"; ctx.lineWidth = .5;
      for (let y = 0; y < H; y += 10) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      // instruction text
      ctx.fillStyle = "rgba(6,2,9,.35)";
      ctx.font = `300 ${W * .038}px 'Cormorant Garamond',serif`;
      ctx.textAlign = "center"; ctx.fillText("scratch to reveal", W / 2, H / 2 - 8);
    };
    setup();
    const ro = new ResizeObserver(setup); ro.observe(cv);
    return () => ro.disconnect();
  }, []);

  const doScratch = useCallback(e => {
    if (!painting.current) return; e.preventDefault();
    const cv = canvRef.current; if (!cv) return;
    const { x, y } = evXY(e, cv);
    const ctx = cv.getContext("2d");
    ctx.globalCompositeOperation = "destination-out";
    const r = 24; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    // smear
    ctx.beginPath(); ctx.arc(x + rnd(-4, 4), y + rnd(-4, 4), r * .6, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    const data = ctx.getImageData(0, 0, cv.width, cv.height).data;
    let c = 0; for (let i = 3; i < data.length; i += 12) if (data[i] < 64) c++;
    const p = Math.min(Math.round(c / (data.length / 12) * 100), 100);
    setPct(p); if (p > 58 && !done) setDone(true);
  }, [done]);

  return (
    <section ref={sref} className="sc" style={{ background: "#070110" }}>
      <Dust n={20} />
      <div style={{ position: "relative", zIndex: 5, textAlign: "center", width: "100%", maxWidth: 380 }}>
        <p className="eyebrow">chapter three</p>
        <p className="title" style={{ marginBottom: "1.2rem", fontSize: "clamp(1.2rem,4vw,2rem)" }}>
          {done ? <em>"100% Certified Special Person"</em> : "Scratch to read my mind"}
        </p>

        <div className="scratch">
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${PHOTOS[2]})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          <Grade stops="linear-gradient(to top,rgba(6,2,9,.5),rgba(6,2,9,.1))" />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ fontFamily: "var(--f3)", fontSize: "clamp(2rem,8vw,3.2rem)", color: "#fff", textShadow: "0 2px 24px rgba(0,0,0,.9)", lineHeight: 1.3, textAlign: "center", padding: "0 1rem" }}>
              You are<br />worth<br />the effort.
            </p>
          </div>
          <canvas ref={canvRef} className="scratch"
            style={{ width: "100%", height: 280, display: "block", position: "relative", zIndex: 3, touchAction: "none" }}
            onMouseDown={() => painting.current = true} onMouseMove={doScratch}
            onMouseUp={() => painting.current = false} onMouseLeave={() => painting.current = false}
            onTouchStart={() => painting.current = true} onTouchMove={doScratch} onTouchEnd={() => painting.current = false}
          />
        </div>

        <p className="prose" style={{ marginTop: "1rem", margin: "1rem auto 0" }}>
          {done ? `"Science has confirmed age is just a number."` : `${pct}% uncovered — keep going`}
        </p>
      </div>
      <div className="hint"><p>scroll</p><div className="line" /></div>
    </section>
  );
}

/* ============================================================
   CHAPTER 4 — PHOTO MOSAIC
   Portrait hidden under dark tiles. Tap each tile to reveal it.
   Tiles shatter open with scatter burst.
   ============================================================ */
function C4({ sref }) {
  const COLS = 4, ROWS = 5, TOTAL = COLS * ROWS;
  const [revealed, setReveal] = useState(new Set());
  const done = revealed.size === TOTAL;

  const tap = (i, e) => {
    if (revealed.has(i)) return;
    const r = e.currentTarget.getBoundingClientRect();
    scatter(r.left + r.width * .5, r.top + r.height * .5, "#b8936a", 7);
    setReveal(prev => new Set([...prev, i]));
  };

  return (
    <section ref={sref} className="sc" style={{ background: "#060108" }}>
      <Dust n={18} />
      <div style={{ position: "relative", zIndex: 5, textAlign: "center", width: "100%" }}>
        <p className="eyebrow">chapter four</p>
        <p className="title" style={{ marginBottom: "1rem", fontSize: "clamp(1.1rem,4vw,1.9rem)" }}>
          {done ? <em>There she is, in all her glory.</em> : "Tap each tile to reveal her"}
        </p>

        <div style={{ position: "relative", width: "100%", maxWidth: 300, margin: "0 auto", borderRadius: 6, overflow: "hidden" }}>
          <img src={PHOTOS[3]} alt="" style={{ width: "100%", display: "block", filter: "brightness(.95) saturate(1.08)" }} />
          <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: `repeat(${COLS},1fr)`, gridTemplateRows: `repeat(${ROWS},1fr)` }}>
            {Array.from({ length: TOTAL }, (_, i) => (
              <div key={i}
                onClick={e => tap(i, e)} onTouchStart={e => { e.preventDefault(); tap(i, e); }}
                style={{
                  background: revealed.has(i) ? "transparent" : "#06020a",
                  cursor: revealed.has(i) ? "default" : "pointer",
                  touchAction: "manipulation",
                  transition: "background .5s ease",
                  borderRight: "2px solid rgba(184,147,106,.2)",
                  borderBottom: "2px solid rgba(184,147,106,.2)",
                }}
              />
            ))}
          </div>
        </div>

        <p className="prose" style={{ marginTop: "1rem", margin: "1rem auto 0" }}>
          {done ? `"Still rejecting my proposals, I see."` : `${revealed.size} / ${TOTAL} revealed`}
        </p>
      </div>
      <div className="hint"><p>scroll</p><div className="line" /></div>
    </section>
  );
}

/* ============================================================
   CHAPTER 5 — MEMORY MATCH
   12 cards: 3 photos × 2 + 3 word pairs × 2.
   Photo cards flip to reveal her portraits.
   ============================================================ */
function C5({ sref }) {
  const WORDS = [
    { id: "wa", label: "friend-zoning", col: "#b8936a" },
    { id: "de", label: "independent", col: "#a8687a" },
    { id: "li", label: "scared", col: "#8c9aaa" },
  ];
  const PHOTO_IDS = ["ph0", "ph1", "ph2"];

  const pairs = [
    ...PHOTO_IDS.map((id, i) => ({ id, type: "photo", src: PHOTOS[i] })),
    ...WORDS.map(w => ({ ...w, type: "word" })),
  ];

  const [cards] = useState(() => {
    const all = [...pairs, ...pairs.map(p => ({ ...p, id: p.id + "_" }))];
    for (let i = all.length - 1; i > 0; i--) { const j = rndInt(i + 1);[all[i], all[j]] = [all[j], all[i]]; }
    return all;
  });

  function rndInt(n) { return Math.floor(Math.random() * n); }

  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const done = matched.size === cards.length;

  const flip = useCallback((id, e) => {
    if (locked || flipped.includes(id) || matched.has(id)) return;
    const nf = [...flipped, id];
    setFlipped(nf);
    if (nf.length === 2) {
      setMoves(m => m + 1); setLocked(true);
      const [a, b] = nf.map(fid => cards.find(c => c.id === fid));
      const baseId = x => x.id.replace(/_$/, "");
      const isMatch = baseId(a) === baseId(b);
      if (isMatch) {
        const r = e.currentTarget.getBoundingClientRect();
        scatter(r.left + r.width * .5, r.top + r.height * .5, "#b8936a", 10);
        setTimeout(() => { setMatched(p => new Set([...p, a.id, b.id])); setFlipped([]); setLocked(false); }, 350);
      } else {
        setTimeout(() => { setFlipped([]); setLocked(false); }, 1100);
      }
    }
  }, [flipped, matched, locked, cards]);

  return (
    <section ref={sref} className="sc" style={{ background: "linear-gradient(160deg,#0c0418,#060108)" }}>
      <Dust n={24} />
      <div style={{ position: "relative", zIndex: 5, textAlign: "center", width: "100%" }}>
        <p className="eyebrow">chapter five</p>
        <p className="title" style={{ marginBottom: ".4rem", fontSize: "clamp(1.2rem,4vw,2rem)" }}>
          {done ? <em>Wow, maybe I'm not just a kiddo.</em> : "Match these up (if you can)"}
        </p>
        <p className="prose" style={{ marginBottom: "1.4rem", margin: "0 auto 1.4rem" }}>
          {done ? `"See? We make a great match."` : `${matched.size / 2} / ${pairs.length} pairs · ${moves} moves`}
        </p>

        <div className="m-grid" style={{ gridTemplateColumns: "repeat(4,1fr)", maxWidth: 340, margin: "0 auto", gap: 7 }}>
          {cards.map(card => {
            const isF = flipped.includes(card.id) || matched.has(card.id);
            const isMt = matched.has(card.id);
            return (
              <div key={card.id} className={`m-card${isF ? " flipped" : ""}${isMt ? " matched" : ""}`}
                style={{ height: 78 }}
                onClick={e => flip(card.id, e)} onTouchStart={e => { e.preventDefault(); flip(card.id, e); }}>
                <div className="m-inner">
                  <div className="m-front">
                    <div style={{ width: 18, height: 18, opacity: .12 }}>
                      <svg viewBox="0 0 18 18" fill="none" stroke="rgba(184,147,106,1)" strokeWidth="1">
                        <line x1="9" y1="2" x2="9" y2="16" /><line x1="2" y1="9" x2="16" y2="9" />
                      </svg>
                    </div>
                  </div>
                  <div className="m-back">
                    {card.type === "photo"
                      ? <img src={card.src} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                      : <div style={{ width: "100%", height: "100%", background: card.col + "14", border: `1px solid ${card.col}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "var(--f1)", fontStyle: "italic", fontSize: ".9rem", color: card.col }}>{card.label}</span>
                      </div>
                    }
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="hint"><p>scroll</p><div className="line" /></div>
    </section>
  );
}

/* ============================================================
   CHAPTER 6 — PARALLAX DEPTH GALLERY
   Three floating portrait frames at different depths.
   Move cursor / tilt device to shift parallax.
   Tap a frame to expand + read its label.
   ============================================================ */
function C6({ sref }) {
  const [mx, setMx] = useState(0), [my, setMy] = useState(0);
  const [active, setActive] = useState(null);
  const wrapRef = useRef();

  const onMove = useCallback(e => {
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    const src = e.touches?.[0] ?? e;
    setMx((src.clientX - r.left) / r.width - .5);
    setMy((src.clientY - r.top) / r.height - .5);
  }, []);

  const FRAMES = [
    { src: PHOTOS[0], label: "friend-zoning me at 9 PM", depth: 2.2, rot: -4, left: "4%", top: "10%", w: 190, h: 240 },
    { src: PHOTOS[2], label: "trying to hide that you actually like me", depth: 1.3, rot: 2, left: "32%", top: "22%", w: 220, h: 270 },
    { src: PHOTOS[4], label: "telling me 'I'm just a kiddo'", depth: 2.8, rot: -2, left: "18%", top: "50%", w: 185, h: 230 },
  ];

  return (
    <section ref={sref} className="sc"
      style={{ background: "#07030f", padding: 0, minHeight: "100svh" }}
      onMouseMove={onMove} onTouchMove={onMove}>
      <Dust />
      <div ref={wrapRef}
        style={{ position: "relative", width: "100%", height: "68svh", maxWidth: 420, margin: "0 auto" }}>
        {FRAMES.map((f, i) => (
          <div key={i}
            onClick={() => {
              const wasActive = active === i;
              setActive(wasActive ? null : i);
              if (!wasActive) {
                const el = document.querySelector(`.frame-${i}`);
                if (el) { const r = el.getBoundingClientRect(); scatter(r.left + r.width * .5, r.top + r.height * .5, "#b8936a", 8); }
              }
            }}
            onTouchStart={e => { e.preventDefault(); setActive(active === i ? null : i); }}
            className={`frame-${i}`}
            style={{
              position: "absolute", left: f.left, top: f.top,
              width: f.w, height: f.h,
              transform: `rotate(${f.rot}deg) translate(${mx * f.depth * -7}px,${my * f.depth * -5}px)`,
              transition: "transform .18s ease",
              boxShadow: active === i
                ? "0 30px 80px rgba(0,0,0,.85),0 0 0 1px rgba(184,147,106,.25)"
                : "0 14px 40px rgba(0,0,0,.65)",
              borderRadius: 4, overflow: "hidden",
              cursor: "pointer", touchAction: "manipulation",
              zIndex: active === i ? 10 : i + 1,
            }}>
            <img src={f.src} style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              filter: active === i ? "brightness(.8)" : "brightness(.75) saturate(1.05)", transition: "filter .3s"
            }}
              alt="" />
            <Grade stops="linear-gradient(to bottom,rgba(6,2,9,.08),rgba(6,2,9,.45))" />
            <Vignette strength={.25} />
            {active === i && (
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, padding: ".8rem",
                background: "linear-gradient(to top,rgba(6,2,9,.9),transparent)",
                animation: "_fadeup .4s ease forwards"
              }}>
                <p className="label">{f.label}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 5, textAlign: "center", padding: "1.5rem 2rem 0" }}>
        <p className="eyebrow">chapter six</p>
        <p className="title" style={{ fontSize: "clamp(1.1rem,3.5vw,1.8rem)" }}>
          Every angle is your <em>best angle</em>
        </p>
        <p className="prose" style={{ margin: ".7rem auto 0" }}>
          Move or tilt · tap a portrait to read it
        </p>
      </div>
      <div className="hint" style={{ zIndex: 6 }}><p>scroll</p><div className="line" /></div>
    </section>
  );
}

/* ============================================================
   CHAPTER 7 — SWIPE SCENES (together moments)
   Cinematic card. Swipe or tap → yes. No emojis.
   Photo fills card. Text overlays it.
   ============================================================ */
function C7({ sref }) {
  const SCENES = [
    { q: "Am I just an online friend?", a: "No, you're much more.", img: PHOTOS[4] },
    { q: "Are we going out to Fun Mall?", a: "Yes, my treat.", img: PHOTOS[5] },
    { q: "Will you stop using my age against me?", a: "Yes. 100%.", img: PHOTOS[0] },
    { q: "Did I impress you with this website?", a: "Obviously.", img: PHOTOS[1] },
    { q: "Can we stop the 'just friends' act?", a: "Yes, I yield.", img: PHOTOS[2] },
    { q: "Will you finally say yes?", a: "Maybe...", img: PHOTOS[3] },
  ];

  const [idx, setIdx] = useState(0);
  const [animDir, setAnimDir] = useState(null);
  const [done, setDone] = useState(false);
  const [answered, setAnswered] = useState([]);
  const startX = useRef(null);
  const cardRef = useRef();

  const advance = useCallback(() => {
    if (animDir) return;
    const r = cardRef.current?.getBoundingClientRect();
    if (r) scatter(r.left + r.width * .5, r.top + r.height * .45, "#b8936a", 12);
    setAnimDir("out");
    setTimeout(() => {
      setAnswered(p => [...p, SCENES[idx]]);
      const ni = idx + 1;
      setIdx(ni); setAnimDir(null);
      if (ni >= SCENES.length) setDone(true);
    }, 380);
  }, [animDir, idx]);

  const onTS = useCallback(e => { startX.current = e.touches[0].clientX; }, []);
  const onTE = useCallback(e => {
    if (startX.current === null) return;
    if (Math.abs(e.changedTouches[0].clientX - startX.current) > 45) advance();
    startX.current = null;
  }, [advance]);

  return (
    <section ref={sref} className="sc" style={{ background: "#080310" }}>
      <Dust n={22} />
      <div style={{ position: "relative", zIndex: 5, textAlign: "center", width: "100%", maxWidth: 380 }}>
        <p className="eyebrow">chapter seven</p>
        <p className="title" style={{ marginBottom: ".6rem", fontSize: "clamp(1.1rem,4vw,1.9rem)" }}>
          {done ? <em>Sigh... okay.</em> : "Swipe to agree to a real date"}
        </p>

        {!done && (
          <>
            <div ref={cardRef}
              onClick={advance} onTouchStart={onTS} onTouchEnd={onTE}
              style={{
                position: "relative", width: "100%", borderRadius: 8, overflow: "hidden",
                marginBottom: "1.2rem", cursor: "pointer", touchAction: "pan-y",
                transform: animDir === "out" ? "translateX(55px) scale(.95)" : "none",
                opacity: animDir === "out" ? 0 : 1,
                transition: "transform .35s ease, opacity .35s ease",
              }}>
              <img src={SCENES[idx].img} style={{ width: "100%", height: 230, objectFit: "cover", display: "block", filter: "brightness(.7) saturate(1.1)" }} alt="" />
              <Grade stops="linear-gradient(to top,rgba(6,2,9,.9) 0%,rgba(6,2,9,.1) 60%)" />
              <Vignette strength={.25} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.4rem 1.2rem", textAlign: "left" }}>
                <p style={{ fontFamily: "var(--f1)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(1.05rem,4vw,1.35rem)", lineHeight: 1.4, color: "#fff", marginBottom: ".7rem" }}>
                  {SCENES[idx].q}
                </p>
                <p style={{ fontFamily: "var(--f2)", fontSize: ".48rem", letterSpacing: ".3em", color: "rgba(184,147,106,.85)" }}>
                  {SCENES[idx].a}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p className="label">{idx + 1} / {SCENES.length}</p>
              <button className="btn" onClick={advance}>Yes, always</button>
              <p className="label">tap or swipe</p>
            </div>
          </>
        )}

        {done && (
          <div style={{ animation: "_fadeup .8s ease forwards" }}>
            <p className="prose" style={{ margin: "0 auto 1.5rem" }}>
              "I guess I'm okay with going on a date with a 22-year-old."
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center" }}>
              {SCENES.map((s, i) => (
                <div key={i} style={{ border: "1px solid rgba(184,147,106,.16)", borderRadius: 3, padding: "4px 10px", fontFamily: "var(--f2)", fontSize: ".42rem", letterSpacing: ".12em", color: "rgba(184,147,106,.55)" }}>
                  {s.q.split(" ").slice(0, 4).join(" ")}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="hint"><p>scroll</p><div className="line" /></div>
    </section>
  );
}

/* ============================================================
   CHAPTER 8 — CONSTELLATION
   Connect 10 stars in a heart shape by tapping pairs.
   Canvas overlay on dimmed portrait.
   ============================================================ */
function C8({ sref }) {
  const canvRef = useRef(), afRef = useRef();
  const [conns, setConns] = useState([]);
  const [hov, setHov] = useState(null);
  const [done, setDone] = useState(false);
  const lastRef = useRef(null);

  const STARS = useMemo(() => [
    { x: .50, y: .17, l: "A" }, { x: .33, y: .11, l: "B" }, { x: .19, y: .23, l: "C" },
    { x: .15, y: .39, l: "D" }, { x: .26, y: .55, l: "E" }, { x: .50, y: .75, l: "F" },
    { x: .74, y: .55, l: "G" }, { x: .85, y: .39, l: "H" }, { x: .81, y: .23, l: "I" }, { x: .67, y: .11, l: "J" },
  ], []);
  const EDGES = useMemo(() => [
    ["B", "C"], ["C", "D"], ["D", "E"], ["E", "F"], ["F", "G"], ["G", "H"], ["H", "I"], ["I", "J"], ["J", "A"], ["A", "B"],
  ], []);

  useEffect(() => {
    const cv = canvRef.current; if (!cv) return;
    const resize = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv);
    const draw = () => {
      const ctx = cv.getContext("2d"); const { width: W, height: H } = cv;
      ctx.clearRect(0, 0, W, H);
      const px = s => s.x * W, py = s => s.y * H, gs = l => STARS.find(s => s.l === l);

      // Guide lines (faint)
      EDGES.forEach(([a, b]) => {
        if (conns.includes(a + "_" + b) || conns.includes(b + "_" + a)) return;
        const sa = gs(a), sb = gs(b);
        ctx.beginPath(); ctx.moveTo(px(sa), py(sa)); ctx.lineTo(px(sb), py(sb));
        ctx.strokeStyle = "rgba(255,255,255,.04)"; ctx.lineWidth = 1; ctx.setLineDash([3, 7]); ctx.stroke(); ctx.setLineDash([]);
      });

      // Connected lines
      EDGES.forEach(([a, b]) => {
        if (!conns.includes(a + "_" + b) && !conns.includes(b + "_" + a)) return;
        const sa = gs(a), sb = gs(b);
        const grd = ctx.createLinearGradient(px(sa), py(sa), px(sb), py(sb));
        grd.addColorStop(0, "rgba(184,147,106,.9)"); grd.addColorStop(1, "rgba(168,104,122,.9)");
        ctx.strokeStyle = grd; ctx.lineWidth = 1.5;
        ctx.shadowColor = "rgba(184,147,106,.5)"; ctx.shadowBlur = 7;
        ctx.beginPath(); ctx.moveTo(px(sa), py(sa)); ctx.lineTo(px(sb), py(sb)); ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Stars
      STARS.forEach(s => {
        const isH = hov?.l === s.l, isC = conns.some(c => c.includes(s.l));
        const r = isH ? 9 : isC ? 6 : 4;
        ctx.beginPath(); ctx.arc(px(s), py(s), r, 0, TAU);
        ctx.fillStyle = isH ? "#c9a96e" : isC ? "#e8d4b0" : "rgba(255,255,255,.55)"; ctx.fill();
        // specular
        ctx.beginPath(); ctx.arc(px(s) - r * .28, py(s) - r * .28, r * .32, 0, TAU);
        ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.fill();
        // halo
        if (isH || isC) {
          ctx.beginPath(); ctx.arc(px(s), py(s), r + 8, 0, TAU);
          ctx.fillStyle = `rgba(184,147,106,${isH ? .14 : .07})`; ctx.fill();
        }
      });
      afRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(afRef.current); ro.disconnect(); };
  }, [conns, hov, STARS, EDGES]);

  const getS = useCallback((x, y, W, H) => STARS.find(s => Math.hypot(s.x * W - x, s.y * H - y) < 25), [STARS]);

  const tap = useCallback(e => {
    e.preventDefault();
    const cv = canvRef.current; if (!cv) return;
    const { x, y } = evXY(e, cv), r = cv.getBoundingClientRect();
    const s = getS(x, y, cv.width, cv.height);
    if (!s) { lastRef.current = null; return; }
    scatter(r.left + x, r.top + y, "#b8936a", 6);
    if (lastRef.current && lastRef.current.l !== s.l) {
      const valid = EDGES.some(([a, b]) => (a === lastRef.current.l && b === s.l) || (b === lastRef.current.l && a === s.l));
      const key = lastRef.current.l + "_" + s.l;
      if (valid && !conns.includes(key) && !conns.includes(s.l + "_" + lastRef.current.l)) {
        const nc = [...conns, key]; setConns(nc);
        if (nc.length >= EDGES.length) setDone(true);
      }
    }
    lastRef.current = s;
  }, [conns, EDGES, getS]);

  const onMov = useCallback(e => {
    const cv = canvRef.current; if (!cv) return;
    const { x, y } = evXY(e, cv); setHov(getS(x, y, cv.width, cv.height) || null);
  }, [getS]);

  return (
    <section ref={sref} className="sc" style={{ padding: 0, background: "#04010b" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${PHOTOS[4]})`, backgroundSize: "cover", backgroundPosition: "center", opacity: .07, filter: "blur(5px)" }} />
      <canvas ref={canvRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", touchAction: "none", cursor: "crosshair", zIndex: 3 }}
        onClick={tap} onTouchStart={tap}
        onMouseMove={onMov} onTouchMove={e => { const cv = canvRef.current; if (!cv) return; const { x, y } = evXY(e, cv); setHov(getS(x, y, cv.width, cv.height) || null); }}
      />
      <div style={{ position: "absolute", bottom: "9%", left: 0, right: 0, textAlign: "center", zIndex: 5, padding: "0 2rem", pointerEvents: "none" }}>
        <p className="eyebrow">chapter eight</p>
        <p className="title" style={{ fontSize: "clamp(1.1rem,4vw,1.8rem)", marginBottom: ".4rem" }}>
          {done ? <em>Flawless. But then again, I did make it.</em> : "How to find a star"}
        </p>
        <p className="prose">
          {done ? `"Admit it, I'm a genius. I literally connected the stars because I'm just that good. You're welcome for being the most talented person in your orbit (and for liking you this much)."` : `Tap pairs in sequence · ${conns.length} / ${EDGES.length}`}
        </p>
      </div>
    </section>
  );
}

/* ============================================================
   CHAPTER 9 — KALEIDOSCOPE
   Her photo fractures into a mirrored kaleidoscope on touch.
   Click anywhere to build intensity.
   ============================================================ */
function C9({ sref }) {
  const canvRef = useRef(), afRef = useRef();
  const imgRef = useRef(null);
  const ptRef = useRef({ x: .5, y: .5 });
  const intRef = useRef(0);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const img = new Image(); img.crossOrigin = "anonymous";
    img.src = PHOTOS[0]; img.onload = () => { imgRef.current = img; };
  }, []);

  useEffect(() => {
    const cv = canvRef.current; if (!cv) return;
    const resize = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv);
    const SEGS = 8;
    const draw = () => {
      const ctx = cv.getContext("2d"); const { width: W, height: H } = cv;
      const img = imgRef.current; const t = intRef.current;
      ctx.clearRect(0, 0, W, H);
      if (!img) { afRef.current = requestAnimationFrame(draw); return; }
      if (t < .005) {
        ctx.drawImage(img, 0, 0, W, H);
        ctx.fillStyle = "rgba(6,2,9,.3)"; ctx.fillRect(0, 0, W, H);
      } else {
        const cx = W / 2, cy = H / 2, now = Date.now();
        for (let seg = 0; seg < SEGS; seg++) {
          const angle = (seg / SEGS) * TAU + now * .00006 * t;
          ctx.save(); ctx.translate(cx, cy); ctx.rotate(angle);
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, Math.max(W, H), 0, TAU / SEGS); ctx.closePath(); ctx.clip();
          if (seg % 2 === 0) ctx.scale(-1, 1);
          const ox = ptRef.current.x * W * .35 * t, oy = ptRef.current.y * H * .35 * t;
          ctx.drawImage(img, -W / 2 + ox, -H / 2 + oy, W, H);
          ctx.restore();
        }
        // vignette
        const vg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * .62);
        vg.addColorStop(0, "transparent"); vg.addColorStop(1, "rgba(4,1,11,.75)");
        ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
      }
      afRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(afRef.current); ro.disconnect(); };
  }, []);

  const onTap = useCallback(e => {
    e.preventDefault();
    const cv = canvRef.current; if (!cv) return;
    const { x, y } = evXY(e, cv);
    ptRef.current = { x: x / cv.width, y: y / cv.height };
    intRef.current = Math.min(intRef.current + .18, 1);
    setTouched(true);
    scatter(e.changedTouches?.[0]?.clientX ?? e.clientX, e.changedTouches?.[0]?.clientY ?? e.clientY, "#b8936a", 8);
  }, []);

  const onMov = useCallback(e => {
    const cv = canvRef.current; if (!cv) return;
    const { x, y } = evXY(e, cv);
    ptRef.current = { x: x / cv.width, y: y / cv.height };
    if (intRef.current > .01) intRef.current = Math.min(intRef.current + .008, 1);
  }, []);

  const onLeave = useCallback(() => {
    const fade = () => {
      if (intRef.current > 0) { intRef.current = Math.max(intRef.current - .018, 0); setTimeout(fade, 30); }
    };
    fade();
  }, []);

  return (
    <section ref={sref} className="sc" style={{ padding: 0, background: "#04010b" }}>
      <canvas ref={canvRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", touchAction: "none", cursor: "crosshair", zIndex: 2 }}
        onClick={onTap} onMouseMove={onMov} onMouseLeave={onLeave}
        onTouchStart={onTap} onTouchMove={e => { e.preventDefault(); const cv = canvRef.current; if (!cv) return; const { x, y } = evXY(e, cv); ptRef.current = { x: x / cv.width, y: y / cv.height }; if (intRef.current > .01) intRef.current = Math.min(intRef.current + .01, 1); }}
        onTouchEnd={onLeave}
      />
      <div style={{ position: "absolute", bottom: "9%", left: 0, right: 0, textAlign: "center", zIndex: 5, padding: "0 2rem", pointerEvents: "none" }}>
        <p className="eyebrow">chapter nine</p>
        <p className="title" style={{ fontSize: "clamp(1.1rem,4vw,1.8rem)", marginBottom: ".4rem" }}>
          {touched ? <em>A literal nightmare.</em> : "Touch to multiply the problem"}
        </p>
        <p className="prose">
          {touched ? `"Imagine a billion of you... my wallet is crying."` : "Tap and move — her portrait multiplies into infinity"}
        </p>
      </div>
      <div className="hint" style={{ zIndex: 6 }}><p>scroll</p><div className="line" /></div>
    </section>
  );
}

/* ============================================================
   CHAPTER 10 — PROMISE WHEEL
   Physics-based spinner. Lands on real promises.
   ============================================================ */
function C10({ sref }) {
  const canvRef = useRef(), afRef = useRef();
  const angRef = useRef(0), velRef = useRef(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [spins, setSpins] = useState(0);

  const PROMISES = [
    { t: "You accept my proposal", c: "#b8936a" },
    { t: "We go on a real date", c: "#a8687a" },
    { t: "No more 'online friends' talk", c: "#8c9aaa" },
    { t: "You admit I'm not just a kiddo", c: "#9a7860" },
    { t: "A walk in the park", c: "#b8936a" },
    { t: "You stop rejecting me", c: "#a8687a" },
    { t: "We hit off well", c: "#8c9aaa" },
    { t: "Spin again, madam", c: "#9a7860" },
  ];

  const draw = useCallback((angle = 0) => {
    const cv = canvRef.current; if (!cv) return;
    const ctx = cv.getContext("2d"), W = cv.width, H = cv.height, cx = W / 2, cy = H / 2, r = cx - 8;
    ctx.clearRect(0, 0, W, H);
    PROMISES.forEach((p, i) => {
      const a1 = angle + (i / PROMISES.length) * TAU, a2 = angle + ((i + 1) / PROMISES.length) * TAU, mid = (a1 + a2) / 2;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, a1, a2); ctx.closePath();
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, p.c + "18"); g.addColorStop(1, p.c + "40");
      ctx.fillStyle = g; ctx.fill();
      ctx.strokeStyle = "rgba(237,232,224,.07)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(mid);
      ctx.textAlign = "right";
      ctx.font = `300 ${Math.floor(W * .038)}px 'Cormorant Garamond',Georgia,serif`;
      ctx.fillStyle = "rgba(237,232,224,.82)";
      ctx.fillText(p.t.slice(0, 22), r - 10, 4);
      ctx.restore();
    });
    // hub
    ctx.beginPath(); ctx.arc(cx, cy, 16, 0, TAU); ctx.fillStyle = "rgba(184,147,106,.15)"; ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy, 8, 0, TAU); ctx.fillStyle = "#b8936a"; ctx.fill();
    // pointer
    ctx.fillStyle = "#b8936a";
    ctx.beginPath(); ctx.moveTo(cx + r + 10, cy); ctx.lineTo(cx + r - 8, cy - 7); ctx.lineTo(cx + r - 8, cy + 7); ctx.closePath(); ctx.fill();
  }, []);

  useEffect(() => {
    const cv = canvRef.current; if (!cv) return;
    const resize = () => { const s = Math.min(cv.offsetWidth, 265); cv.width = s; cv.height = s; draw(angRef.current); };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv);
    return () => ro.disconnect();
  }, [draw]);

  const spin = () => {
    if (spinning) return;
    setSpinning(true); setResult(null);
    velRef.current = rnd(.18, .5);
    const decel = rnd(.003, .007);
    const go = () => {
      velRef.current -= decel;
      if (velRef.current <= 0) {
        velRef.current = 0; setSpinning(false); setSpins(s => s + 1);
        const norm = ((angRef.current % TAU) + TAU) % TAU;
        const idx = Math.floor((TAU - norm) / TAU * PROMISES.length) % PROMISES.length;
        const res = PROMISES[(idx + PROMISES.length) % PROMISES.length];
        setResult(res);
        scatter(window.innerWidth / 2, window.innerHeight * .42, res.c, 18);
        return;
      }
      angRef.current += velRef.current; draw(angRef.current);
      afRef.current = requestAnimationFrame(go);
    };
    afRef.current = requestAnimationFrame(go);
  };

  return (
    <section ref={sref} className="sc" style={{ background: "linear-gradient(160deg,#0d0320,#06010c)" }}>
      <Dust n={26} />
      <div style={{ position: "relative", zIndex: 5, textAlign: "center" }}>
        <p className="eyebrow">chapter eight</p>
        <p className="title" style={{ marginBottom: ".5rem", fontSize: "clamp(1.2rem,4vw,2rem)" }}>
          {result ? <em style={{ color: result.c }}>{result.t}</em> : "Spin for a real date promise"}
        </p>
        <p className="prose" style={{ marginBottom: "1.4rem", margin: "0 auto 1.4rem" }}>
          {result ? `"I am definitely rigging this wheel later."` : "Every landing is something I intend to do"}
        </p>
        <canvas ref={canvRef} style={{ width: 260, height: 260, display: "block", margin: "0 auto 1.4rem" }} />
        <button className="btn" onClick={spin} disabled={spinning}>
          {spinning ? "—" : spins > 0 ? "spin again" : "spin"}
        </button>
      </div>
      <div className="hint"><p>scroll</p><div className="line" /></div>
    </section>
  );
}

/* ============================================================
   CHAPTER 11 — TYPEWRITER POEM
   ============================================================ */
function C11({ sref }) {
  const ref = useRef(); const inView = useInView(ref, .25);
  const POEM = [
    { t: "Look, I know I am younger,", c: "#b8936a" },
    { t: "And you just want to be 'free',", c: "#ede8e0" },
    { t: "But I am not giving up easily,", c: "#a8687a" },
    { t: "Because I see something special.", c: "#8c9aaa" },
    { t: "You might friend-zone me every day,", c: "#b8936a" },
    { t: "But I still want to earn your liking.", c: "#ede8e0" },
    { t: "So stop calling me a kiddo,", c: "#a8687a" },
    { t: "Take a chance on this software engineer,", c: "#8c9aaa" },
    { t: "And let's go on a proper date.", c: "#b8936a" },
    { t: "Because I really value you.", c: "#f0e8dc" },
  ];
  const [li, setLi] = useState(-1), [ci, setCi] = useState(0), [typed, setTyped] = useState([]);

  useEffect(() => { if (inView) setTimeout(() => setLi(0), 500); }, [inView]);
  useEffect(() => {
    if (li < 0 || li >= POEM.length) return;
    const line = POEM[li].t;
    if (ci < line.length) { const t = setTimeout(() => setCi(c => c + 1), 36); return () => clearTimeout(t); }
    else { const t = setTimeout(() => { setTyped(p => [...p, POEM[li]]); setCi(0); setLi(l => l + 1); }, 700); return () => clearTimeout(t); }
  }, [li, ci]);

  return (
    <section ref={sref} className="sc" style={{ background: "linear-gradient(160deg,#0a0318,#060108,#0a0318)" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${PHOTOS[5]})`, backgroundSize: "cover", backgroundPosition: "center", opacity: .05, filter: "blur(8px)" }} />
      <Dust n={20} />
      <div ref={ref} style={{ position: "relative", zIndex: 5, maxWidth: 355, padding: "0 .5rem" }}>
        <p className="eyebrow" style={{ textAlign: "center" }}>chapter eleven</p>
        <p className="title" style={{ marginBottom: "1.8rem", fontSize: "clamp(1.1rem,4vw,1.6rem)" }}>Written only for you</p>
        <div style={{ minHeight: 280, textAlign: "left" }}>
          {typed.map((l, i) => (
            <p key={i} style={{ fontFamily: "var(--f4)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(.87rem,2.8vw,1.02rem)", lineHeight: 2.2, color: l.c, marginBottom: ".05rem", textShadow: `0 0 14px ${l.c}28` }}>
              {l.t}
            </p>
          ))}
          {li >= 0 && li < POEM.length && (
            <p style={{ fontFamily: "var(--f4)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(.87rem,2.8vw,1.02rem)", lineHeight: 2.2, color: POEM[li].c }}>
              {POEM[li].t.slice(0, ci)}
              <span style={{ animation: "_breathe .9s ease-in-out infinite", display: "inline-block", opacity: .6 }}>|</span>
            </p>
          )}
        </div>
      </div>
      <div className="hint"><p>scroll</p><div className="line" /></div>
    </section>
  );
}

/* ============================================================
   CHAPTER 12 — NAME GALAXY
   Her name floats in golden script. Orbiting particles.
   Every tap spawns more. Portrait glows behind.
   ============================================================ */
function C12({ sref }) {
  const ref = useRef(); const inView = useInView(ref, .25);
  const canvRef = useRef(), afRef = useRef();
  const ptsRef = useRef([]);
  const [show, setShow] = useState(false), [sub, setSub] = useState(false);

  useEffect(() => { if (inView) { setTimeout(() => setShow(true), 500); setTimeout(() => setSub(true), 2800); } }, [inView]);

  useEffect(() => {
    const cv = canvRef.current; if (!cv) return;
    const resize = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv);
    const draw = () => {
      const ctx = cv.getContext("2d"); ctx.clearRect(0, 0, cv.width, cv.height);
      const now = Date.now();
      ptsRef.current = ptsRef.current.filter(p => now - p.born < p.life);
      ptsRef.current.forEach(p => {
        const age = (now - p.born) / p.life;
        p.x += p.vx * (1 - age * .4); p.y += p.vy * (1 - age * .4) - .15;
        ctx.globalAlpha = (1 - age) * .75; ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 - age * .4), 0, TAU); ctx.fill();
      });
      ctx.globalAlpha = 1;
      afRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(afRef.current); ro.disconnect(); };
  }, []);

  const addPts = useCallback((cx, cy) => {
    const COLS = ["#b8936a", "#a8687a", "#8c9aaa", "#ede8e0", "#c9a96e"];
    for (let i = 0; i < 20; i++) {
      const a = rnd(0, TAU), spd = rnd(.3, 1.6);
      ptsRef.current.push({
        x: cx, y: cy, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
        c: COLS[i % COLS.length], r: rnd(1, 4), life: rnd(1100, 2600), born: Date.now()
      });
    }
  }, []);

  const onTap = useCallback(e => {
    const cv = canvRef.current; if (!cv) return;
    const r = cv.getBoundingClientRect();
    const cx = e.touches?.[0]?.clientX ?? e.clientX, cy = e.touches?.[0]?.clientY ?? e.clientY;
    addPts(cx - r.left, cy - r.top);
    scatter(cx, cy, "#b8936a", 8);
  }, [addPts]);

  const ORBS = useMemo(() => Array.from({ length: 14 }, (_, i) => ({
    r: 60 + (i % 3) * 30, spd: 9 + rnd(0, 11), del: rnd(0, 5),
    os: rnd(0, 360), sz: rnd(2, 5),
    c: ["#b8936a", "#a8687a", "#8c9aaa"][i % 3], rev: i % 2 === 0,
  })), []);

  return (
    <section ref={sref} className="sc"
      style={{ background: "radial-gradient(ellipse at 50% 50%,#1a0820 0%,#060108 65%)" }}
      onClick={onTap} onTouchStart={onTap}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${PHOTOS[5]})`, backgroundSize: "cover", backgroundPosition: "center top", opacity: .07, filter: "blur(3px)" }} />
      <Vignette strength={.92} />
      <canvas ref={canvRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }} />

      {/* orbital ring */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 3 }}>
        {ORBS.map((o, i) => (
          <div key={i} style={{
            position: "absolute", top: 0, left: 0, width: o.sz, height: o.sz, borderRadius: "50%",
            background: o.c, boxShadow: `0 0 ${o.sz * 2}px ${o.c}88`,
            animation: `_orbit ${o.spd}s linear ${o.del}s infinite`, animationDirection: o.rev ? "reverse" : "normal",
            "--os": o.os + "deg", "--or": (o.r / 2) + "px"
          }} />
        ))}
      </div>

      <div ref={ref} style={{ position: "relative", zIndex: 5, textAlign: "center" }}>
        <p className="eyebrow" style={{ marginBottom: "2rem" }}>chapter nine</p>
        <div style={{ fontFamily: "var(--f3)", fontSize: "clamp(3.2rem,13vw,6.5rem)", display: "flex", flexWrap: "wrap", justifyContent: "center", letterSpacing: ".04em" }}>
          {HER_NAME.split("").map((ch, i) => {
            const COLS = ["#b8936a", "#ede8e0", "#a8687a", "#8c9aaa", "#c9a96e"];
            const c = COLS[i % COLS.length];
            return (
              <span key={i} style={{
                display: "inline-block", color: c,
                opacity: show ? 1 : 0,
                transform: show ? "translateY(0) rotate(0deg)" : "translateY(24px) rotate(-6deg)",
                transition: `opacity .8s ${i * .1}s,transform .9s ${i * .1}s cubic-bezier(.34,1.56,.64,1)`,
                textShadow: `0 0 50px ${c}44`,
              }}>{ch === " " ? "\u00A0" : ch}</span>
            );
          })}
        </div>
        {sub && (
          <p className="prose" style={{ marginTop: "2rem", animation: "_fadeup .8s ease forwards" }}>
            Everyone sees the version of you that you let them see. But I see the quiet strength, the rare kindness, and the person you are when the world isn't watching. That's the person I'm choosing, against everything else.
          </p>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   CHAPTER 13 — BIRTHDAY FIREWORKS
   Touch fires particle fireworks. Text reveals over portrait wash.
   ============================================================ */
function C13({ sref }) {
  const ref = useRef(); const inView = useInView(ref, .25);
  const canvRef = useRef(), afRef = useRef();
  const ptsRef = useRef([]);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!inView) return;
    [800, 2300, 4000, 5800, 8200].forEach((t, i) => setTimeout(() => setPhase(i + 1), t));
    [2000, 3400, 5000, 6800, 8800].forEach(t => setTimeout(() => fireAt(rnd(80, window.innerWidth - 80), rnd(60, window.innerHeight * .5)), t));
  }, [inView]);

  useEffect(() => {
    const cv = canvRef.current; if (!cv) return;
    const resize = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv);
    const draw = () => {
      const ctx = cv.getContext("2d");
      ctx.fillStyle = "rgba(6,2,9,.15)"; ctx.fillRect(0, 0, cv.width, cv.height);
      const now = Date.now();
      ptsRef.current = ptsRef.current.filter(p => now - p.born < p.life);
      ptsRef.current.forEach(p => {
        const age = (now - p.born) / p.life;
        p.x += p.vx * (1 - age * .5); p.y += p.vy + .07 * age;
        ctx.globalAlpha = (1 - age) * .9; ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 - age * .5), 0, TAU); ctx.fill();
      });
      ctx.globalAlpha = 1; afRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(afRef.current); ro.disconnect(); };
  }, []);

  const COLS = ["#b8936a", "#a8687a", "#8c9aaa", "#ede8e0", "#c9b87a", "#9a8058"];
  function fireAt(x, y) {
    const base = COLS[Math.floor(Math.random() * COLS.length)];
    for (let i = 0; i < 52; i++) {
      const a = rnd(0, TAU), spd = rnd(1.5, 6.5);
      ptsRef.current.push({
        x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd - rnd(.5, 2.5),
        c: Math.random() > .35 ? base : "rgba(255,255,255,.8)", r: rnd(1.5, 5), life: rnd(900, 2100), born: Date.now()
      });
    }
  }

  const onTap = useCallback(e => {
    e.preventDefault();
    const cv = canvRef.current; if (!cv) return;
    const { x, y } = evXY(e, cv); fireAt(x, y);
    const r = cv.getBoundingClientRect();
    scatter(r.left + x, r.top + y, "#b8936a", 7);
  }, []);

  const p = clamp(phase / 5, 0, 1);
  const LINES = [
    "Another day of me trying to get you to say yes.",
    "Age is just a number, remember?",
    "Stop pushing me away.",
    "I'm not doing this just as a coping mechanism.",
    "You are someone I don't want to lose.",
  ];
  const LC = ["#b8936a", "#ede8e0", "#a8687a", "#8c9aaa", "#c9b87a"];

  return (
    <section ref={sref} className="sc" style={{ padding: 0, overflow: "hidden" }}>
      <div ref={ref} style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(to top,rgba(${Math.round(lerp(6, 140, p))},${Math.round(lerp(2, 40, p))},${Math.round(lerp(9, 6, p))},1) 0%,rgba(6,2,9,1) 55%)`,
        transition: "background 2.5s"
      }} />

      {/* photo strip */}
      {phase >= 3 && (
        <div style={{ position: "absolute", top: "5%", left: 0, right: 0, display: "flex", justifyContent: "center", gap: 8, zIndex: 3, padding: "0 1rem", pointerEvents: "none", animation: "_fadeup 1s ease forwards" }}>
          {PHOTOS.slice(0, 4).map((src, i) => (
            <div key={i} style={{ width: 54, height: 70, borderRadius: 3, overflow: "hidden", border: "1px solid rgba(184,147,106,.18)", boxShadow: "0 4px 18px rgba(0,0,0,.55)", opacity: .72, flexShrink: 0, transform: `rotate(${rnd(-3, 3)}deg)` }}>
              <img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
            </div>
          ))}
        </div>
      )}

      <canvas ref={canvRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", touchAction: "none", cursor: "crosshair", zIndex: 2 }}
        onClick={onTap} onTouchStart={e => { e.preventDefault(); onTap(e); }} />

      <div style={{ position: "relative", zIndex: 5, textAlign: "center", padding: "2rem 1.5rem", pointerEvents: "none", marginTop: phase >= 3 ? "5rem" : "0" }}>
        <p className="eyebrow" style={{ marginBottom: "1.8rem" }}>chapter ten</p>
        <div style={{ minHeight: "10rem" }}>
          {LINES.map((l, i) => (
            <p key={i} style={{
              fontFamily: "var(--f4)", fontStyle: "italic", fontWeight: 300,
              fontSize: "clamp(.9rem,3.5vw,1.12rem)", lineHeight: 2.2,
              color: phase >= i + 1 ? LC[i] : "transparent", transition: "color 1.6s ease", transitionDelay: (i * .18) + "s",
              textShadow: "0 0 20px rgba(0,0,0,.9)"
            }}>
              {l}
            </p>
          ))}
        </div>
        {phase >= 5 && (
          <div style={{ animation: "_fadeup 1.2s ease forwards", marginTop: "1rem" }}>
            <p style={{
              fontFamily: "var(--f3)", fontSize: "clamp(3rem,11vw,5.5rem)", color: "#b8936a",
              animation: "_glow 3.5s ease-in-out infinite", "--gc": "#b8936a",
              textShadow: "0 0 40px rgba(184,147,106,.4),0 0 90px rgba(184,147,106,.2)"
            }}>
              "Say Yes?"
            </p>
          </div>
        )}
        <p style={{ fontFamily: "var(--f2)", fontSize: ".4rem", letterSpacing: ".35em", opacity: .28, marginTop: "1.5rem", pointerEvents: "auto" }}>
          touch to launch
        </p>
      </div>
    </section>
  );
}

/* ============================================================
   CHAPTER 14 — CLOSING LETTER
   Orbiting portrait. Lines fade in. Letter unseals.
   ============================================================ */
function C14({ sref }) {
  const ref = useRef(); const inView = useInView(ref, .18);
  const [lp, setLp] = useState(0), [open, setOpen] = useState(false), [show, setShow] = useState(false);
  const CLOSING = [
    ["There is a rarity in you that most people will never have the patience to find.", "#b8936a"],
    ["I found it. And I am never letting go of the truth of who you are.", "#ede8e0"],
    ["The world can have its opinions on age and distance. They don't matter.", "#a8687a"],
    ["What matters is that you've become the only place that feels like home.", "#8c9aaa"],
  ];
  const ORBS = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    r: 50 + (i % 3) * 22, spd: 10 + i * 1.5, del: i * .4, os: i * 36, sz: 2 + (i % 2),
    c: ["#b8936a", "#a8687a", "#8c9aaa"][i % 3], rev: i % 2 === 0,
  })), []);

  useEffect(() => {
    if (!inView) return;
    CLOSING.forEach((_, i) => setTimeout(() => setLp(l => l + 1), 400 + i * 1900));
    setTimeout(() => setShow(true), 400 + CLOSING.length * 1900 + 300);
  }, [inView]);

  const PARAS = [
    "Life doesn't often give us something this real. Usually, people are just passing through, looking for a distraction or a way to fill the silence. But with you, the silence is where I finally found myself.",
    "I know you're independent for a reason. I know you've built walls because you've had to. I'm not here to tear them down—I'm here to build a world with you that makes those walls unnecessary.",
    "Choosing you isn't a romantic whim. It's the most mature decision I've ever made. It's a recognition of the fact that a soul like yours doesn't come around twice.",
    "So don't be afraid of the 'what ifs'. Don't let the noise of the world drown out the certainty of what we have. I am here. I am certain. And I am yours, completely.",
    "This isn't just a website, Vinaya. It's a promise that I see you, I value you, and I am ready for everything that comes next. - Soorya",
  ];

  return (
    <section ref={sref} className="sc"
      style={{ background: "radial-gradient(ellipse at 50% 30%,#1a0620 0%,#060108 65%)", minHeight: "100svh", justifyContent: "flex-start", paddingTop: "8svh" }}>
      <Dust n={32} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${PHOTOS[2]})`, backgroundSize: "cover", backgroundPosition: "center", opacity: .04, filter: "blur(7px)" }} />
      <Vignette strength={.96} />

      {/* portrait orbitals */}
      <div style={{ position: "relative", width: 150, height: 130, margin: "0 auto 2rem", flexShrink: 0 }}>
        {ORBS.map((o, i) => (
          <div key={i} style={{
            position: "absolute", top: "50%", left: "50%", width: o.sz, height: o.sz, borderRadius: "50%",
            background: o.c, boxShadow: `0 0 ${o.sz * 3}px ${o.c}88`,
            animation: `_orbit ${o.spd}s linear ${o.del}s infinite`, animationDirection: o.rev ? "reverse" : "normal",
            "--os": o.os + "deg", "--or": (o.r / 2) + "px"
          }} />
        ))}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: 70, height: 70, borderRadius: "50%", overflow: "hidden",
          border: "1px solid rgba(184,147,106,.25)", boxShadow: "0 0 30px rgba(184,147,106,.12)"
        }}>
          <img src={PHOTOS[0]} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
        </div>
      </div>

      <div ref={ref} style={{ position: "relative", zIndex: 5, textAlign: "center", maxWidth: 335 }}>
        <p className="eyebrow" style={{ marginBottom: "1.5rem" }}>chapter thirteen</p>
        {CLOSING.map(([l, c], i) => (
          <p key={i} style={{
            fontFamily: "var(--f4)", fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(.95rem,3.8vw,1.15rem)", lineHeight: 2.3,
            color: lp > i ? c : "transparent", transition: "color 1.6s ease",
            textShadow: lp > i ? `0 0 18px ${c}28` : "none"
          }}>
            {l}
          </p>
        ))}

        {show && !open && (
          <button className="btn" style={{ marginTop: "2.5rem", animation: "_fadeup .8s ease forwards" }}
            onClick={() => { scatter(window.innerWidth / 2, window.innerHeight * .72, "#b8936a", 14); setOpen(true); }}>
            The heart of the matter
          </button>
        )}

        {open && (
          <div className="letter-wrap" style={{ marginTop: "2.5rem", animation: "_fadeup .8s ease forwards" }}>
            {PARAS.map((p, i) => (
              <p key={i} className="letter-line" style={{ animation: `_fadeup .8s ${i * .18}s ease both`, opacity: 0 }}>
                {p}
              </p>
            ))}
            <p style={{
              fontFamily: "var(--f3)", fontSize: "1.5rem", color: "#b8936a", marginTop: ".8rem",
              animation: "_fadeup .8s 1.1s ease both", opacity: 0,
              textShadow: "0 0 18px rgba(184,147,106,.28)"
            }}>
              — with love, always
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   CHAPTER 14 — DRAWABLE KALEIDOSCOPE
   ============================================================ */
function CDrawKaleido({ sref }) {
  const canvRef = useRef();
  const offRef = useRef();
  const painting = useRef(false);
  const lastPt = useRef(null);
  const [hue, setHue] = useState(0);
  const [hasDrawn, setHasDrawn] = useState(false);
  const SEGS = 12;

  useEffect(() => {
    offRef.current = document.createElement("canvas");
    const cv = canvRef.current; if (!cv) return;
    let af;
    const resize = () => {
      cv.width = cv.offsetWidth; cv.height = cv.offsetHeight;
      offRef.current.width = cv.width; offRef.current.height = cv.height;
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv);

    const draw = () => {
      const ctx = cv.getContext("2d");
      const W = cv.width, H = cv.height;
      ctx.fillStyle = "rgba(6,2,9,0.05)";
      ctx.fillRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      for (let i = 0; i < SEGS; i++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((i * Math.PI * 2) / SEGS);
        if (i % 2 === 1) ctx.scale(1, -1);
        ctx.drawImage(offRef.current, -cx, -cy);
        ctx.restore();
      }
      af = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(af); ro.disconnect(); };
  }, []);

  const drawLine = (x1, y1, x2, y2) => {
    const off = offRef.current; if (!off) return;
    const ctx = off.getContext("2d");
    ctx.strokeStyle = `hsl(${hue}, 80%, 65%)`;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  const onDown = (e) => {
    e.preventDefault();
    painting.current = true;
    const { x, y } = evXY(e, canvRef.current);
    lastPt.current = { x, y };
  };
  const onMove = (e) => {
    if (!painting.current) return;
    e.preventDefault();
    if (!hasDrawn) setHasDrawn(true);
    const { x, y } = evXY(e, canvRef.current);
    drawLine(lastPt.current.x, lastPt.current.y, x, y);
    lastPt.current = { x, y };
    setHue(h => (h + 3) % 360);
  };
  const onUp = () => { painting.current = false; };

  return (
    <section ref={sref} className="sc" style={{ background: "#0a0410", padding: 0 }}>
      {hasDrawn ? null : (
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          color: "var(--gold)", opacity: 0.8, pointerEvents: "none", zIndex: 3,
          animation: "_breathe 2s infinite ease-in-out", textAlign: "center",
          textShadow: "0 2px 10px #000"
        }}>
          <div style={{ fontSize: "3rem", animation: "_float 2s infinite ease-in-out" }}>👆</div>
          <p className="prose" style={{ margin: "0.5rem 0 0 0" }}>Drag around to draw!</p>
        </div>
      )}
      <canvas ref={canvRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", touchAction: "none", cursor: "crosshair", zIndex: 2 }}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp} />
      <div style={{ position: "absolute", bottom: "8%", left: 0, right: 0, textAlign: "center", zIndex: 5, pointerEvents: "none", opacity: hasDrawn ? 0 : 1, transition: "opacity 1s" }}>
        <p className="eyebrow" style={{ textShadow: "0 2px 10px #000" }}>chapter eleven</p>
        <p className="title" style={{ textShadow: "0 2px 10px #000" }}>Draw our universe</p>
        <p className="prose" style={{ textShadow: "0 2px 10px #000" }}>Touch and move to paint</p>
      </div>
    </section>
  );
}

/* ============================================================
   CHAPTER 15 — JOKES
   ============================================================ */
function CJokes({ sref }) {
  const [idx, setIdx] = useState(0);
  const [showPunch, setShowPunch] = useState(false);
  const JOKES = [
    { q: "Are you a magician?", a: "Because whenever I look at you, the 6 year age gap disappears." },
    { q: "Do you have a map?", a: "Because I keep getting lost trying to get out of the friendzone." },
    { q: "Are you my age limit?", a: "Because you keep turning me off and I want to connect." },
    { q: "Is your name Google?", a: "Because you have everything I’m searching for in an 'online friend'." },
    { q: "Are you a parking ticket?", a: "Because you've got FINE written all over you." },
  ];

  const nextJoke = () => {
    if (showPunch) {
      setIdx((idx + 1) % JOKES.length);
      setShowPunch(false);
    } else {
      setShowPunch(true);
    }
  };

  return (
    <section ref={sref} className="sc" style={{ background: "#110818", textAlign: "center" }}>
      <Dust n={15} />
      <div style={{ position: "relative", zIndex: 5, maxWidth: 380, width: "100%" }}>
        <p className="eyebrow">chapter twelve</p>
        <p className="title" style={{ marginBottom: "2rem" }}>Because we're deeply unserious</p>

        <div onClick={nextJoke} style={{ background: "rgba(184,147,106,0.08)", padding: "2rem", borderRadius: "12px", cursor: "pointer", minHeight: 200, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontFamily: "var(--f1)", fontSize: "1.4rem", color: "var(--cream)", marginBottom: showPunch ? "1rem" : "0", transition: "all .3s" }}>
            {JOKES[idx].q}
          </p>
          {showPunch && (
            <p style={{ fontFamily: "var(--f3)", fontSize: "2.2rem", color: "var(--gold)", animation: "_fadeup 0.5s ease both" }}>
              {JOKES[idx].a}
            </p>
          )}
        </div>
        <p className="label" style={{ marginTop: "2rem" }}>Tap to continue</p>
      </div>
    </section>
  );
}

/* ============================================================
   APP SHELL
   ============================================================ */
const CHAPTERS = [C1, C2, C3, C4, C5, C6, C7, C10, C12, C13, CDrawKaleido, CJokes, C14];

function Wrapper({ Sec, idx, onView, holder }) {
  const ref = useRef(null);
  holder.ref = ref;
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) onView(idx); },
      { threshold: 0.45 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [idx, onView]);
  return <Sec sref={ref} />;
}

export default function App() {
  const [cur, setCur] = useState(0);
  const holders = useMemo(() => CHAPTERS.map(() => ({ ref: null })), []);
  const onView = useCallback(i => setCur(i), []);

  return (
    <>
      <style>{STYLES}</style>
      <style>{`
        @keyframes _orbit {
          from { transform: rotate(var(--os)) translateX(var(--or)) rotate(calc(-1 * var(--os))); }
          to   { transform: rotate(calc(var(--os) + 360deg)) translateX(var(--or)) rotate(calc(-1 * (var(--os) + 360deg))); }
        }
      `}</style>
      <div className="app">
        <nav className="nav">
          {CHAPTERS.map((_, i) => (
            <div key={i}
              className={`nd${i === cur ? " on" : i < cur ? " done" : ""}`}
              onClick={() => holders[i].ref?.current?.scrollIntoView({ behavior: "smooth" })}
            />
          ))}
        </nav>
        {CHAPTERS.map((Sec, i) => (
          <Wrapper key={i} Sec={Sec} idx={i} onView={onView} holder={holders[i]} />
        ))}
      </div>
    </>
  );
}