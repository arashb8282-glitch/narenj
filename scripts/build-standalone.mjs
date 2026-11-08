import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const distAssets = path.join(root, 'dist', 'assets');
const outDir = path.join(root, 'docs');

fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(distAssets);
const cssFile = files.find((f) => f.endsWith('.css'));
const jsFile = files.find((f) => f.endsWith('.js'));

if (!cssFile || !jsFile) {
  throw new Error('Missing compiled CSS or JS in dist/assets. Run vite build first.');
}

let css = fs.readFileSync(path.join(distAssets, cssFile), 'utf8');
const js = fs.readFileSync(path.join(distAssets, jsFile), 'utf8');
const markSvg = fs.readFileSync(path.join(root, 'public', 'illustrations', 'roshana-mark.svg'));
const markDataUri = `data:image/svg+xml;base64,${markSvg.toString('base64')}`;

const fontToDataUri = (filename, mime) => {
  const buf = fs.readFileSync(path.join(root, 'public', 'fonts', filename));
  return `data:${mime};base64,${buf.toString('base64')}`;
};

const regularUri = fontToDataUri('AbarLow-Regular.woff2', 'font/woff2');
const lightUri = fontToDataUri('AbarLow-Light.woff2', 'font/woff2');
const mediumUri = fontToDataUri('AbarLow-Medium.woff2', 'font/woff2');
const semiBoldUri = fontToDataUri('AbarLow-SemiBold.woff2', 'font/woff2');
const boldUri = fontToDataUri('AbarLow-Bold.woff', 'font/woff');

// Replace dual-url @font-face declarations first to avoid duplicating base64 payloads
css = css.replace(
  /url\(\/fonts\/AbarMidFaNum-Regular\.woff2\)\s*format\(["']woff2["']\),\s*url\(\/fonts\/AbarLow-Regular\.woff2\)\s*format\(["']woff2["']\)/g,
  `url("${regularUri}") format("woff2")`
);
css = css.replace(
  /url\(\/fonts\/AbarMidFaNum-SemiBold\.woff2\)\s*format\(["']woff2["']\),\s*url\(\/fonts\/AbarLow-SemiBold\.woff2\)\s*format\(["']woff2["']\)/g,
  `url("${semiBoldUri}") format("woff2")`
);
css = css.replace(/\/fonts\/AbarLow-Light\.woff2/g, lightUri);
css = css.replace(/\/fonts\/AbarLow-Medium\.woff2/g, mediumUri);
css = css.replace(/\/fonts\/AbarLow-Bold\.woff/g, boldUri);
css = css.replace(/\/fonts\/AbarMidFaNum-Regular\.woff2/g, regularUri);
css = css.replace(/\/fonts\/AbarLow-Regular\.woff2/g, regularUri);
css = css.replace(/\/fonts\/AbarMidFaNum-SemiBold\.woff2/g, semiBoldUri);
css = css.replace(/\/fonts\/AbarLow-SemiBold\.woff2/g, semiBoldUri);

// Safely escape any closing script sequence inside JS string literals
const safeJs = js.replace(/<\/script/gi, '<\\/script');

const html = `<!doctype html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>روشنا | پلتفرم یادگیری و تمرین مهارت (Roshana Interactive Prototype)</title>
    <link rel="icon" type="image/svg+xml" href="${markDataUri}" />
    <style>${css}</style>
  </head>
  <body class="bg-canvas text-ink-900 antialiased selection:bg-brand-100 selection:text-brand-700">
    <div id="root"></div>
    <script>window.__ROSHANA_STANDALONE__ = true;</script>
    <script type="module">${safeJs}</script>
  </body>
</html>
`;

fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
fs.writeFileSync(path.join(outDir, '.nojekyll'), '', 'utf8');
console.log(
  `Built standalone docs/index.html (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB)`
);
