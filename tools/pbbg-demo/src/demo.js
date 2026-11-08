// Interactive example on projects/pbbg-content-schema.html. Everything shown
// on the "game screen" is produced by the schema's own renderText(), and every
// diagnostic comes from its own validateBundle(), both vendored from
// quarterback/pbbg-content-schema. The bundle is an example written from
// Coalition's first level (text from quarterback/escape-game); it is not the
// game's live content, which uses its own format and an export tool.
import { validateBundle, renderText, basePolicy } from "../vendor/validator.js";
import EXAMPLE from "../coalition-example.json";

const root = document.getElementById("pbbg-demo");
if (root) start(root);

function start(root) {
  const clone = (x) => JSON.parse(JSON.stringify(x));
  let bundle = clone(EXAMPLE);
  let role = "candidate";
  let selected = null;
  const STATE = {
    candidate: { "has.decoy": false, "has.influence": false, "is.night": false, exposure: 0, "candidate.location": "Portô Venla" },
    investigator: { "is.night": false, "report.place": "Pedra Branca" },
  };
  const SCENE = { candidate: "residence", investigator: "desk" };
  const byId = (col, id) => bundle[col].find((x) => x.id === id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  root.innerHTML = `
    <div class="pd-bar">
      <div class="pd-seg" role="group" aria-label="Whose view">
        <button type="button" data-role="candidate" aria-pressed="true">Candidate</button>
        <button type="button" data-role="investigator" aria-pressed="false">Investigator</button>
      </div>
      <button type="button" class="pd-split" aria-pressed="false">Separate the layers</button>
    </div>
    <div class="pd-stage">
      <canvas class="pd-gl" aria-hidden="true"></canvas>
      <div class="pd-scene">
        <div class="pd-plane" data-layer="narrative"><span class="pd-tag">Story</span><div class="pd-slot"></div></div>
        <div class="pd-plane" data-layer="interface"><span class="pd-tag">Interface</span><div class="pd-slot"></div></div>
        <div class="pd-plane pd-plane--rules" data-layer="rules"><span class="pd-tag">Game rules</span><div class="pd-slot"></div></div>
        <div class="pd-plane pd-plane--policy" data-layer="policy"><span class="pd-tag">Writing rules</span><div class="pd-slot"></div></div>
      </div>
    </div>
    <p class="pd-state" aria-live="polite"></p>
    <div class="pd-inspect" hidden><p class="pd-small">Source record</p><pre></pre></div>
    <div class="pd-tools">
      <label class="pd-ctl" for="pdHours"><span>The decoy convoy costs <output id="pdHoursO">3</output> hours in the rules</span>
        <input id="pdHours" type="range" min="1" max="8" value="3"></label>
      <label class="pd-ctl" for="pdLine"><span>Gianlūka&rsquo;s line (story only)</span>
        <input id="pdLine" type="text"></label>
    </div>
    <p class="pd-small">Break something. The schema&rsquo;s own validator checks the bundle after every change.</p>
    <div class="pd-breaks"></div>
    <div class="pd-diag" aria-live="polite"></div>`;
  const $ = (s) => root.querySelector(s);
  const slot = (layer) => root.querySelector(`[data-layer="${layer}"] .pd-slot`);
  $("#pdLine").value = byId("content", "aide.line").text;

  // ----- render the current role's screen through renderText -----
  function render() {
    const diags = validateBundle(bundle, { policy: basePolicy });
    const errors = diags.filter((d) => d.severity === "error");
    showDiagnostics(diags);
    const scene = byId("scenes", SCENE[role]);
    const event = bundle.events.find((e) => e.sceneRefs.includes(scene.id));
    const text = (id) => {
      try { return esc(renderText(bundle, id, { state: STATE[role], role, phase: "run", policy: basePolicy })); }
      catch (e) { return `<span class="pd-err">${esc(e.message)}</span>`; }
    };
    const item = (id, cls = "") => `<span class="pd-el ${cls}" data-id="${id}" tabindex="0" role="button">${text(id)}</span>`;
    if (errors.length) {
      slot("narrative").innerHTML = `<p class="pd-stopped">renderText won&rsquo;t draw this screen until the bundle passes. See the problems below.</p>`;
      slot("interface").innerHTML = "";
    } else if (role === "candidate") {
      slot("narrative").innerHTML = `<p class="pd-h">${item("residence.title")}</p><p>${item("residence.arrive")}</p><p class="pd-quote">${item("aide.line")} <span class="pd-small">&mdash; ${esc(byId("entities", "aide").name)}</span></p>`;
      slot("interface").innerHTML = `<p class="pd-obj">${item("residence.objective")}</p>` + event.choices.map((c) => {
        const a = c.actionRef;
        return `<div class="pd-move">${item(c.labelRef, "pd-label")}${item(a + ".takes", "pd-chip")}<small>${item(a + ".preview")}</small><small class="pd-need">${item(a + ".needs")}</small></div>`;
      }).join("");
    } else {
      slot("narrative").innerHTML = `<p class="pd-h">${item("gov.title")}</p><p>${item("gov.brief")}</p><p>${item("gov.report")}</p>`;
      slot("interface").innerHTML = event.choices.map((c) => `<div class="pd-move">${item(c.labelRef, "pd-label")}${item(c.actionRef + ".takes", "pd-chip")}</div>`).join("");
    }
    // Rules layer: the actions in this scene and the facts this role may see
    const facts = bundle.facts.filter((f) => f.audience.includes(role));
    slot("rules").innerHTML = scene.actionRefs.map((id) => {
      const a = byId("actions", id);
      if (!a) return `<div class="pd-err">Unknown action ${esc(id)}</div>`;
      const cost = Object.entries(a.cost).map(([k, v]) => `<span data-r="${id}.${k}">${k} ${v}</span>`).join("");
      const req = (a.requires || []).map((r) => `<span data-r="fact.${r.ref}">needs ${esc(r.ref)}</span>`).join("");
      return `<div><b>${esc(id)}</b> ${cost}${req}</div>`;
    }).join("") + `<div class="pd-facts">Facts this view may use: ${facts.map((f) => `<span data-r="fact.${f.id}">${esc(f.id)}</span>`).join("")}</div>`
      + `<div>Cards: ${bundle.entities.filter((e) => e.kind === "card").map((e) => `<span data-r="entity.${e.id}">${esc(e.id)}</span>`).join("")}</div>`;
    slot("policy").innerHTML = `<ul>${basePolicy.rules.map((r) => `<li><code>${r.id}</code> ${esc(r.guidance)}</li>`).join("")}</ul>`;
    wireBindings();
    if (selected) inspect(selected);
  }

  // Mark which rendered elements take a value from the rules, for the lines
  function wireBindings() {
    root.querySelectorAll(".pd-el").forEach((el) => {
      const c = byId("content", el.dataset.id);
      const b = c && c.bindings && Object.values(c.bindings)[0];
      el.removeAttribute("data-b");
      if (!b) return;
      el.dataset.b = b.source === "action-cost" ? `${b.ref}.${b.key}` : b.source === "entity" ? `entity.${b.ref}` : `fact.${b.ref}`;
    });
  }

  // ----- inspector -----
  function inspect(id) {
    const c = byId("content", id);
    if (!c) return;
    selected = id;
    const linked = Object.values(c.bindings || {}).map((b) => b.source === "action-cost" ? byId("actions", b.ref) : b.source === "entity" ? byId("entities", b.ref) : byId("facts", b.ref)).filter(Boolean);
    const box = $(".pd-inspect");
    box.hidden = false;
    box.querySelector("pre").textContent = JSON.stringify(c, null, 2) + (linked.length ? "\n\n// what it reads from\n" + linked.map((x) => JSON.stringify(x, null, 2)).join("\n") : "");
    root.querySelectorAll(".pd-el").forEach((el) => el.classList.toggle("is-sel", el.dataset.id === id));
  }
  root.addEventListener("click", (e) => { const el = e.target.closest(".pd-el"); if (el) inspect(el.dataset.id); });
  root.addEventListener("keydown", (e) => { const el = e.target.closest(".pd-el"); if (el && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); inspect(el.dataset.id); } });

  // ----- diagnostics -----
  function showDiagnostics(diags) {
    const box = $(".pd-diag");
    if (!diags.length) { box.innerHTML = `<p class="pd-ok">validateBundle: no problems.</p>`; return; }
    box.innerHTML = `<p class="pd-bad">validateBundle found ${diags.length} problem${diags.length > 1 ? "s" : ""}:</p><ul>` + diags.map((d) =>
      `<li><code>${esc(d.ruleId)}</code> ${d.contentId ? `<b>${esc(d.contentId)}</b> ` : ""}${esc(d.message)} <span class="pd-small">${esc(d.hint)}</span></li>`).join("") + "</ul>";
  }

  // ----- controls -----
  const state = (msg) => { $(".pd-state").textContent = msg; };
  root.querySelectorAll("[data-role]").forEach((b) => (b.onclick = () => {
    role = b.dataset.role; selected = null; $(".pd-inspect").hidden = true;
    root.querySelectorAll("[data-role]").forEach((x) => x.setAttribute("aria-pressed", x === b));
    state(role === "candidate" ? "The candidate’s view. Where the candidate really is, and which cards they hold, are facts only the candidate role can see." : "The investigator’s view, from the same bundle. It can use the place in the latest report, but not where the candidate really is or which cards they hold. The schema blocks it, so this page doesn’t have to.");
    render();
  }));
  $(".pd-split").onclick = () => {
    const on = !root.classList.contains("is-split");
    root.classList.toggle("is-split", on);
    $(".pd-split").setAttribute("aria-pressed", on);
    $(".pd-split").textContent = on ? "Put the screen back together" : "Separate the layers";
    state(on ? "Story text, interface text, game rules, and writing rules each live in their own part of the bundle. Lines connect text to the rule it takes a number or name from." : "");
  };
  $("#pdHours").addEventListener("input", (e) => {
    const h = +e.target.value; $("#pdHoursO").textContent = h;
    byId("actions", "decoy").cost.hours = h;
    if (role !== "candidate") root.querySelector('[data-role="candidate"]').click();
    render();
    state(`The rule now says ${h} hours. The label reads it from the rule, so it shows ${h} hr without anyone editing a sentence.`);
  });
  $("#pdLine").addEventListener("input", (e) => {
    const before = JSON.stringify(bundle.actions);
    byId("content", "aide.line").text = e.target.value || " ";
    if (role !== "candidate") root.querySelector('[data-role="candidate"]').click();
    render();
    state(JSON.stringify(bundle.actions) === before ? "You changed a line of story. The game rules didn’t change at all." : "");
  });

  // ----- breaks: each patches a copy of the example, then re-validates -----
  const BREAKS = [
    { label: "Rename a placeholder", why: "decoy.takes now says {hrs}, but its binding is still called hours.", apply: (b) => { b.content.find((c) => c.id === "decoy.takes").text = "{hrs} hr"; } },
    { label: "End a button label with a period", why: "An action label now ends with a period.", apply: (b) => { b.content.find((c) => c.id === "decoy.label").text = "Send out a decoy convoy."; } },
    { label: "Show the investigator the candidate’s location", why: "The investigator’s briefing now binds candidate.location, a fact only the candidate role may see.", apply: (b) => { b.content.find((c) => c.id === "gov.brief").bindings.place.ref = "candidate.location"; } },
    { label: "Point a choice at an action that doesn’t exist", why: "A choice now runs an action called escape.now, which the rules never declare.", apply: (b) => { b.events[0].choices[0].actionRef = "escape.now"; } },
    { label: "Put HTML in the text", why: "The objective now contains markup.", apply: (b) => { b.content.find((c) => c.id === "residence.objective").text = "<b>Get past the watch.</b>"; } },
  ];
  const breaks = $(".pd-breaks");
  const reset = document.createElement("button");
  reset.type = "button"; reset.textContent = "Reset the example";
  BREAKS.forEach((x) => {
    const b = document.createElement("button"); b.type = "button"; b.textContent = x.label;
    b.onclick = () => {
      bundle = clone(EXAMPLE); x.apply(bundle);
      byId("actions", "decoy").cost.hours = +$("#pdHours").value;
      breaks.querySelectorAll("button").forEach((y) => y.setAttribute("aria-pressed", y === b));
      state(x.why); render();
    };
    breaks.appendChild(b);
  });
  reset.onclick = () => { bundle = clone(EXAMPLE); $("#pdHours").value = 3; $("#pdHoursO").textContent = 3; $("#pdLine").value = byId("content", "aide.line").text; breaks.querySelectorAll("button").forEach((y) => y.setAttribute("aria-pressed", false)); state(""); render(); };
  breaks.appendChild(reset);

  render();
  lines(root);
}

// ----- WebGL: dashed lines from text to the rule it reads from -----
function lines(root) {
  const stage = root.querySelector(".pd-stage"), cv = root.querySelector(".pd-gl");
  const gl = cv.getContext("webgl", { premultipliedAlpha: true, antialias: true });
  if (!gl) return;
  const vs = "attribute vec2 p;attribute float d;uniform vec2 r;varying float vd;void main(){vd=d;vec2 c=p/r*2.0-1.0;gl_Position=vec4(c.x,-c.y,0,1);}";
  const fs = "precision mediump float;varying float vd;uniform float t;void main(){float on=step(0.45,fract(vd/14.0-t));gl_FragColor=vec4(vec3(0.80,0.47,0.36)*on,on*0.95);}";
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr); gl.useProgram(pr);
  const buf = gl.createBuffer(), P = gl.getAttribLocation(pr, "p"), D = gl.getAttribLocation(pr, "d");
  const uR = gl.getUniformLocation(pr, "r"), uT = gl.getUniformLocation(pr, "t");
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function frame(now) {
    const dpr = Math.min(devicePixelRatio || 1, 2), sr = stage.getBoundingClientRect(), w = sr.width, h = sr.height;
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    gl.viewport(0, 0, cv.width, cv.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    if (root.classList.contains("is-split")) {
      const v = [];
      root.querySelectorAll(".pd-el[data-b]").forEach((el) => {
        const r = root.querySelector(`[data-r="${el.dataset.b}"]`); if (!r) return;
        const a = el.getBoundingClientRect(), c = r.getBoundingClientRect();
        const x1 = a.left + a.width / 2 - sr.left, y1 = a.bottom - sr.top, x2 = c.left + c.width / 2 - sr.left, y2 = c.top - sr.top;
        const len = Math.hypot(x2 - x1, y2 - y1) || 1, nx = (-(y2 - y1) / len) * 1.5, ny = ((x2 - x1) / len) * 1.5;
        v.push(x1 + nx, y1 + ny, 0, x1 - nx, y1 - ny, 0, x2 + nx, y2 + ny, len, x2 + nx, y2 + ny, len, x1 - nx, y1 - ny, 0, x2 - nx, y2 - ny, len);
      });
      if (v.length) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(P); gl.vertexAttribPointer(P, 2, gl.FLOAT, false, 12, 0);
        gl.enableVertexAttribArray(D); gl.vertexAttribPointer(D, 1, gl.FLOAT, false, 12, 8);
        gl.uniform2f(uR, w, h); gl.uniform1f(uT, still ? 0 : now / 900);
        gl.drawArrays(gl.TRIANGLES, 0, v.length / 3);
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
