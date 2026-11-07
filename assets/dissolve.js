/* Pixel dissolve between the home page and Projects (the other room).
   Leaving: the page breaks into squares of the next page's colour, filled
   in random order. Arriving: the new page starts covered in that colour
   and the squares clear in random order. Links opt in with data-dissolve
   ("room" or "home"). Reduced motion, modifier clicks and new-tab clicks
   navigate normally. */
(function () {
  var KEY = "rb-dissolve", CELL = 24, DUR = 560;
  var root = document.documentElement;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function colourFor(target) {
    if (target === "room") return "#1f2bff";
    var coffee = false;
    try { coffee = localStorage.getItem("rb-theme") === "coffee"; } catch (e) {}
    return coffee ? "#432818" : "#fffbfa";
  }

  function run(colour, clearing, done) {
    var c = document.createElement("canvas");
    c.className = "dissolve";
    c.setAttribute("aria-hidden", "true");
    c.width = window.innerWidth; c.height = window.innerHeight;
    c.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;z-index:9999;pointer-events:none";
    root.appendChild(c);
    var x = c.getContext("2d");
    x.fillStyle = colour;
    var cols = Math.ceil(c.width / CELL), rows = Math.ceil(c.height / CELL), n = cols * rows;
    var order = new Array(n);
    for (var k = 0; k < n; k++) order[k] = k;
    for (var j = n - 1; j > 0; j--) { var r = Math.floor(Math.random() * (j + 1)); var t = order[j]; order[j] = order[r]; order[r] = t; }
    if (clearing) x.fillRect(0, 0, c.width, c.height);
    var i = 0, t0 = null;
    function step(now) {
      if (t0 === null) t0 = now;
      var upto = Math.min(n, Math.ceil(n * (now - t0) / DUR));
      for (; i < upto; i++) {
        var cell = order[i], cx = (cell % cols) * CELL, cy = Math.floor(cell / cols) * CELL;
        if (clearing) x.clearRect(cx, cy, CELL, CELL); else x.fillRect(cx, cy, CELL, CELL);
      }
      if (i < n) requestAnimationFrame(step); else done(c);
    }
    requestAnimationFrame(step);
    return c;
  }

  // Arriving
  var arrive = null;
  try { arrive = sessionStorage.getItem(KEY); sessionStorage.removeItem(KEY); } catch (e) {}
  if (arrive) {
    if (reduced) { root.classList.remove("dissolving"); }
    else {
      run(arrive, true, function (c) { c.remove(); });
      root.classList.remove("dissolving");
    }
  }

  // Leaving
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-dissolve]");
    if (!a || reduced || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    var colour = colourFor(a.getAttribute("data-dissolve"));
    try { sessionStorage.setItem(KEY, colour); } catch (err) {}
    run(colour, false, function () { window.location.href = a.href; });
  });

  // Back/forward cache: clear any leftover cover
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      root.classList.remove("dissolving");
      Array.prototype.forEach.call(document.querySelectorAll("canvas.dissolve"), function (c) { c.remove(); });
    }
  });
})();
