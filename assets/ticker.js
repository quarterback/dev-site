/* Occupant Indices ticker on projects.html. Reads the published JSON from
   the public quarterback/improved-succotash repo at load, so the tape shows
   whatever the indices last published, with the date on each group.
   The tape scrolls on its own; drag it to scrub, hover or focus to pause.
   Reduced motion: no auto-scroll, the tape scrolls by hand. If the data
   can't be fetched, the ticker stays hidden. */
(function () {
  var root = document.getElementById("ticker");
  if (!root) return;
  var BASE = "https://raw.githubusercontent.com/quarterback/improved-succotash/main/data/";
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function day(iso) {
    var d = new Date(iso);
    return isNaN(d) ? "" : d.getUTCDate() + " " + MONTHS[d.getUTCMonth()] + " " + d.getUTCFullYear();
  }
  function get(path) {
    return fetch(BASE + path, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(path);
      return r.json();
    });
  }
  function chg(v, unit) {
    if (v == null) return null;
    var n = Math.round(v * 10) / 10;
    return { text: (n > 0 ? "+" : n < 0 ? "−" : "") + Math.abs(n) + (unit || "%"), dir: n > 0 ? "up" : n < 0 ? "dn" : "" };
  }
  function money(v) { return "$" + v.toFixed(2); }

  Promise.allSettled([get("compute-cpi.json"), get("aeai/latest.json"), get("ldi/latest.json")]).then(function (res) {
    var items = [];
    var cpi = res[0].status === "fulfilled" ? res[0].value : null;
    var aiu = res[1].status === "fulfilled" ? res[1].value : null;
    var ldi = res[2].status === "fulfilled" ? res[2].value : null;
    if (cpi) {
      var c = cpi.compute_cpi;
      items.push({ date: day(cpi.meta.generated_at) });
      items.push({ t: c.ticker, v: String(c.value), c: chg(c.mom_change), note: "m/m" });
      ["budget", "frontier", "judgment", "longctx"].forEach(function (k) {
        var s = cpi.subindices && cpi.subindices[k];
        if (s) items.push({ t: s.ticker, v: money(s.value), note: "per 1M tokens" });
      });
      ["startup", "agentic", "throughput"].forEach(function (k) {
        var p = cpi.persona_cpis && cpi.persona_cpis[k];
        if (p) items.push({ t: p.ticker, v: String(p.cpi), c: chg(p.mom_change), note: "m/m" });
      });
      var cog = cpi.spreads && cpi.spreads.cognition_premium;
      if (cog) items.push({ t: cog.ticker, v: money(cog.value), note: "frontier over budget" });
    }
    if (aiu) {
      items.push({ date: day(aiu.date || aiu.generated_at) });
      items.push({ t: "$AIU", v: aiu.aiu_index.toFixed(2) });
    }
    if (ldi) {
      items.push({ date: day(ldi.date || ldi.generated_at) });
      items.push({ t: "$LDI", v: ldi.substitution_rate + "%", note: "substitution rate" });
    }
    if (items.length < 3) return;
    build(items);
  });

  function build(items) {
    var tape = root.querySelector(".tk__tape");
    var html = items.map(function (i) {
      if (i.date) return '<span class="tk__d">' + i.date + "</span>";
      return '<span class="tk__i"><b>' + i.t + "</b> " + i.v +
        (i.c ? ' <em class="' + i.c.dir + '">' + i.c.text + "</em>" : "") +
        (i.note ? ' <small>' + i.note + "</small>" : "") + "</span>";
    }).join("");
    tape.innerHTML = '<span class="tk__run">' + html + '</span><span class="tk__run" aria-hidden="true">' + html + "</span>";
    root.hidden = false;

    var win = root.querySelector(".tk__win");
    var still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) { root.classList.add("tk--still"); return; }

    var x = 0, last = 0, paused = false, drag = null, moved = 0;
    var SPEED = 48; // px a second
    function half() { return tape.firstChild.offsetWidth; }
    function wrap() { var h = half(); if (h) { while (x <= -h) x += h; while (x > 0) x -= h; } }
    function frame(t) {
      var dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
      last = t;
      if (!paused && !drag) x -= SPEED * dt;
      wrap();
      tape.style.transform = "translate3d(" + x + "px,0,0)";
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    root.addEventListener("pointerenter", function () { paused = true; });
    root.addEventListener("pointerleave", function () { paused = false; });
    root.addEventListener("focusin", function () { paused = true; });
    root.addEventListener("focusout", function () { paused = false; });
    win.addEventListener("pointerdown", function (e) {
      drag = { px: e.clientX, x0: x };
      moved = 0;
      win.setPointerCapture(e.pointerId);
      win.classList.add("is-drag");
    });
    win.addEventListener("pointermove", function (e) {
      if (!drag) return;
      moved = Math.abs(e.clientX - drag.px);
      x = drag.x0 + (e.clientX - drag.px);
    });
    function end() { drag = null; win.classList.remove("is-drag"); }
    win.addEventListener("pointerup", end);
    win.addEventListener("pointercancel", end);
    win.addEventListener("click", function (e) {
      if (moved > 4) { e.preventDefault(); return; }
      location.href = "projects/occupant.html";
    });
  }
})();
