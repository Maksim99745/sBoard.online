import type { CanvasKit } from '@rollerbird/canvaskit-wasm-pdf';
import CanvasKitInit from '@rollerbird/canvaskit-wasm-pdf';

let canvasKitPromise: Promise<CanvasKit> | null = null;

/** Загружает CanvasKit WASM-сборку с поддержкой PDF. */
export function loadCanvasKit(): Promise<CanvasKit> {
  if (!canvasKitPromise) {
    canvasKitPromise = CanvasKitInit({
      locateFile: () => `/canvaskit-pdf.wasm`,
    }) as Promise<CanvasKit>;
  }

  return canvasKitPromise;
}
