/* Game-first presentation for the existing PBBG/Coalition inspector.
   The original renderer, validator, and controls remain in pbbg-demo.js. */
(() => {
  "use strict";
  const root = document.getElementById("pbbg-demo");
  if (!root || !root.querySelector(".pd-bar") || root.querySelector(".pd-opening")) return;

  const workshop = document.createElement("section");
  workshop.className = "pd-workshop";
  workshop.id = "pd-workshop";
  workshop.hidden = true;
  workshop.setAttribute("aria-label", "Coalition content inspector");

  // Move the initialized nodes. Their event listeners and live data stay intact.
  [...root.children].forEach((node) => workshop.appendChild(node));

  const explanation = document.createElement("div");
  explanation.className = "pd-workshop-intro";
  explanation.innerHTML = "<h3>A scene in four parts</h3>" +
    "<p>Switch roles to see different information. Select a line to inspect its source. Then change dialogue or an action cost.</p>";
  workshop.prepend(explanation);

  const opening = document.createElement("section");
  opening.className = "pd-opening";
  opening.setAttribute("aria-labelledby", "pd-entry-title");
  opening.innerHTML =
    "<figure class='pd-game'>" +
      "<img src='../assets/coalition/play.webp' loading='lazy' alt='Coalition game screen: a pixel-art house at dusk, parked cars, an escape clock, choices, cards and a phone message.'>" +
      "<figcaption>Coalition, the game that led to PBBG Content Schema. This is a screenshot of the playable game.</figcaption>" +
      "<button type='button' class='pd-from-screen'>Inspect the residence scene</button>" +
    "</figure>" +
    "<div class='pd-brief'>" +
      "<h2 id='pd-entry-title'>What happens when an agent edits a game?</h2>" +
      "<p>In Coalition, actions cost hours, depend on cards, and can draw police attention. When I asked agents to edit dialogue, they sometimes changed a button or game rule.</p>" +
      "<p>I built PBBG Content Schema to separate story text, interface labels, game rules, and writing policy. Open the scene to inspect those records and try changing them.</p>" +
      "<button type='button' class='pd-reveal' aria-expanded='false' aria-controls='pd-workshop'>Take the scene apart</button>" +
      "<p class='pd-game-link'><a href='/projects/coalition.html'>Read about Coalition</a></p>" +
    "</div>";
  root.append(opening, workshop);

  const reveal = opening.querySelector(".pd-reveal");
  const motionReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function openInspector(focusScene = false) {
    workshop.hidden = false;
    reveal.setAttribute("aria-expanded", "true");
    reveal.textContent = "Hide the content inspector";
    if (focusScene) {
      // Reuse the original source-inspection handler.
      const scene = workshop.querySelector('[data-id="residence.arrive"]');
      if (scene) scene.click();
    }
    workshop.scrollIntoView({ block: "start", behavior: motionReduced() ? "auto" : "smooth" });
  }
  reveal.addEventListener("click", () => {
    if (workshop.hidden) openInspector();
    else {
      workshop.hidden = true;
      reveal.setAttribute("aria-expanded", "false");
      reveal.textContent = "Take the scene apart";
      reveal.focus();
    }
  });
  opening.querySelector(".pd-from-screen").addEventListener("click", () => openInspector(true));

  const editControls = workshop.querySelector(".pd-tools");
  if (editControls) {
    const editIntro = document.createElement("div");
    editIntro.className = "pd-edit-intro";
    editIntro.innerHTML = "<h3>Change one part</h3>" +
      "<p>Move the hours slider to change the time shown in the scene. Edit Gianlūka's dialogue to see that the action costs stay the same.</p>";
    editControls.before(editIntro);
  }
  const breakButtons = workshop.querySelector(".pd-breaks");
  if (breakButtons) {
    const breakIntro = document.createElement("div");
    breakIntro.className = "pd-edit-intro";
    breakIntro.innerHTML = "<h3>Introduce an error</h3>" +
      "<p>Break a placeholder, reference, or writing rule. The PBBG checker names the error and blocks the invalid example.</p>";
    const label = breakButtons.previousElementSibling;
    if (label?.classList.contains("pd-small")) label.replaceWith(breakIntro);
    else breakButtons.before(breakIntro);
  }

  // The original diagnostic panel uses validateBundle. Summarize that actual
  // result without changing the checks or claiming the example is the game.
  const diagnostics = workshop.querySelector(".pd-diag");
  if (diagnostics) {
    const verdict = document.createElement("p");
    verdict.className = "pd-verdict";
    verdict.setAttribute("role", "status");
    verdict.setAttribute("aria-live", "polite");
    diagnostics.before(verdict);
    const inspector = workshop.querySelector(".pd-inspect");
    if (inspector) {
      const help = document.createElement("p");
      help.className = "pd-inspect-explain";
      help.textContent = "This entry defines the selected text. Linked facts, entities, and action costs appear below.";
      inspector.querySelector("pre")?.before(help);
      const explanations = {
        "residence.arrive": "The residence description is story text. It doesn't set action costs.",
        "aide.line": "Edit Gianlūka's words without changing the action data.",
        "decoy.label": "The button label follows the action-label writing policy.",
        "decoy.takes": "The time comes from the decoy action's cost. The label holds no separate number.",
        "gov.brief": "The investigator sees the reported location. Referring to the candidate's hidden location would fail the visibility check."
      };
      const updateExplanation = (id) => {
        help.textContent = explanations[id] ||
          "This is the content entry for the selected text. Its references below point to the facts, entities, or action costs that supply its values.";
      };
      root.addEventListener("click", (event) => {
        const line = event.target.closest(".pd-el");
        if (line) updateExplanation(line.dataset.id);
      });
      root.addEventListener("keydown", (event) => {
        const line = event.target.closest(".pd-el");
        if (line && (event.key === "Enter" || event.key === " ")) updateExplanation(line.dataset.id);
      });
    }
    function updateVerdict() {
      const blocking = Boolean(workshop.querySelector(".pd-stopped"));
      const count = diagnostics.querySelectorAll("li").length;
      verdict.className = "pd-verdict " + (blocking ? "is-failed" : "is-passed");
      verdict.textContent = blocking
        ? "Validation blocked: " + count + " finding" + (count === 1 ? "" : "s") +
          ". Coalition's CI rejects builds that fail the PBBG check."
        : count
          ? "The checker found " + count + " nonblocking finding" + (count === 1 ? "" : "s") + "."
          : "This example passes validation. Coalition's CI checks its exported content on every build.";
    }
    new MutationObserver(updateVerdict).observe(diagnostics, { childList: true, subtree: true, characterData: true });
    new MutationObserver(updateVerdict).observe(workshop.querySelector(".pd-stage"), { childList: true, subtree: true });
    updateVerdict();
  }
})();
