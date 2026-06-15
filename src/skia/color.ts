import type { CanvasKit } from '@rollerbird/canvaskit-wasm-pdf';

/** Конвертирует цвет Pixi (0xRRGGBB) в Skia Color4f. */
export function pixiColorToSkia(
  ck: CanvasKit,
  color: number,
  alpha: number,
): Float32Array {
  const r = ((color >> 16) & 0xff) / 255;
  const g = ((color >> 8) & 0xff) / 255;
  const b = (color & 0xff) / 255;
  return ck.Color4f(r, g, b, alpha);
}
