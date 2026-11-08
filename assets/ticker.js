/* Occupant Indices ticker on projects.html. Computes $CPI and its family
   live from OpenRouter's public price list on each visit, using the Occupant
   method (src/calculate_cpi.py in quarterback/improved-succotash): a fixed
   basket of six workloads, each priced at the average of its tier's models,
   weighted, and divided by the February 2025 baseline (x100). The tier lists
   were refreshed in November 2026 to current models; the archive used 2025
   models, most of which are gone. $AIU and $LDI can't be recomputed in a
   browser, so they show their last published values with dates. If
   OpenRouter is unreachable, the $CPI group falls back to the published file.
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

  // The Occupant basket, persona baskets and February 2025 baseline,
  // copied from improved-succotash (calculate_cpi.py, data/baseline.json).
  var BASKET = [
    ["general", 2000, 500, 0.20], ["general", 10000, 500, 0.25], ["budget", 500, 50, 0.20],
    ["frontier", 3000, 1000, 0.15], ["reasoning", 5000, 2000, 0.10], ["longctx", 50000, 1000, 0.10]
  ];
  var PERSONAS = [
    ["$START", 0.0514, [["frontier", 3000, 1000, 0.5], ["longctx", 20000, 500, 0.3], ["budget", 500, 50, 0.2]]],
    ["$AGENT", 0.0739, [["reasoning", 5000, 3000, 0.7], ["general", 1000, 500, 0.2], ["frontier", 500, 1000, 0.1]]],
    ["$THRU", 0.0326, [["general", 10000, 500, 0.8], ["budget", 500, 50, 0.2]]]
  ];
  var BASELINE = 0.04118178;
  // Tier lists, refreshed 8 November 2026 against OpenRouter.
  var TIERS = {
    budget: ["anthropic/claude-haiku-5.5", "openai/gpt-6-luna", "google/gemini-3.8-flash", "deepseek/deepseek-v4.1-flash", "qwen/qwen3.8-flash"],
    general: ["anthropic/claude-sonnet-5.5", "openai/gpt-6.1-terra", "google/gemini-3.8-flash", "mistralai/mistral-large-4-0", "x-ai/grok-4.7"],
    frontier: ["anthropic/claude-fable-5.1", "anthropic/claude-opus-5.5", "openai/gpt-6-astra", "openai/gpt-6.1-sol", "google/gemini-4-argon"],
    reasoning: ["openai/gpt-6.1-sol-pro", "openai/gpt-6.1-terra-pro", "moonshotai/kimi-k3.1-pro", "deepseek/deepseek-v4-pro-0813", "qwen/qwen3.8-max-prime"],
    longctx: ["google/gemini-4-argon", "google/gemini-3.8-flash", "anthropic/claude-sonnet-5.5", "openai/gpt-6.1-terra", "moonshotai/kimi-k3.1-pro"]
  };

  function live() {
    return fetch("https://openrouter.ai/api/v1/models").then(function (r) {
      if (!r.ok) throw new Error("openrouter");
      return r.json();
    }).then(function (j) {
      var price = {};
      j.data.forEach(function (m) { price[m.id] = [+m.pricing.prompt, +m.pricing.completion]; });
      function avg(tier, i, o) {
        var c = TIERS[tier].filter(function (id) { return price[id] && (price[id][0] > 0 || price[id][1] > 0); })
          .map(function (id) { return i * price[id][0] + o * price[id][1]; });
        if (!c.length) throw new Error("empty tier " + tier);
        return c.reduce(function (a, b) { return a + b; }, 0) / c.length;
      }
      function basket(rows) { return rows.reduce(function (a, w) { return a + avg(w[0], w[1], w[2]) * w[3]; }, 0); }
      var r1 = function (v) { return Math.round(v * 10) / 10; };
      var cpi = r1(basket(BASKET) / BASELINE * 100);
      var items = [{ date: "Live, today\u2019s prices" }];
      items.push({ t: "$CPI", v: String(cpi), c: chg(cpi - 100), note: "since Feb 2025" });
      var bulk = avg("budget", 2000, 500) / 2500 * 1e6, front = avg("frontier", 2000, 500) / 2500 * 1e6;
      items.push({ t: "$BULK", v: money(bulk), note: "per 1M tokens" });
      items.push({ t: "$FRONT", v: money(front), note: "per 1M tokens" });
      items.push({ t: "$JUDGE", v: money(avg("reasoning", 5000, 2000) / 7000 * 1e6), note: "per 1M tokens" });
      items.push({ t: "$LCTX", v: money(avg("longctx", 50000, 1000) / 51000 * 1e6), note: "per 1M tokens" });
      PERSONAS.forEach(function (p) {
        var v = r1(basket(p[2]) / p[1] * 100);
        items.push({ t: p[0], v: String(v), c: chg(v - 100), note: "since Feb 2025" });
      });
      items.push({ t: "$COG-P", v: money(front - bulk), note: "frontier over budget" });
      return items;
    });
  }

  Promise.allSettled([live(), get("compute-cpi.json"), get("aeai/latest.json"), get("ldi/latest.json")]).then(function (res) {
    var items = [];
    var now = res[0].status === "fulfilled" ? res[0].value : null;
    var cpi = res[1].status === "fulfilled" ? res[1].value : null;
    var aiu = res[2].status === "fulfilled" ? res[2].value : null;
    var ldi = res[3].status === "fulfilled" ? res[3].value : null;
    if (now) {
      items = items.concat(now);
    } else if (cpi) {
      var c = cpi.compute_cpi;
      items.push({ date: day(cpi.meta.generated_at) });
      items.push({ t: c.ticker, v: String(c.value), c: chg(c.mom_change), note: "m/m" });
      ["budget", "frontier", "judgment", "longctx"].forEach(function (k) {
        var s = cpi.subindices && cpi.subindices[k];
        if (s) items.push({ t: s.ticker, v: money(s.value), note: "per 1M tokens" });
      });
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
