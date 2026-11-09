/* Coalition run-through. The recording is one real run of the game, 61 seconds.
   Each chapter is a time in the video and the note that goes with it. The note
   panel follows the playhead; a chapter button jumps to its time; one button
   plays and pauses. Nothing here is simulated: the video is the game. */
(() => {
  "use strict";
  const root = document.getElementById("runthrough");
  if (!root) return;
  const video = root.querySelector("video");
  const play = root.querySelector(".rt__play");
  const note = root.querySelector(".rt__note");
  const chapters = [...root.querySelectorAll(".rt__chapters button")];
  if (!video || !play || !note || !chapters.length) return;

  const times = chapters.map((b) => parseFloat(b.dataset.t));
  let current = -1;

  function show(i) {
    if (i === current) return;
    current = i;
    const b = chapters[i];
    note.innerHTML = "<b>" + b.querySelector("time").textContent + " · " + b.dataset.title + "</b><p>" + b.dataset.note + "</p>";
    chapters.forEach((c, j) => c.setAttribute("aria-current", j === i ? "true" : "false"));
  }
  function sync() {
    const t = video.currentTime;
    let i = 0;
    for (let j = 0; j < times.length; j++) if (t + 0.05 >= times[j]) i = j;
    show(i);
  }
  function setPlaying(on) { play.textContent = on ? "Pause" : "Play"; play.setAttribute("aria-pressed", on ? "true" : "false"); }

  video.addEventListener("timeupdate", sync);
  video.addEventListener("seeked", sync);
  video.addEventListener("play", () => setPlaying(true));
  video.addEventListener("pause", () => setPlaying(false));
  video.addEventListener("ended", () => { setPlaying(false); });
  play.addEventListener("click", () => { if (video.paused) video.play(); else video.pause(); });
  chapters.forEach((b, i) => b.addEventListener("click", () => { video.currentTime = times[i]; show(i); if (video.paused) video.play(); }));
  video.addEventListener("click", () => { if (video.paused) video.play(); else video.pause(); });

  // Start when the section scrolls into view, unless the reader asked for less motion. Muted, so browsers allow it.
  show(0); setPlaying(false);
  const still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!still && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting && video.paused && video.currentTime === 0) video.play().catch(() => {}); });
    }, { threshold: 0.3 });
    io.observe(video);
  }
})();
