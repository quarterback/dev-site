/* Pull tab: a thin strip of the Projects room at the page edge (bottom edge
   on phones). Drag it in; past a third of the screen it opens Projects
   through the pixel dissolve (assets/dissolve.js); let go early and it slides
   back. A click or Enter is an ordinary link. */
(() => {
  const pull = document.getElementById("pull");
  if (!pull) return;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const phone = () => matchMedia("(max-width: 860px)").matches;
  const rest = () => (phone() ? pull.offsetHeight : pull.offsetWidth);
  const full = () => (phone() ? innerHeight : innerWidth);
  let start = null, size = 0, moved = 0, base = 0;
  function set(px) {
    size = Math.max(base, Math.min(full(), px));
    pull.style[phone() ? "height" : "width"] = size + "px";
    pull.classList.toggle("is-open", size > base + 24);
  }
  function clear() { pull.style.width = ""; pull.style.height = ""; pull.classList.remove("is-open", "is-drag"); }
  function animateTo(target, done) {
    if (still) { set(target); done(); return; }
    const from = size, t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / 200), e = 1 - Math.pow(1 - k, 3); set(from + (target - from) * e); if (k < 1) requestAnimationFrame(step); else done(); };
    requestAnimationFrame(step);
  }
  pull.addEventListener("dragstart", (e) => e.preventDefault());
  pull.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    base = rest(); size = base; moved = 0;
    start = phone() ? e.clientY : e.clientX;
    pull.setPointerCapture(e.pointerId); pull.classList.add("is-drag");
  });
  pull.addEventListener("pointermove", (e) => {
    if (start == null) return;
    const p = phone() ? e.clientY : e.clientX;
    moved = Math.max(moved, Math.abs(p - start));
    if (moved > 4) set(base + (start - p));
  });
  const end = () => {
    if (start == null) return;
    start = null;
    if (moved <= 4) { clear(); return; }               // a tap: the click below follows the link
    if (size > full() / 3) animateTo(full(), () => pull.click());
    else animateTo(base, clear);
  };
  pull.addEventListener("pointerup", end);
  pull.addEventListener("pointercancel", end);
  // A drag that falls short shouldn't also follow the link.
  pull.addEventListener("click", (e) => { if (moved > 4 && size < full()) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);
  addEventListener("pageshow", clear);
})();
