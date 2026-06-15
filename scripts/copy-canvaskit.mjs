import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = resolve(
  root,
  'node_modules/html2pdf-skia/node_modules/@rollerbird/canvaskit-wasm-pdf/bin',
);
const publicDir = resolve(root, 'public');
const wasmSource = resolve(sourceDir, 'canvaskit-pdf.wasm');

if (!existsSync(wasmSource)) {
  console.warn('[copy-canvaskit] WASM не найден, пропускаем копирование');
  process.exit(0);
}

mkdirSync(publicDir, { recursive: true });
copyFileSync(wasmSource, resolve(publicDir, 'canvaskit-pdf.wasm'));
console.log('[copy-canvaskit] canvaskit-pdf.wasm скопирован в public/');
