import { build } from "esbuild";
await build({
  entryPoints: ["src/demo.js"],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2020",
  loader: { ".json": "json" },
  outfile: "../../assets/pbbg-demo.js",
  legalComments: "eof",
});
