import type { CanvasKit } from '@rollerbird/canvaskit-wasm-pdf';

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
