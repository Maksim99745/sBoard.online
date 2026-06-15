import type { CanvasKit } from '@rollerbird/canvaskit-wasm-pdf';
import * as CanvasKitModule from '@rollerbird/canvaskit-wasm-pdf';

type CanvasKitInitFn = (options: { locateFile: (file: string) => string }) => Promise<CanvasKit>;

const CanvasKitInit = (
  (CanvasKitModule as { default?: CanvasKitInitFn }).default ?? CanvasKitModule
) as CanvasKitInitFn;

let canvasKitPromise: Promise<CanvasKit> | null = null;

export function loadCanvasKit(): Promise<CanvasKit> {
  if (!canvasKitPromise) {
    canvasKitPromise = CanvasKitInit({
      // postinstall кладёт сюда сборку CanvasKit с PDF backend.
      locateFile: () => `/canvaskit-pdf.wasm`,
    });
  }

  return canvasKitPromise;
}
