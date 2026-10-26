# Editorial policy for ronbronson.dev

This document belongs to Ron Bronson. His latest explicit instruction takes precedence over anything here, over any linter finding, and over any agent's judgment.

## Purpose and audience

- **Publisher or author:** Ron Bronson.
- **Primary readers and tasks:** engineers, and people checking whether he builds or only talks. Someone who followed a link from a project, a conference organiser confirming he ships, a collaborator evaluating a protocol experiment.
- **What this publication should help people accomplish:** find a working thing, understand the problem it solves, and see what his own contribution to it was.
- **Source of approved product facts:** each project's own page in `projects/`, and `atproto/index.html` for protocol work status.

## Voice and register

**A representative paragraph we want to preserve**, from the live site:

> An invented gridiron sport with its own rulebook, a probability engine that plays it, a 280-team universe to play it in, and a terminal-style stats portal serving the whole thing.

**Language we deliberately use:** concrete nouns and counts. What it is, who it is for, what it took. "Directed agent build" where that is what happened, with the split between technical direction and agent-authored code stated rather than blurred.

**Language we avoid:** claims of adoption, usage, or traction that nobody measured.

## Page responsibilities

| Type | Reader question and job | Required sections | Primary source |
| --- | --- | --- | --- |
| Home | "What has he actually shipped?" | the catalogue, each card with status, audience, and his contribution | the project pages |
| Project | "How does this work and what did he decide?" | problem, model, what shipped, what changed after release | the project itself |

## The specs rows, and the one that is missing

Each project card carries `Status`, `Audience`, and `My contribution`. There is deliberately **no `Adoption` row**. The editorial reference says to report metrics only when measured, and no verified usage figure exists for these. Add the row to a project when a real number does. Never add it as a placeholder.

`Status` is a claim about the world. "Live" means live today. Check it before a release, and change it when a project goes quiet.

**This site is the proof that software shipped.** The service practice belongs on ronbronson.design; the person belongs on ronbronson.com.

## Writing mechanics

Conventions taken from Ron's existing corpus, not imposed on it.

| Convention | Ruling | Why |
| --- | --- | --- |
| Contractions | Use them in first person | Every first-person page already does: "I'm a systems designer", "Build what's missing". Copy without them reads as written by someone else. This is the fastest tell that an agent wrote a section. |
| Em dashes | Allowed | Used throughout the corpus by choice. `STYLE-04` is **off** in `.editorial.json` for this reason; it alone produced 94% of the findings on first run. The humanizer skill defers to the writer's sample on dashes, and this is the sample. |
| Dates | Day first: "22 October 2026" | Every colophon and the career register use it. `STYLE-05` is **off** for this reason. Keep `talks.html` style dates ("Sep. 2025") as they are. |
| Serial comma | Use it | "content strategy, information architecture, digital services, governance, and delivery leadership". |
| Headings | Sentence case, name the subject | `STYLE-07` is on. A heading reading "Overview" fails it, and should. |
| Numbers | Spell out in prose where the corpus does ("more than a hundred people signed up"), figures where precision is the point ("more than 40 designers", "400+ engagements") | Both patterns are already in use and both are deliberate. |
| Person | First person on the live pages, third person in meta descriptions and OG tags | Already the split across all three sites. |

## Factual fidelity and decisions

**Evidence states.** Every claim about Ron's record sits in one of these, and the state decides how it may be written:

| State | How it may appear |
| --- | --- |
| Documented | Stated plainly. Backed by a performance plan, a public artifact, or a published page. |
| Firsthand account | Stated plainly, but flagged in the AAR so Ron can confirm before a page ships. |
| Plausible interpretation | Not published until Ron confirms it. |
| Needs verification | Not published. |

**Decisions an agent may not revise on its own:**

- Positioning. Which of the three sites makes which argument is set by rule 7 of the 25 October editorial reference: masthead is the person and the worldview, `.design` is a service practice, `.dev` is proof that software shipped.
- Any claim of authority held: headcount set, hiring approved, who he advised, what he was accountable for.
- Any project's status. "Live" is a claim about the world, not a style choice.
- Any number. A figure may be carried from existing copy or from the career register. It may not be rounded, upgraded, or invented.
- Whether Ron founded Vloora or works with it. The sites currently disagree and only he can settle it.

**Where a human decision is required:** any new claim about his record, any change to a status, and any copy that would make one site say what another site is supposed to say.

## How the checks run

```sh
# what CI runs: changed files only
npx prosekeep@0.3.0 check --changed --base origin/main

# the whole repo
npx prosekeep@0.3.0 check .

# plain language, on the rendered copy rather than the markup
npx plain-language-default@0.1.0 check <extracted-copy>.md
```

`plain-as-day` reads a file as prose. Pointed straight at an HTML page it scores the markup and the inline scripts, so extract the rendered visible text first and terminate headings, buttons, and definition-list rows with a full stop. Without that it runs the next sentence onto the previous block and reports long sentences no reader ever sees.

A passing check proves nothing about accuracy, voice, or whether a claim is true. It only means no pattern matched.
