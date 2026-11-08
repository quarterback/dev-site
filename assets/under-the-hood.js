/* Under the hood: small live models of the math inside Ron's projects.
   Each piece mounts only if its element is on the page and loads its data
   from assets/uth/. Colors come from CSS custom properties (--uth-*), so the
   same code follows the Projects room and the home page themes.
   Sources and checks: docs/aar-under-the-hood-2026-11-08.md. */
(() => {
const NS = "http://www.w3.org/2000/svg";
const el = (t, a = {}, p) => { const e = document.createElementNS(NS, t); for (const k in a) { const v = String(a[k]); if ((k === "fill" || k === "stroke") && v.startsWith("var(")) e.style[k] = v; else e.setAttribute(k, v); } if (p) p.appendChild(e); return e; };
const pct = (x) => (x * 100).toFixed(1) + "%";
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const DATA = { OR: "assets/uth/oregon-2026-boys.json", PTC: "assets/uth/ptc-points.json", O27: "assets/uth/o27-prospects.json", CAREERS: "assets/uth/ptc-careers.json" };
const load = (k) => fetch(DATA[k]).then((r) => r.json());

function oregon(OR) {
  const FL = ["S1","S2","S3","S4","D1","D2","D3","D4"];
  const REAL = { S1:1.00, S2:0.75, S3:0.25, S4:0.10, D1:1.00, D2:0.50, D3:0.25, D4:0.10 };
  let W = { ...REAL };
  const split = (s) => s.match(/../g) || [];
  const teams = OR.teams.map((t) => ({ ...t, ms: t.ms.map(([m, c, w]) => [m, split(c), split(w)]) }));
  function pi(t) {
    let tot = 0, n = 0;
    for (const [m, c, w] of t.ms) {
      let av = 0, pts = 0;
      for (const f of c) av += W[f];
      for (const f of w) pts += W[f];
      if (av > 0) { tot += (pts / av) * m; n++; }
    }
    const fqi = (tot + 2.5) / (n + 5);
    return 0.65 * t.apr + 0.25 * fqi + 0.10 * t.ogs;
  }
  const order = () => teams.map((t) => ({ t, v: pi(t) })).sort((a, b) => b.v - a.v);
  const base = new Map(); order().forEach((o, i) => base.set(o.t.n, i + 1));

  const svg = document.getElementById("orBars");
  const X0 = 40, BW = 46, GAP = 12, Y0 = 250, H = 210;
  const xs = (i) => X0 + i * (BW + GAP) + (i >= 4 ? 24 : 0);
  for (let v = 0; v <= 1.0001; v += 0.25) {
    el("line", { x1: 30, x2: 512, y1: Y0 - v * H, y2: Y0 - v * H, stroke: "var(--uth-grid)" }, svg);
    el("text", { x: 26, y: Y0 - v * H + 4, "text-anchor": "end", "font-size": 11, fill: "var(--uth-dim)" }, svg).textContent = v.toFixed(2);
  }
  el("text", { x: xs(0), y: 290, "font-size": 12, fill: "var(--uth-dim)" }, svg).textContent = "Singles";
  el("text", { x: xs(4), y: 290, "font-size": 12, fill: "var(--uth-dim)" }, svg).textContent = "Doubles";
  const bars = FL.map((f, i) => {
    const g = el("g", { class: "bar", tabindex: 0, role: "slider", "aria-label": f + " weight", "aria-valuemin": 0.05, "aria-valuemax": 1 }, svg);
    const ghost = el("rect", { x: xs(i), width: BW, fill: "none", stroke: "var(--uth-dim)", "stroke-dasharray": "3 3" }, g);
    const r = el("rect", { x: xs(i), width: BW, fill: "var(--uth-accent)" }, g);
    const hit = el("rect", { x: xs(i) - 4, y: Y0 - H - 10, width: BW + 8, height: H + 20, fill: "transparent" }, g);
    const lab = el("text", { x: xs(i) + BW / 2, y: Y0 + 18, "text-anchor": "middle", "font-size": 13, fill: "var(--uth-fg)" }, g); lab.textContent = f;
    const val = el("text", { x: xs(i) + BW / 2, "text-anchor": "middle", "font-size": 12, fill: "var(--uth-fg)" }, g);
    return { f, g, ghost, r, val };
  });
  function drawBars() {
    for (const b of bars) {
      const h = W[b.f] * H, gh = REAL[b.f] * H;
      b.r.setAttribute("y", Y0 - h); b.r.setAttribute("height", h);
      b.ghost.setAttribute("y", Y0 - gh); b.ghost.setAttribute("height", gh);
      b.val.setAttribute("y", Y0 - h - 6); b.val.textContent = W[b.f].toFixed(2);
      b.g.setAttribute("aria-valuenow", W[b.f].toFixed(2));
    }
  }
  const list = document.getElementById("orRank");
  const rows = new Map();
  function drawRank() {
    const o = order().slice(0, 12);
    list.innerHTML = "";
    o.forEach(({ t, v }, i) => {
      let li = rows.get(t.n);
      if (!li) { li = document.createElement("li"); rows.set(t.n, li); }
      const d = base.get(t.n) - (i + 1);
      li.innerHTML = `<span class="r">${i + 1}</span><span class="n">${t.n}</span><span class="pi">${v.toFixed(4)}</span><span class="d ${d > 0 ? "up" : d < 0 ? "dn" : ""}">${d > 0 ? "+" + d : d < 0 ? d : ""}</span>`;
      list.appendChild(li);
    });
  }
  let drag = null;
  function setFrom(e, b) {
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    W[b.f] = Math.round(Math.max(0.05, Math.min(1, (Y0 - p.y) / H)) * 20) / 20;
    drawBars(); drawRank();
  }
  bars.forEach((b) => {
    b.g.addEventListener("pointerdown", (e) => { drag = b; b.g.setPointerCapture(e.pointerId); setFrom(e, b); });
    b.g.addEventListener("pointermove", (e) => { if (drag === b) setFrom(e, b); });
    b.g.addEventListener("pointerup", () => (drag = null));
    b.g.addEventListener("keydown", (e) => {
      const s = e.key === "ArrowUp" ? 0.05 : e.key === "ArrowDown" ? -0.05 : 0;
      if (!s) return; e.preventDefault();
      W[b.f] = Math.round(Math.max(0.05, Math.min(1, W[b.f] + s)) * 20) / 20; drawBars(); drawRank();
    });
  });
  document.getElementById("orReset").onclick = () => { W = { ...REAL }; drawBars(); drawRank(); };
  drawBars(); drawRank();
}
if (document.getElementById("orBars")) load("OR").then(oregon);

function viper() {
  // Ported from engine/game_engine.py
  function place(d, k) {
    if (d > 65) return 0; if (d >= 59) return 0.001; if (d >= 55) return 0.003;
    const c = 30 + (k - 60) * 0.5;
    if (d <= 20) return 0.97;
    if (d <= c) return 0.95 - ((d - 20) / Math.max(1, c - 20)) * 0.10;
    if (d <= c + 8) return Math.max(0.15, 0.80 - (d - c) * 0.08);
    if (d <= 54) return Math.max(0.05, 0.15 - (d - c - 8) * 0.01);
    return 0.003;
  }
  function drop(d, k) {
    const c = 30 + (k - 60) * 0.75;
    if (d <= 15) return 0.98;
    if (d <= c) return 0.96 - ((d - 15) / Math.max(1, c - 15)) * 0.10;
    if (d <= c + 10) return Math.max(0.08, 0.80 - (d - c) * 0.06);
    if (d <= c + 15) return Math.max(0.05, 0.20 - (d - c - 10) * 0.02);
    return Math.max(0.03, 0.06 - (d - c - 15) * 0.01);
  }
  function decide(fp, down, ytg, k, trailing) {
    const d = 100 - fp + 10;
    const pk = d <= 54 ? place(d, k) : 0, dk = drop(d, k);
    if (fp >= 90) {
      if (down === 6 && ytg >= 8) { if (dk >= 0.40) return ["DROP KICK", "Inside the 10 on 6th and long: drop kick if it's 40% or better."]; if (pk >= 0.50) return ["PLACE KICK", "Inside the 10 on 6th and long: place kick if it's 50% or better."]; }
      return ["GO FOR IT", "Inside the 10 the coach drives for the 9-point touchdown."];
    }
    const comfort = 30 + (k - 60) * 0.75;
    let best = null, ev = 0;
    if (d <= comfort && dk >= 0.30) { best = "DROP KICK"; ev = dk * 5; }
    if (pk >= 0.20 && pk * 3 > ev) { best = "PLACE KICK"; ev = pk * 3; }
    if (down === 5) return ["GO FOR IT", "On 5th down the coach runs another play to set up a better 6th-down kick (no clock pressure)."];
    if (trailing) return best ? [best, "Trailing on 6th down: take the best kick."] : ["GO FOR IT", "Trailing and out of range: punting surrenders the game."];
    const go = Math.max(1, 3 - Math.floor((k - 75) / 10));
    if (ytg <= go) return ["GO FOR IT", `Short yardage: ${ytg} to go is within the ${go}-yard go zone for this kicker.`];
    if (best) return [best, best === "DROP KICK" ? "Drop kick has the higher expected points and is inside the kicker's comfort range." : "Place kick has the higher expected points."];
    if (fp < 65) return ["PUNT", "No makeable kick and deep in their own half: punt."];
    if (ytg <= 5) return ["GO FOR IT", "No makeable kick, short yardage, past midfield: go."];
    return ["PUNT", "No makeable kick and long yardage: punt."];
  }
  let fp = 72;
  const svg = document.getElementById("vbChart");
  const L = 44, R = 508, T = 16, B = 250, D0 = 10, D1 = 70;
  const xd = (d) => L + ((d - D0) / (D1 - D0)) * (R - L), yp = (p) => B - p * (B - T);
  for (let p = 0; p <= 1.001; p += 0.25) { el("line", { x1: L, x2: R, y1: yp(p), y2: yp(p), stroke: "var(--uth-grid)" }, svg); el("text", { x: L - 6, y: yp(p) + 4, "text-anchor": "end", "font-size": 11, fill: "var(--uth-dim)" }, svg).textContent = Math.round(p * 100) + "%"; }
  for (let d = 10; d <= 70; d += 10) el("text", { x: xd(d), y: B + 18, "text-anchor": "middle", "font-size": 11, fill: "var(--uth-dim)" }, svg).textContent = d;
  el("text", { x: (L + R) / 2, y: 292, "text-anchor": "middle", "font-size": 12, fill: "var(--uth-dim)" }, svg).textContent = "kick distance (yards)";
  const pPath = el("path", { fill: "none", stroke: "var(--uth-fg)", "stroke-width": 2.5 }, svg);
  const dPath = el("path", { fill: "none", stroke: "var(--uth-accent)", "stroke-width": 2.5 }, svg);
  const mark = el("g", { tabindex: 0, role: "slider", "aria-label": "Kick distance", style: "cursor: ew-resize" }, svg);
  el("rect", { x: -14, y: T, width: 28, height: B - T, fill: "transparent" }, mark);
  el("line", { x1: 0, x2: 0, y1: T, y2: B, stroke: "var(--uth-fg)", "stroke-dasharray": "4 4" }, mark);
  el("rect", { x: -26, y: B - 24, width: 52, height: 20, fill: "var(--uth-accent)" }, mark);
  const mt = el("text", { x: 0, y: B - 10, "text-anchor": "middle", "font-size": 12, fill: "var(--uth-on-accent)" }, mark);
  const $ = (id) => document.getElementById(id);
  function draw() {
    const k = +$("vbSkill").value, ytg = +$("vbYtg").value, down = +$("vbDown").value, tr = $("vbScore").value === "-1";
    $("vbSkillO").textContent = k; $("vbYtgO").textContent = ytg;
    let dp = "", pp = "";
    for (let d = D0; d <= D1; d += 0.5) { dp += (d === D0 ? "M" : "L") + xd(d).toFixed(1) + " " + yp(drop(d, k)).toFixed(1); pp += (d === D0 ? "M" : "L") + xd(d).toFixed(1) + " " + yp(d <= 54 ? place(d, k) : 0).toFixed(1); }
    dPath.setAttribute("d", dp); pPath.setAttribute("d", pp);
    const d = 110 - fp; mark.setAttribute("transform", `translate(${xd(d)},0)`); mt.textContent = d + " yd";
    mark.setAttribute("aria-valuenow", d);
    const dk = drop(d, k), pk = d <= 54 ? place(d, k) : 0;
    $("vbDk").textContent = Math.round(dk * 100) + "%"; $("vbPk").textContent = Math.round(pk * 100) + "%";
    $("vbDkEv").textContent = "expected " + (dk * 5).toFixed(2) + " pts"; $("vbPkEv").textContent = "expected " + (pk * 3).toFixed(2) + " pts";
    const [call, why] = decide(fp, down, ytg, k, tr);
    $("vbCall").textContent = call; $("vbWhy").textContent = `Ball on the opponent's ${100 - fp}. ${why}`;
  }
  let dragging = false;
  const setX = (e) => { const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const p = pt.matrixTransform(svg.getScreenCTM().inverse()); const d = Math.round(D0 + ((p.x - L) / (R - L)) * (D1 - D0)); fp = Math.max(50, Math.min(99, 110 - d)); draw(); };
  svg.style.touchAction = "none";
  svg.addEventListener("pointerdown", (e) => { dragging = true; svg.setPointerCapture(e.pointerId); setX(e); });
  svg.addEventListener("pointermove", (e) => dragging && setX(e));
  svg.addEventListener("pointerup", () => (dragging = false));
  mark.addEventListener("keydown", (e) => { const s = e.key === "ArrowRight" ? -1 : e.key === "ArrowLeft" ? 1 : 0; if (!s) return; e.preventDefault(); fp = Math.max(50, Math.min(99, fp + s)); draw(); });
  ["vbSkill", "vbYtg", "vbDown", "vbScore"].forEach((id) => $(id).addEventListener("input", draw));
  draw();
}
if (document.getElementById("vbChart")) viper();

function o27(O27) {
  const ATT = ["skill", "contact", "power", "eye", "speed"];
  const LBL = { skill: "overall", contact: "contact", power: "power", eye: "eye", speed: "speed" };
  const NAMES = ["Prospect A", "Prospect B", "Prospect C", "Prospect D"];
  const order = ["legend", "gem", "split", "monster"];
  const pros = order.map((k) => O27.find((p) => p.kind === k));
  const tier = (r) => (r <= 100 ? "ordinary developer" : r <= 200 ? "late bloomer" : "super-bloomer");
  const KIND = { gem: "hidden gem", legend: "college legend", monster: "stat monster", split: "scouts split" };
  const board = document.getElementById("o27Board");
  let year = 3, pick = -1, shown = false;
  function draw() {
    board.innerHTML = "";
    pros.forEach((p, i) => {
      const c = document.createElement("div");
      c.className = "pros" + (pick === i ? " pick" : "") + (shown ? " revealed" : "");
      c.tabIndex = 0; c.setAttribute("role", "button"); c.setAttribute("aria-pressed", pick === i);
      const y = p.years[year];
      const rows = ATT.map((a) => { const [d, pot] = y[a]; return `<div class="g"><span>${LBL[a]}</span><span class="track"><span class="pot" style="width:${((pot - 20) / 60) * 100}%"></span><span class="disp" style="width:${((d - 20) / 60) * 100}%"></span></span><span>${shown ? Math.round(pot) : d}</span></div>`; }).join("");
      c.innerHTML = `<div class="k">${NAMES[i]}${pick === i ? " · your pick" : ""}</div><h3>Shows ${y.skill[0]}</h3>${rows}
        <div class="rep"><span>Service scout<br><b>${p.svc.skill}</b></span><span>Your scouts<br><b>${p.own.skill}</b></span></div>
        <div class="truth">Real overall ${Math.round(p.years[3].skill[1])} · lens ${(p.access.skill * 100).toFixed(0)}% · growth rate ${p.interest}% (${tier(p.interest)}) · ${KIND[p.kind]}</div>`;
      const choose = () => { pick = i; draw(); };
      c.onclick = choose; c.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(); } };
      board.appendChild(c);
    });
    document.querySelectorAll(".yrs button").forEach((b) => b.setAttribute("aria-pressed", +b.dataset.y === year));
  }
  document.querySelectorAll(".yrs button").forEach((b) => (b.onclick = () => { year = +b.dataset.y; draw(); }));
  document.getElementById("o27Sign").onclick = () => { shown = true; year = 3; draw(); };
  document.getElementById("o27Reset").onclick = () => { shown = false; draw(); };
  draw();
}
if (document.getElementById("o27Board")) load("O27").then(o27);

function ptc(PTC) {
  // PTC: [gap (engine units), P(A wins point on A serve), P(B wins point on B serve)]
  function solve(sa, sb) {
    const memo = new Map();
    const game = (p) => { const m = {}; const g = (a, b) => { if (a === 4) return 1; if (b === 4) return 0; const k = a * 5 + b; if (m[k] != null) return m[k]; return (m[k] = p * g(a + 1, b) + (1 - p) * g(a, b + 1)); }; return g(0, 0); };
    const hA = game(sa), hB = game(sb);
    const tb = (f) => { const m = {}; const t = (a, b) => {
      if (a >= 7 && a - b >= 2) return 1; if (b >= 7 && b - a >= 2) return 0;
      if (a === b && a >= 12) { const w = sa * (1 - sb), l = (1 - sa) * sb; return w / (w + l); }
      const k = a * 40 + b; if (m[k] != null) return m[k];
      const n = a + b; const srv = n === 0 ? f : (Math.floor((n - 1) / 2) % 2 === 0 ? 1 - f : f);
      const p = srv === 0 ? sa : 1 - sb;
      return (m[k] = p * t(a + 1, b) + (1 - p) * t(a, b + 1)); }; return t(0, 0); };
    const TB = [tb(0), tb(1)];
    const setd = (f) => { const m = {}; const s = (a, b, srv) => {
      if (a === 6 && b === 6) { const p = TB[srv], ns = 1 - srv; return [[0, ns, p], [1, ns, 1 - p]]; }
      if (a >= 6 && a - b >= 2) return [[0, srv, 1]]; if (b >= 6 && b - a >= 2) return [[1, srv, 1]];
      const k = a * 100 + b * 10 + srv; if (m[k]) return m[k];
      const h = srv === 0 ? hA : 1 - hB, acc = {};
      for (const [w, ns, p] of s(a + 1, b, 1 - srv)) acc[w + "," + ns] = (acc[w + "," + ns] || 0) + h * p;
      for (const [w, ns, p] of s(a, b + 1, 1 - srv)) acc[w + "," + ns] = (acc[w + "," + ns] || 0) + (1 - h) * p;
      return (m[k] = Object.entries(acc).map(([k2, p]) => { const [w, ns] = k2.split(",").map(Number); return [w, ns, p]; })); }; return s(0, 0, f); };
    const D = [setd(0), setd(1)];
    const mm = {}; const mt = (x, y, srv) => { if (x === 2) return 1; if (y === 2) return 0; const k = x * 10 + y * 3 + srv; if (mm[k] != null) return mm[k];
      let v = 0; for (const [w, ns, p] of D[srv]) v += p * (w === 0 ? mt(x + 1, y, ns) : mt(x, y + 1, ns)); return (mm[k] = v); };
    const set0 = D[0].filter((r) => r[0] === 0).reduce((a, r) => a + r[2], 0);
    return { pt: (sa + (1 - sb)) / 2, hold: hA, set: set0, match: mt(0, 0, 0) };
  }
  const series = PTC.map(([g, sa, sb]) => ({ g, ...solve(sa, sb) }));
  const svg = document.getElementById("ptcChart");
  const L = 44, R = 508, T = 16, B = 250, G1 = 0.30;
  const xg = (g) => L + (g / G1) * (R - L), yp = (p) => B - ((p - 0.4) / 0.6) * (B - T);
  for (let p = 0.4; p <= 1.001; p += 0.1) { el("line", { x1: L, x2: R, y1: yp(p), y2: yp(p), stroke: "var(--uth-grid)" }, svg); el("text", { x: L - 6, y: yp(p) + 4, "text-anchor": "end", "font-size": 11, fill: "var(--uth-dim)" }, svg).textContent = Math.round(p * 100) + "%"; }
  for (let s = 0; s <= 18; s += 3) el("text", { x: xg(s / 60), y: B + 18, "text-anchor": "middle", "font-size": 11, fill: "var(--uth-dim)" }, svg).textContent = s;
  el("text", { x: (L + R) / 2, y: 292, "text-anchor": "middle", "font-size": 12, fill: "var(--uth-dim)" }, svg).textContent = "skill gap (points on the 20-80 scale)";
  const curve = (key, color, w, label) => { let d = ""; series.forEach((s, i) => (d += (i ? "L" : "M") + xg(s.g).toFixed(1) + " " + yp(s[key]).toFixed(1))); el("path", { d, fill: "none", stroke: color, "stroke-width": w }, svg); const last = series[series.length - 1]; el("text", { x: R - 4, y: yp(last[key]) - 6, "text-anchor": "end", "font-size": 12, fill: color }, svg).textContent = label; };
  curve("pt", "var(--uth-dim)", 1.5, "point"); curve("hold", "var(--uth-fg)", 1.5, "hold"); curve("set", "var(--uth-fg)", 2.5, "set"); curve("match", "var(--uth-accent)", 3.5, "match");
  const mark = el("g", { tabindex: 0, role: "slider", "aria-label": "Skill gap", style: "cursor: ew-resize" }, svg);
  el("rect", { x: -14, y: T, width: 28, height: B - T, fill: "transparent" }, mark);
  el("line", { x1: 0, x2: 0, y1: T, y2: B, stroke: "var(--uth-fg)", "stroke-dasharray": "4 4" }, mark);
  const dot = el("circle", { r: 6, fill: "var(--uth-accent)" }, mark);
  let i = 10;
  const $ = (id) => document.getElementById(id);
  function draw() {
    const s = series[i]; mark.setAttribute("transform", `translate(${xg(s.g)},0)`); dot.setAttribute("cy", yp(s.match));
    $("ptcPt").textContent = pct(s.pt); $("ptcGm").textContent = pct(s.hold); $("ptcSet").textContent = pct(s.set); $("ptcMt").textContent = pct(s.match);
    mark.setAttribute("aria-valuenow", Math.round(s.g * 60));
  }
  let dragging = false;
  const setX = (e) => { const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const p = pt.matrixTransform(svg.getScreenCTM().inverse()); i = Math.max(0, Math.min(series.length - 1, Math.round(((p.x - L) / (R - L)) * G1 * 100))); draw(); };
  svg.style.touchAction = "none";
  svg.addEventListener("pointerdown", (e) => { dragging = true; svg.setPointerCapture(e.pointerId); setX(e); });
  svg.addEventListener("pointermove", (e) => dragging && setX(e));
  svg.addEventListener("pointerup", () => (dragging = false));
  mark.addEventListener("keydown", (e) => { const s = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!s) return; e.preventDefault(); i = Math.max(0, Math.min(series.length - 1, i + s)); draw(); });
  draw();
}
if (document.getElementById("ptcChart")) load("PTC").then(ptc);

function careers(CAREERS) {
  const order = ["ready on arrival", "sophomore leap", "junior jump", "senior bloomer", "stagnant"];
  const C = order.map((s) => CAREERS.find((c) => c.shape === s));
  const COL = ["var(--uth-fg)", "var(--uth-accent)", "var(--uth-fg)", "var(--uth-accent)", "var(--uth-dim)"];
  const DASH = ["", "", "6 4", "6 4", "2 4"];
  const path = (c, x) => { let v = c.start; const out = [v];
    for (let i = 0; i < 3; i++) { const base = Math.max(0, c.caps[i] * x); let g = base;
      if (v >= c.peak) g = base * 0.2; else if (v + g > c.peak) g = (c.peak - v) + Math.max(0, v + base - c.peak) * 0.2;
      v += g; out.push(v); } return out; };
  const svg = document.getElementById("crChart");
  const L = 44, R = 360, T = 16, B = 250, V0 = 20, V1 = 65;
  const xg = (i) => L + (i / 3) * (R - L), yv = (v) => B - ((v - V0) / (V1 - V0)) * (B - T);
  for (let v = 20; v <= 65; v += 15) { el("line", { x1: L, x2: R, y1: yv(v), y2: yv(v), stroke: "var(--uth-grid)" }, svg); el("text", { x: L - 6, y: yv(v) + 4, "text-anchor": "end", "font-size": 11, fill: "var(--uth-dim)" }, svg).textContent = v; }
  ["9th", "10th", "11th", "12th"].forEach((g, i) => (el("text", { x: xg(i), y: B + 18, "text-anchor": "middle", "font-size": 11, fill: "var(--uth-dim)" }, svg).textContent = g));
  const lines = C.map((c, k) => {
    el("line", { x1: R - 8, x2: R + 2, y1: yv(c.peak), y2: yv(c.peak), stroke: COL[k], "stroke-width": 2 }, svg);
    const p = el("path", { fill: "none", stroke: COL[k], "stroke-width": 2.5, "stroke-dasharray": DASH[k] }, svg);
    const lab = el("text", { "font-size": 11, fill: COL[k] }, svg); lab.textContent = c.shape;
    return { c, p, lab };
  });
  function draw(x) {
    const ends = [];
    lines.forEach(({ c, p, lab }) => { const v = path(c, x); p.setAttribute("d", v.map((y, i) => (i ? "L" : "M") + xg(i).toFixed(1) + " " + yv(y).toFixed(1)).join("")); ends.push({ lab, y: yv(v[3]), val: v[3] }); });
    ends.sort((a, b) => a.y - b.y); let last = -99;
    ends.forEach((e) => { const y = Math.max(e.y + 4, last + 13); last = y; e.lab.setAttribute("x", R + 8); e.lab.setAttribute("y", y); e.lab.textContent = e.lab.textContent.replace(/ \d+$/, "") + " " + Math.round(e.val); });
    document.querySelectorAll("#crExpo button").forEach((b) => b.setAttribute("aria-pressed", +b.dataset.x === x));
  }
  document.querySelectorAll("#crExpo button").forEach((b) => (b.onclick = () => draw(+b.dataset.x)));
  draw(1);
  // No. 1 singles by grade
  const s2 = document.getElementById("crNo1");
  const rows = [["Oregon boys", [5.3, 19.7, 32.3, 42.7], "var(--uth-fg)"], ["Sim, before", [1.5, 3.3, 9.4, 85.7], "var(--uth-dim)"], ["Sim, after (boys)", [15.0, 19.4, 31.7, 33.9], "var(--uth-accent)"]];
  const gx = (g) => 50 + g * 118, bw = 30, y1 = (v) => 250 - (v / 90) * 220;
  for (let v = 0; v <= 90; v += 30) { el("line", { x1: 40, x2: 516, y1: y1(v), y2: y1(v), stroke: "var(--uth-grid)" }, s2); el("text", { x: 36, y: y1(v) + 4, "text-anchor": "end", "font-size": 11, fill: "var(--uth-dim)" }, s2).textContent = v + "%"; }
  ["9th", "10th", "11th", "12th"].forEach((g, i) => (el("text", { x: gx(i) + 48, y: 268, "text-anchor": "middle", "font-size": 11, fill: "var(--uth-dim)" }, s2).textContent = g));
  rows.forEach(([name, vals, col], r) => { vals.forEach((v, g) => { el("rect", { x: gx(g) + r * (bw + 3), y: y1(v), width: bw, height: 250 - y1(v), fill: col }, s2); }); el("rect", { x: 50 + r * 150, y: 282, width: 10, height: 10, fill: col }, s2); el("text", { x: 64 + r * 150, y: 291, "font-size": 11, fill: "var(--uth-fg)" }, s2).textContent = name; });
}
if (document.getElementById("crChart")) load("CAREERS").then(careers);

function ygf() {
  const TR = ["attractiveness", "liveliness", "curiosity", "kindness", "adaptability"];
  const LABEL = { attractiveness: "looks", liveliness: "liveliness", curiosity: "curiosity", kindness: "kindness", adaptability: "adaptability" };
  const QK = { attractiveness: "attractiveness", liveliness: "agency", curiosity: "curiosity", kindness: "kindness", adaptability: "adaptability" };
  const P = {
    Alex: { chips: { attractiveness: 3, liveliness: 2, curiosity: 2, kindness: 2, adaptability: 1 }, q: { attractiveness: 85, agency: 78, curiosity: 82, kindness: 75, adaptability: 70 }, relay: 72 },
    Blake: { chips: { attractiveness: 2, liveliness: 2, curiosity: 3, kindness: 2, adaptability: 1 }, q: { attractiveness: 80, agency: 72, curiosity: 88, kindness: 78, adaptability: 65 }, relay: 68 },
  };
  const score = (v, c) => {
    const al = TR.reduce((a, t) => a + (v.chips[t] / 10) * c.q[QK[t]], 0);
    const temp = Math.max(0, 100 - Math.abs(v.relay - c.relay) * 2);
    return { al, temp, s: al * 0.7 + temp * 0.3 };
  };
  const pair = document.getElementById("ygfPair");
  function render() {
    pair.innerHTML = "";
    for (const name of ["Alex", "Blake"]) {
      const p = P[name], used = TR.reduce((a, t) => a + p.chips[t], 0);
      const d = document.createElement("div"); d.className = "person";
      d.innerHTML = `<h3>${name}</h3><div class="t">quiz temperature ${p.relay} · ${10 - used} chip${10 - used === 1 ? "" : "s"} free</div>`;
      for (const t of TR) {
        const row = document.createElement("div"); row.className = "trait";
        const chips = Array.from({ length: p.chips[t] }, () => `<span class="chip"></span>`).join("");
        row.innerHTML = `<span>${LABEL[t]} · ${p.q[QK[t]]}</span><div class="chips">${chips}<button class="mini ghost" type="button" aria-label="Remove a ${LABEL[t]} chip from ${name}" ${p.chips[t] ? "" : "disabled"}>−</button><button class="mini" type="button" aria-label="Add a ${LABEL[t]} chip to ${name}" ${used < 10 ? "" : "disabled"}>+</button></div>`;
        const [minus, plus] = row.querySelectorAll("button");
        minus.onclick = () => { p.chips[t]--; render(); };
        plus.onclick = () => { p.chips[t]++; render(); };
        d.appendChild(row);
      }
      pair.appendChild(d);
    }
    const ab = score(P.Alex, P.Blake), ba = score(P.Blake, P.Alex);
    const fill = (id, r) => { document.getElementById(id).textContent = r.s.toFixed(2); document.getElementById(id + "x").textContent = `0.7 × alignment ${r.al.toFixed(1)} + 0.3 × temperature ${r.temp.toFixed(0)}${r.s >= 60 ? "" : " · below the 60 needed"}`; };
    fill("ygfAB", ab); fill("ygfBA", ba);
  }
  render();
}
if (document.getElementById("ygfPair")) ygf();

function ygfweek(D) {
  const svg = document.getElementById("ygwRing");
  const name = Object.fromEntries(D.users.map((u) => [u.id, u.name]));
  const ids = D.users.map((u) => u.id);
  const W = 520, H = 520, cx = 260, cy = 262, R = 196;
  const pos = {}; ids.forEach((id, i) => { const a = (i / ids.length) * Math.PI * 2 - Math.PI / 2; pos[id] = [cx + R * Math.cos(a), cy + R * Math.sin(a), a]; });
  const gLines = el("g", {}, svg), gNodes = el("g", {}, svg);
  let view = "w1", sel = null;
  const TIER_W = { first: 3, second: 1.6, third: 0.8 };
  const matchesFor = (v) => (v === "gs" ? D.gs.matches : v === "w1" ? D.weeks[0].matches : D.weeks[0].matches.concat(D.weeks[1].matches));
  const nodes = ids.map((id) => {
    const [x, y, a] = pos[id];
    const g = el("g", { tabindex: 0, role: "button", style: "cursor:pointer" }, gNodes);
    const c = el("circle", { cx: x, cy: y, r: 9 }, g);
    const lx = cx + (R + 22) * Math.cos(a), ly = cy + (R + 22) * Math.sin(a);
    const t = el("text", { x: lx, y: ly + 4, "text-anchor": Math.abs(Math.cos(a)) < 0.2 ? "middle" : Math.cos(a) > 0 ? "start" : "end", "font-size": 14, fill: "var(--uth-fg)" }, g);
    t.textContent = name[id];
    const pick = () => { sel = sel === id ? null : id; draw(); };
    g.addEventListener("click", pick); g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
    return { id, c, t };
  });
  function line(a, b, attrs) { const [x1, y1] = pos[a], [x2, y2] = pos[b]; return el("line", { x1, y1, x2, y2, ...attrs }, gLines); }
  function draw() {
    gLines.innerHTML = "";
    const ms = matchesFor(view), partner = {};
    ms.forEach((m) => { partner[m.a] = m.b; partner[m.b] = m.a; });
    if (sel && view !== "gs") {
      const wk = D.weeks[view === "w1" ? 0 : 1];
      wk.signals.filter((s) => s.from === sel).forEach((s) => line(s.from, s.to, { stroke: "var(--uth-dim)", "stroke-width": TIER_W[s.tier], "stroke-opacity": 0.8 }));
    }
    ms.forEach((m) => line(m.a, m.b, { stroke: "var(--uth-accent)", "stroke-width": 4 }));
    nodes.forEach((n) => {
      const out = view !== "gs" && D.weeks[0].active.indexOf(n.id) < 0;
      n.c.style.fill = partner[n.id] ? "var(--uth-accent)" : out ? "transparent" : "var(--uth-fg)";
      n.c.style.stroke = "var(--uth-fg)"; n.c.setAttribute("stroke-width", sel === n.id ? 3 : 1);
      n.t.style.fontWeight = sel === n.id ? "700" : "400";
    });
    const avg = ms.reduce((a, m) => a + (m.ab + m.ba) / 2, 0) / (ms.length || 1);
    const people = Object.keys(partner).length;
    document.getElementById("ygwMatched").textContent = `${people} of ${ids.length}`;
    document.getElementById("ygwAvg").textContent = avg.toFixed(1);
    let note = "";
    if (sel) {
      if (view === "gs") note = `${name[sel]} is paired with ${name[partner[sel]]}. Stable matching gives everyone full information and unlimited proposals.`;
      else {
        const wk = D.weeks[view === "w1" ? 0 : 1], out = wk.signals.filter((s) => s.from === sel);
        const cnt = (t) => out.filter((s) => s.tier === t).length;
        const inc = wk.signals.filter((s) => s.to === sel).length;
        note = out.length ? `${name[sel]} sent ${cnt("first")} top, ${cnt("second")} second and ${cnt("third")} third picks and received ${inc}.` : D.weeks[0].active.indexOf(sel) < 0 ? `${name[sel]}'s profile is incomplete, so ${name[sel]} isn't shown to anyone yet.` : `${name[sel]} matched in week 1 and left the market.`;
        if (partner[sel]) note += ` Matched with ${name[partner[sel]]}: ${D.scores[sel][partner[sel]].toFixed(1)} one way, ${D.scores[partner[sel]][sel].toFixed(1)} the other.`;
      }
    } else note = view === "gs" ? "The textbook algorithm pairs everyone, including the incomplete profile." : "Click a person to see who they picked. Thicker lines are higher picks.";
    document.getElementById("ygwNote").textContent = note;
    document.querySelectorAll("#ygwView button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.v === view));
  }
  document.querySelectorAll("#ygwView button").forEach((b) => (b.onclick = () => { view = b.dataset.v; draw(); }));
  draw();
}
if (document.getElementById("ygwRing")) fetch("assets/uth/ygf-week.json").then((r) => r.json()).then(ygfweek);
})();
