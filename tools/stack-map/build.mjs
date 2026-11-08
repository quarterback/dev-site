import { build } from "esbuild";
await build({
  entryPoints: ["src/stack-map.jsx"],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2020",
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  outfile: "../../assets/stack-map.js",
  legalComments: "eof",
});
