# Stack map

Source for `assets/stack-map.js`, the draggable project map on `projects.html`.

```sh
cd tools/stack-map
npm install
npm run build
```

The build bundles React and [Dragology](https://github.com/declarative-dragging/dragology) into one minified file, so the site itself still has no build step. The page loads the script only at widths above 860px. Phones get the project list, and readers without JavaScript get the old SVG map.

The project and technique pairings live in `src/stack-map.jsx` (`PROJECTS`). Edit them there, rebuild, and commit both files.

Dragology is MIT licensed. Cite the paper: Joshua Horowitz, Andrew Blinn and Jeffrey Heer, "Declarative Dragging," UIST 2026.

## Hall of Fame line

`src/hof-line.jsx` is bundled into the same `assets/stack-map.js`, so the page loads React once. It mounts on `#hof-line` in the Under the hood section of projects.html and fetches `assets/uth/hof-line.json`. Data notes are in `hof-data/README.md`.
