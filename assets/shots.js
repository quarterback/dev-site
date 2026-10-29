/* Screenshot preview: hovering a link with data-shot shows that image
   next to the pointer. Only on devices with a real hover; touch screens
   just follow the link. */
(function () {
  if (!window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  var box = document.createElement("div");
  box.className = "shot-pop";
  box.setAttribute("aria-hidden", "true");
  var img = document.createElement("img");
  img.alt = "";
  box.appendChild(img);
  document.body.appendChild(box);
  var W = 420;
  function place(e) {
    var x = e.clientX + 28, y = e.clientY + 20;
    if (x + W > window.innerWidth - 12) x = e.clientX - W - 28;
    var h = box.offsetHeight || 280;
    if (y + h > window.innerHeight - 12) y = window.innerHeight - h - 12;
    box.style.transform = "translate(" + x + "px," + y + "px)";
  }
  document.querySelectorAll("[data-shot]").forEach(function (a) {
    a.addEventListener("mouseenter", function (e) { img.src = a.getAttribute("data-shot"); box.classList.add("is-on"); place(e); });
    a.addEventListener("mousemove", place);
    a.addEventListener("mouseleave", function () { box.classList.remove("is-on"); });
  });
})();
