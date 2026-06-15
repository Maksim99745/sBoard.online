import type { CanvasKit } from '@rollerbird/canvaskit-wasm-pdf';
import * as CanvasKitModule from '@rollerbird/canvaskit-wasm-pdf';

type CanvasKitInitFn = (options: { locateFile: (file: string) => string }) => Promise<CanvasKit>;

const CanvasKitInit = (
  (CanvasKitModule as { default?: CanvasKitInitFn }).default ?? CanvasKitModule
) as CanvasKitInitFn;

let canvasKitPromise: Promise<CanvasKit> | null = null;

/** Загружает CanvasKit WASM-сборку с поддержкой PDF. */
export function loadCanvasKit(): Promise<CanvasKit> {
  if (!canvasKitPromise) {
    canvasKitPromise = CanvasKitInit({
      locateFile: () => `/canvaskit-pdf.wasm`,
    });
  }

  return canvasKitPromise;
}
