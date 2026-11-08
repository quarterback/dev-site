// The project stack on projects.html. Drag the lime marker along the
// techniques and the stack re-sorts: projects that use that technique rise
// to the top and wire into it. Built with Dragology (Horowitz, Blinn and
// Heer, "Declarative Dragging," UIST 2026): each marker position is a state,
// and the library animates the whole drawing between states mid-drag.
// An ASCII field behind it drifts and brightens under the marker.
import { DraggableRenderer, translate } from "dragology";
import { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

const W = 1240;
const H = 640;
const LIME = "#d7ff3d";
const DIM = "#c9ccff";
const MONO = '"Plex Mono", ui-monospace, monospace';
const COND = '"Plex Cond", "Arial Narrow", sans-serif';

// Index 0 is "everything". The pairings match the map this replaces.
const TECH = [
  { id: "all", label: "all" },
  { id: "rate", label: "Rating models", tag: "rating" },
  { id: "sim", label: "Simulated worlds", tag: "simulation" },
  { id: "prob", label: "Probability engines", tag: "probability" },
  { id: "mech", label: "Mechanism design", tag: "mechanism" },
  { id: "match", label: "Matching", tag: "matching" },
  { id: "scen", label: "Scenario play", tag: "scenario" },
  { id: "meas", label: "Measurement", tag: "measurement" },
];
const PROJECTS = [
  { id: "cap", name: "Cap Buffet", href: "projects/draft-lab.html", uses: ["mech"] },
  { id: "ortn", name: "Oregon HS Tennis Power Rankings", href: "projects/oregon-tennis.html", uses: ["rate", "sim"] },
  { id: "occ", name: "Occupant Indices", href: "projects/occupant.html", uses: ["meas"] },
  { id: "mallo", name: "Mallo", href: "projects/mallo.html", uses: ["rate"] },
  { id: "ptc", name: "Play To Clinch", href: "projects/play-to-clinch.html", uses: ["rate", "sim"] },
  { id: "vb", name: "Viperball", href: "projects/viperball.html", uses: ["prob", "sim"] },
  { id: "si", name: "SuperInnings", href: "projects/super-innings.html", uses: ["prob", "sim"] },
  { id: "ygf", name: "You Go First", href: "projects/ygf.html", uses: ["match", "mech"] },
  { id: "pen", name: "Pensulo Cards", href: "https://dribbble.com/shots/3794375-Pensulo-Card-Deck", uses: ["scen"] },
];

// Technique sockets, laid out left to right in 14px mono (8.4px a character).
const CH = 8.4;
const SOCK_Y = 44;
const sockets = (() => {
  const texts = TECH.map((t) => `[ ${t.label} ]`);
  const widths = texts.map((s) => s.length * CH);
  const gap = (W - widths.reduce((a, b) => a + b, 0)) / (TECH.length - 1);
  let x = 0;
  return texts.map((text, i) => {
    const s = { text, x, w: widths[i] };
    x += widths[i] + gap;
    return s;
  });
})();

const ROOT_Y = 150;
const ROW0 = 200;
const ROW_H = 48;
const TAG_X = 800;

function order(lens) {
  if (lens === 0) return PROJECTS;
  const t = TECH[lens].id;
  return [...PROJECTS.filter((p) => p.uses.includes(t)), ...PROJECTS.filter((p) => !p.uses.includes(t))];
}

function tagX(p, techId) {
  let x = TAG_X;
  for (const u of p.uses) {
    if (u === techId) return x;
    x += (TECH.find((t) => t.id === u).tag.length + 3) * CH;
  }
  return x;
}

const STATES = TECH.map((_, i) => ({ lens: i }));

const stack = ({ state, d, setState }) => {
  const lens = state.lens;
  const active = TECH[lens].id;
  const rows = order(lens);
  const rowY = (p) => ROW0 + rows.indexOf(p) * ROW_H;
  const lastY = ROW0 + (rows.length - 1) * ROW_H;
  const s = sockets[lens];

  return (
    <g>
      {/* Click targets for each technique, under the marker */}
      {sockets.map((k, i) => (
        <g id={`hit-${TECH[i].id}`} transform={translate(k.x - 8, SOCK_Y - 22)} onClick={() => setState({ lens: i })} style={{ cursor: "pointer" }}>
          <rect width={k.w + 16} height={34} fill="rgba(0,0,0,0)" />
        </g>
      ))}

      {/* The marker: a lime block behind the chosen technique. Drag it. */}
      <g
        id="lens"
        transform={translate(s.x - 8, SOCK_Y - 22)}
        dragologyZIndex={1}
        dragologyOnDrag={() => d.between(STATES).withDropTransition("cubic-out")}
        style={{ cursor: "grab" }}
      >
        <rect width={s.w + 16} height={34} fill={LIME} />
        <rect transform={translate((s.w + 16) / 2 - 6, 34)} width={12} height={10} fill={LIME} />
      </g>

      {/* Labels sit on top but let the pointer through */}
      {sockets.map((k, i) => (
        <g id={`sock-${TECH[i].id}`} transform={translate(k.x, SOCK_Y)} dragologyZIndex={2} pointerEvents="none">
          <text fontFamily={MONO} fontSize={14} fontWeight={500} fill={i === lens ? "#1f2bff" : i === 0 ? DIM : LIME}>
            {k.text}
          </text>
        </g>
      ))}

      {/* Wires from the chosen socket down to each project that uses it */}
      {PROJECTS.flatMap((p) =>
        p.uses.map((u) => {
          const ti = TECH.findIndex((t) => t.id === u);
          const k = sockets[ti];
          const x1 = k.x + k.w / 2;
          const y1 = SOCK_Y + 24;
          const x2 = tagX(p, u) + 2;
          const y2 = rowY(p) - 18;
          const on = u === active;
          return (
            <path
              id={`w-${p.id}-${u}`}
              d={`M ${x1} ${y1} C ${x1} ${y1 + 90}, ${x2} ${y2 - 90}, ${x2} ${y2}`}
              fill="none"
              stroke={LIME}
              strokeWidth={1.5}
              strokeDasharray="1 6"
              strokeLinecap="round"
              opacity={on ? 0.9 : 0}
            />
          );
        }),
      )}

      {/* The stack, drawn like a dependency tree */}
      <g id="root" transform={translate(0, ROOT_Y)}>
        <text fontFamily={MONO} fontSize={15} fill={DIM}>
          ronbronson.dev/projects
        </text>
      </g>
      <path id="trunk" d={`M 8 ${ROOT_Y + 10} V ${lastY - 8}`} stroke={DIM} strokeOpacity={0.6} strokeWidth={1.5} />

      {PROJECTS.map((p) => {
        const on = lens === 0 || p.uses.includes(active);
        return (
          <g
            id={`row-${p.id}`}
            transform={translate(0, rowY(p))}
            opacity={on ? 1 : 0.28}
            onClick={() => (window.location.href = p.href)}
            style={{ cursor: "pointer" }}
          >
            <path d="M 8 -8 H 34" stroke={DIM} strokeOpacity={0.6} strokeWidth={1.5} />
            <text transform={translate(46, 0)} fontFamily={COND} fontWeight={700} fontSize={26} fill="#fff">
              {p.name}
            </text>
            <path
              d={`M ${54 + p.name.length * 12.2} -8 H ${TAG_X - 24}`}
              stroke={DIM}
              strokeOpacity={0.45}
              strokeWidth={1.5}
              strokeDasharray="1 7"
              strokeLinecap="round"
            />
            {p.uses.map((u) => (
              <text
                id={`t-${p.id}-${u}`}
                transform={translate(tagX(p, u), 0)}
                fontFamily={MONO}
                fontSize={14}
                fill={u === active ? LIME : DIM}
              >
                {TECH.find((t) => t.id === u).tag}
              </text>
            ))}
          </g>
        );
      })}
    </g>
  );
};

// ASCII field: characters drift on a slow wave and brighten under the marker.
function Field({ host }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    const ctx = cv.getContext("2d");
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const RAMP = " .·:-=+*";
    const CW = 14, LH = 20;
    let raf = 0, w = 0, h = 0, dpr = 1;
    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(cv);
    const draw = (t) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.font = `12px ${MONO}`;
      const lensEl = host.querySelector("#lens");
      const cr = cv.getBoundingClientRect();
      let lx = -1e4;
      if (lensEl) {
        const r = lensEl.getBoundingClientRect();
        lx = r.left + r.width / 2 - cr.left;
      }
      const s = t / 1000;
      for (let y = LH; y < h; y += LH) {
        for (let x = 0; x < w; x += CW) {
          const v = Math.sin(x * 0.011 + s * 0.7) * Math.cos(y * 0.017 - s * 0.5) + Math.sin((x + y) * 0.006 + s * 0.3);
          const near = Math.max(0, 1 - Math.abs(x - lx) / 140) * Math.max(0, 1 - y / h);
          const lvl = Math.max(0, Math.min(RAMP.length - 1, Math.floor((v + 2) / 4 * 5 + near * 4)));
          if (lvl === 0) continue;
          ctx.fillStyle = near > 0.15 ? `rgba(215,255,61,${0.12 + near * 0.35})` : `rgba(201,204,255,${0.06 + lvl * 0.02})`;
          ctx.fillText(RAMP[lvl], x, y);
        }
      }
      if (!still) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    let poke = null;
    if (still) {
      poke = () => requestAnimationFrame(draw);
      host.addEventListener("pointerup", poke);
      host.addEventListener("click", poke);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (poke) { host.removeEventListener("pointerup", poke); host.removeEventListener("click", poke); }
    };
  }, [host]);
  return <canvas ref={ref} className="sm__field" aria-hidden="true" />;
}

function StackMap({ host }) {
  const [lens, setLens] = useState(0);
  const [scale, setScale] = useState(1);
  const wrap = useRef(null);
  const state = useMemo(() => ({ lens }), [lens]);
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1, e.contentRect.width / W)));
    ro.observe(wrap.current);
    return () => ro.disconnect();
  }, []);
  const onKey = (e) => {
    if (e.key === "ArrowRight") setLens((l) => (l + 1) % TECH.length);
    else if (e.key === "ArrowLeft") setLens((l) => (l + TECH.length - 1) % TECH.length);
    else if (e.key === "Home") setLens(0);
    else return;
    e.preventDefault();
  };
  const t = TECH[lens];
  const live =
    lens === 0
      ? "Showing every project."
      : `${t.label}: ${order(lens).filter((p) => p.uses.includes(t.id)).map((p) => p.name).join(", ")}.`;
  return (
    <div
      className="sm__wrap"
      ref={wrap}
      style={{ height: H * scale }}
      tabIndex={0}
      role="group"
      aria-label="Project map. Use the left and right arrow keys to pick a technique."
      onKeyDown={onKey}
    >
      <Field host={host} />
      <div className="sm__stage" style={{ transform: `scale(${scale})` }} aria-hidden="true">
        <DraggableRenderer draggable={stack} state={state} onDropState={(s) => setLens(s.lens)} width={W} height={H} />
      </div>
      <p className="sm__live" aria-live="polite">{live}</p>
    </div>
  );
}

const host = document.getElementById("stack-map");
if (host && matchMedia("(min-width: 861px)").matches) {
  host.classList.add("sm--on");
  createRoot(host.querySelector(".sm__mount")).render(<StackMap host={host} />);
}
