# Agent Action Record: descriptions and Open Graph

**Review date:** 2 November 2026
**Agent / system:** Claude Code (cloud session), on `claude/magical-faraday-uqz6vn`
**Accountable human:** Ron Bronson (owner)

## 1. Intent

> Fix the meta descriptions across the sites and opengraph

## 2. Action

- Before this change, only `work-with-me.html` had Open Graph tags. Now all 20 real pages carry one consistent block: description, canonical, Open Graph, and a large-image Twitter card using `assets/social-card.png`.
- **Home page title:** "Ron Bronson | Agent tooling, simulations and software", replacing "Serious play, models and simulations".
- **Home page description:** "Ron Bronson builds agent tooling, games, simulations and data products. He also designs tabletop exercises and policy simulations for organizations facing difficult decisions."
- The STAND-IN comment on the title is removed.
- **Work with me:** the title and description say "tabletop exercises, policy simulations and strategic foresight" in place of wargaming, matching the home page. Its social title and description, "Practice the Future Before It Arrives", are Ron's and unchanged.
- **404:** a description and `noindex`.
- **Project pages:** every description is unchanged; they gained canonical links and Open Graph tags.

## 3. Judgment

- **Left alone:** the three redirect stubs (`finnish-baseball-game-design`, `parliament-of-neighbors`, `varsityapex`). They forward elsewhere and have canonical links to their targets.
- **Hyphens:** several existing project descriptions contain hyphenated compounds ("single-file", "salary-cap", "co-ed"). They're Ron's copy, so they're unchanged even though the house rule bars dashes.
- **Domain:** `ronbronson.dev` redirects (307) to `www.ronbronson.dev`, but canonical links use the non-www address.
