// "Where the Hall's line falls" on projects.html (Under the hood).
// From Ron's post "How Do You Evaluate a (Baseball) Hall of Famer" and
// Michael Mountain's marginal threshold: rank every retired player at a
// position, count the Hall of Famers at that position, and draw the line
// under that many players. Career Index = JAWS / Hall standard x 100.
// Dragology (Horowitz, Blinn and Heer, "Declarative Dragging," UIST 2026)
// drives the Hall-size handle: each size is a state, and the lines blend
// between states mid-drag. WebGL draws the ~4,000 players behind it and
// recolors them against the lines as they move.
import { DraggableRenderer, translate } from "dragology";
import { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

const SIZES = [0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4];
const REAL = SIZES.indexOf(1);
const STATES = SIZES.map((_, i) => ({ s: i }));
const LO = 20, HI = 200; // Career Index range on the chart
const TRACK_H = 64, TOP = 92, BOT = 34;
const LABELS = ["John Olerud", "Lou Whitaker", "Bobby Grich", "Nomar Garciaparra", "Graig Nettles", "Pete Rose", "Barry Bonds", "Kenny Lofton", "Jim Edmonds", "Joe Jackson", "Rick Reuschel", "Roger Clemens", "Ted Simmons", "Thurman Munson", "Joe Nathan"];
const MONO = "var(--uth-mono)";
const KIND = { hof: "Hall of Famer", out: "Not in", nlg: "Negro Leagues inductee", mgr: "In as a manager or executive", ban: "Banned" };

// AP style: spell out numbers under 10.
const num = (n) => (n < 10 ? ["none", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"][n] : String(n));

function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return ((h >>> 0) % 1000) / 1000; }

function prep(data) {
  return data.map((lane) => {
    // Negro Leagues inductees are drawn, but they don't take a seat in the
    // ranking: their recorded major league stats are incomplete.
    const ranked = lane.players.filter((p) => p[2] !== "nlg");
    const seats = (k) => Math.max(1, Math.round(lane.n * SIZES[k]));
    const lineCI = (k) => { const i = seats(k) - 1; return (ranked[i][1] + (ranked[i + 1] ? ranked[i + 1][1] : ranked[i][1])) / 2; };
    return { ...lane, ranked, seats, lineCI };
  });
}

export function useSize(ref) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return w;
}

function geometry(W, H, lanes) {
  const L = W < 560 ? 30 : 46, R = 8;
  const lw = (W - L - R) / lanes.length;
  const y = (ci) => TOP + (1 - (Math.min(HI, Math.max(LO, ci)) - LO) / (HI - LO)) * (H - TOP - BOT);
  const x0 = (i) => L + i * lw;
  return { L, lw, y, x0, W, H };
}

function makeChart(lanes, g) {
  const tx = (k) => g.L + (k / (SIZES.length - 1)) * (g.W - g.L - 8);
  return ({ state, d, setState }) => {
    const hx = tx(state.s);
    return (
      <g>
        {/* Hall-size track */}
        <g id="track" transform={translate(0, 0)}>
          <line x1={g.L} x2={g.W - 8} y1={30} y2={30} stroke="var(--uth-grid)" strokeWidth={2} />
          {SIZES.map((s, k) => (
            <g id={`tick-${k}`} transform={translate(tx(k), 30)} onClick={() => setState({ s: k })} style={{ cursor: "pointer" }}>
              <rect x={-14} y={-18} width={28} height={36} fill="rgba(0,0,0,0)" />
              <line y1={-6} y2={6} stroke={k === REAL ? "var(--uth-fg)" : "var(--uth-dim)"} strokeWidth={k === REAL ? 2 : 1} />
              {(g.W >= 560 || k % 2 === 0) && (
                <text y={24} textAnchor={k === 0 ? "start" : k === SIZES.length - 1 ? "end" : "middle"} x={k === 0 ? -4 : k === SIZES.length - 1 ? 4 : 0} fontSize={11} fontFamily={MONO} fill="var(--uth-dim)">{Math.round(s * 100)}%</text>
              )}
            </g>
          ))}
        </g>
        <g id="handle" transform={translate(hx, 30)} dragologyZIndex={3} dragologyOnDrag={() => d.between(STATES).withDropTransition("cubic-out")} style={{ cursor: "grab" }}>
          <rect x={-22} y={-22} width={44} height={44} fill="rgba(0,0,0,0)" />
          <rect x={-9} y={-11} width={18} height={22} fill="var(--uth-accent)" />
        </g>

        {/* Axis */}
        {[50, 100, 150, 200].map((v) => (
          <g id={`ax-${v}`} transform={translate(0, g.y(v))}>
            <line x1={g.L} x2={g.W - 8} stroke={v === 100 ? "var(--uth-dim)" : "var(--uth-grid)"} strokeDasharray={v === 100 ? "4 4" : undefined} />
            <text x={g.L - 6} y={4} textAnchor="end" fontSize={11} fontFamily={MONO} fill="var(--uth-dim)">{v}</text>
          </g>
        ))}

        {/* Lanes: position label and the line under the Nth player */}
        {lanes.map((lane, i) => {
          const ly = g.y(lane.lineCI(state.s));
          return (
            <g id={`lane-${lane.pos}`}>
              <text x={g.x0(i) + g.lw / 2} y={TOP - 12} textAnchor="middle" fontSize={g.W < 560 ? 11 : 13} fontWeight={600} fontFamily={MONO} fill="var(--uth-fg)">{lane.pos}</text>
              <g id={`line-${lane.pos}`} transform={translate(g.x0(i) + 3, ly)} data-line={lane.pos}>
                <rect width={g.lw - 6} height={2.5} y={-1.25} fill="var(--uth-accent)" />
              </g>
            </g>
          );
        })}
      </g>
    );
  };
}

// WebGL: one point per player. Colors are recomputed each frame against the
// line positions read from the SVG, so dots change as a line passes them.
function Field({ lanes, g, stateRef }) {
  const cv = useRef(null);
  const pts = useMemo(() => {
    const out = [];
    lanes.forEach((lane, i) => {
      for (const p of lane.players) {
        if (p[1] < LO) continue;
        const r = hash(p[0]);
        out.push({ i, ci: p[1], k: p[2], x: g.x0(i) + g.lw * (0.14 + 0.72 * r), y: g.y(p[1]) });
      }
    });
    return out;
  }, [lanes, g]);
  useEffect(() => {
    const c = cv.current;
    const gl = c.getContext("webgl", { premultipliedAlpha: true, antialias: true });
    if (!gl) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    c.width = Math.round(g.W * dpr); c.height = Math.round(g.H * dpr);
    const vs = "attribute vec2 p;attribute vec4 c;attribute float s;uniform vec2 r;uniform float d;varying vec4 vc;varying float ring;void main(){vc=c;ring=s<0.0?1.0:0.0;gl_PointSize=abs(s)*d;vec2 q=p/r*2.0-1.0;gl_Position=vec4(q.x,-q.y,0,1);}";
    const fs = "precision mediump float;varying vec4 vc;varying float ring;void main(){vec2 q=gl_PointCoord*2.0-1.0;float r=length(q);if(r>1.0)discard;if(ring>0.5&&r<0.55)discard;gl_FragColor=vec4(vc.rgb*vc.a,vc.a);}";
    const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; };
    const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr); gl.useProgram(pr);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const buf = gl.createBuffer();
    const A = (n) => gl.getAttribLocation(pr, n);
    const css = getComputedStyle(c);
    const col = (v) => { const t = document.createElement("i"); t.style.color = css.getPropertyValue(v).trim(); c.parentNode.appendChild(t); const m = getComputedStyle(t).color.match(/[\d.]+/g).map(Number); t.remove(); return [m[0] / 255, m[1] / 255, m[2] / 255]; };
    const FG = col("--uth-fg"), DIM = col("--uth-dim"), ACC = col("--uth-accent"), DOWN = col("--uth-down");
    const root = c.parentNode;
    let raf;
    const frame = () => {
      const box = root.getBoundingClientRect();
      const ly = lanes.map((lane) => { const e = root.querySelector(`[data-line="${lane.pos}"]`); if (!e) return g.y(lane.lineCI(stateRef.current)); const b = e.getBoundingClientRect(); return b.top + b.height / 2 - box.top; });
      const v = new Float32Array(pts.length * 7);
      pts.forEach((p, j) => {
        const above = p.y < ly[p.i];
        let c3 = DIM, a = 0.6, s = 4;
        if (p.k === "hof") { if (above) { c3 = FG; a = 0.9; s = 5; } else { c3 = DOWN; a = 1; s = 6; } }
        else if (p.k === "nlg") { c3 = FG; a = 0.8; s = -7; }
        else if (above) { c3 = ACC; a = 1; s = 6.5; }
        else if (p.k === "ban" || p.k === "mgr") { a = 0.55; }
        v.set([p.x, p.y, c3[0], c3[1], c3[2], a, s], j * 7);
      });
      gl.viewport(0, 0, c.width, c.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, v, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(A("p")); gl.vertexAttribPointer(A("p"), 2, gl.FLOAT, false, 28, 0);
      gl.enableVertexAttribArray(A("c")); gl.vertexAttribPointer(A("c"), 4, gl.FLOAT, false, 28, 8);
      gl.enableVertexAttribArray(A("s")); gl.vertexAttribPointer(A("s"), 1, gl.FLOAT, false, 28, 24);
      gl.uniform2f(gl.getUniformLocation(pr, "r"), g.W, g.H); gl.uniform1f(gl.getUniformLocation(pr, "d"), dpr);
      gl.drawArrays(gl.POINTS, 0, pts.length);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [pts, g]);
  return <canvas ref={cv} className="hl__gl" style={{ width: g.W, height: g.H }} aria-hidden="true" />;
}

// Names for a few players from the post, placed with HTML over the chart.
function Names({ lanes, g }) {
  if (g.lw < 90) return null;
  const out = [];
  lanes.forEach((lane, i) => {
    // Labels in one lane are pushed apart so they don't overlap.
    const ls = lane.players.filter((p) => LABELS.includes(p[0])).map((p) => ({ p, x: g.x0(i) + g.lw * (0.14 + 0.72 * hash(p[0])), y: g.y(p[1]) - 8 })).sort((a, b) => a.y - b.y);
    for (let k = 1; k < ls.length; k++) if (ls[k].y - ls[k - 1].y < 14) ls[k].y = ls[k - 1].y + 14;
    for (const l of ls) out.push(<span className="hl__nm" style={{ left: l.x + 6, top: l.y }}>{l.p[0].split(" ").slice(-1)[0]}</span>);
  });
  return <>{out}</>;
}

function List({ lanes, size, pick, setPick }) {
  const lane = lanes[pick];
  const N = lane.seats(size);
  const ranked = lane.ranked;
  const from = Math.max(0, N - 7), to = Math.min(ranked.length, N + 7);
  const outAbove = ranked.slice(0, N).filter((p) => p[2] !== "hof");
  const inBelow = ranked.slice(N).filter((p) => p[2] === "hof");
  return (
    <div className="hl__list">
      <div className="yrs" role="group" aria-label="Position">
        {lanes.map((l, i) => <button type="button" className="ghost" aria-pressed={i === pick} onClick={() => setPick(i)}>{l.pos}</button>)}
      </div>
      <p className="hl__sum" aria-live="polite">
        {size === REAL ? `The Hall has ${lane.n} players at ${lane.pos}. ` : `With ${N} seats at ${lane.pos} instead of ${lane.n}: `}
        {`Above the line, ${num(outAbove.length)} ${outAbove.length === 1 ? "isn't" : "aren't"} in. Below it, ${num(inBelow.length)} ${inBelow.length === 1 ? "is" : "are"}.`}
      </p>
      <ol className="hl__rank" start={from + 1}>
        {ranked.slice(from, to).map((p, j) => (
          <li className={`k-${p[2]} ${from + j === N - 1 ? "is-last" : ""}`}>
            <span className="r">{from + j + 1}</span><span className="n">{p[0]}</span><span className="v">{Math.round(p[1])}</span><span className="t">{KIND[p[2]]}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function HallLine({ data }) {
  const lanes = useMemo(() => prep(data), [data]);
  const wrap = useRef(null);
  const W = useSize(wrap);
  const [size, setSize] = useState(REAL);
  const [pick, setPick] = useState(lanes.findIndex((l) => l.pos === "SS"));
  const stateRef = useRef(REAL);
  stateRef.current = size;
  const H = W < 560 ? 520 : 600;
  const g = useMemo(() => (W ? geometry(W, H, lanes) : null), [W, H, lanes]);
  const chart = useMemo(() => (g ? makeChart(lanes, g) : null), [g, lanes]);
  const onKey = (e) => {
    if (e.key === "ArrowRight") setSize((s) => Math.min(SIZES.length - 1, s + 1));
    else if (e.key === "ArrowLeft") setSize((s) => Math.max(0, s - 1));
    else if (e.key === "Home") setSize(REAL);
    else return;
    e.preventDefault();
  };
  return (
    <>
      <div ref={wrap} className="hl__wrap" style={{ height: H }} tabIndex={0} role="group" aria-label="Hall of Fame size. Use the left and right arrow keys to change it." onKeyDown={onKey}>
        {g && <Field lanes={lanes} g={g} stateRef={stateRef} />}
        {g && <div className="hl__svg"><DraggableRenderer draggable={chart} state={{ s: size }} onDropState={(s) => setSize(s.s)} width={W} height={H} /></div>}
        {g && <Names lanes={lanes} g={g} />}
      </div>
      <p className="cap">Hall size: {Math.round(SIZES[size] * 100)}% of today&rsquo;s. Drag the handle. Lime dots are players above the line who aren&rsquo;t in. Pink dots are Hall of Famers below it. Rings are Negro Leagues inductees, whose recorded stats are incomplete, so they don&rsquo;t take a seat.</p>
      <List lanes={lanes} size={size} pick={pick} setPick={setPick} />
    </>
  );
}

const mount = document.getElementById("hof-line");
if (mount) fetch(mount.dataset.src).then((r) => r.json()).then((data) => createRoot(mount).render(<HallLine data={data} />));
