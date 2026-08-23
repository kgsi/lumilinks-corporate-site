/**
 * GlobalHeader.astro のインラインロゴから、配布用のロゴアセットを生成する。
 * ロゴを差し替えたら `npm run brand:assets` で再生成する。
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'src/components/GlobalHeader.astro');
const outDir = join(root, 'public/brand');

/** 書き出す PNG の横幅（px）。縦幅は viewBox の比率から決まる。 */
const PNG_WIDTH = 1600;

const VARIANTS = [
  { name: 'lumilinks-logo-black', color: '#000000' },
  { name: 'lumilinks-logo-white', color: '#ffffff' },
];

const astro = await readFile(source, 'utf8');
const svgBlock = astro.match(/<svg[\s\S]*?<\/svg>/);
if (!svgBlock) {
  throw new Error(`${source} からロゴの <svg> を取得できませんでした`);
}

// <svg> の中身（path / rect）だけを取り出し、Astro の閉じタグ表記を自己終了形に整える
const shapes = svgBlock[0]
  .replace(/^<svg[\s\S]*?>/, '')
  .replace(/<\/svg>$/, '')
  .replace(/><\/(path|rect)>/g, ' />')
  .replace(/\s+/g, ' ')
  .replace(/> </g, '>\n  <')
  .trim();

const buildSvg = (color) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="179" height="34" viewBox="0 0 179 34" fill="none" role="img" aria-label="Lumilinks">
  <title>Lumilinks</title>
  ${shapes.replace(/fill="currentColor"/g, `fill="${color}"`)}
</svg>
`;

await mkdir(outDir, { recursive: true });

for (const { name, color } of VARIANTS) {
  const svg = buildSvg(color);
  await writeFile(join(outDir, `${name}.svg`), svg, 'utf8');
  await sharp(Buffer.from(svg), { density: 900 })
    .resize({ width: PNG_WIDTH })
    .png({ compressionLevel: 9 })
    .toFile(join(outDir, `${name}.png`));
  console.log(`generated: ${name}.svg / ${name}.png`);
}
