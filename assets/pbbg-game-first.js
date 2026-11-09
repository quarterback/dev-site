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

  const instruction = document.createElement("p");
  instruction.className = "pd-workshop-intro";
  instruction.textContent = "Select a line to see its source. Change text or an action cost to test the checker.";
  workshop.prepend(instruction);

  const opening = document.createElement("section");
  opening.className = "pd-opening";
  opening.setAttribute("aria-label", "Coalition content example");
  opening.innerHTML =
    "<figure class='pd-game'>" +
      "<img src='../assets/coalition/play.webp' loading='lazy' alt='Coalition game screen showing a house at dusk, the escape clock and available moves.'>" +
    "</figure>" +
    "<div class='pd-brief'>" +
      "<p>I built PBBG Content Schema while developing Coalition with coding agents. It defines how scenes, interface text, game rules, and writing policies relate, so agents can follow those connections when adding content instead of reconstructing them from scattered files.</p>" +
      "<button type='button' class='pd-reveal' aria-expanded='false' aria-controls='pd-workshop'>Inspect the scene</button>" +
      "<p class='pd-game-link'><a href='/projects/coalition.html'>Coalition project</a></p>" +
    "</div>";
  root.append(opening, workshop);
  if (!location.pathname.includes("/projects/")) {
    const link = opening.querySelector(".pd-game-link a");
    link.href = "/projects/pbbg-content-schema.html";
    link.textContent = "How I built it";
  }

  const reveal = opening.querySelector(".pd-reveal");
  const motionReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function openInspector(focusScene = false) {
    workshop.hidden = false;
    reveal.setAttribute("aria-expanded", "true");
    reveal.textContent = "Close the inspector";
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
      reveal.textContent = "Inspect the scene";
      reveal.focus();
    }
  });


  // The original inspector already labels the fields and error cases.
  // Keep those controls as written; the entry paragraph carries the explanation.

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
      help.textContent = "This entry defines the selected text. Linked facts, entities and action costs appear below.";
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
