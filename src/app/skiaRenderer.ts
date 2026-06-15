import type { Container } from 'pixi.js-legacy';
import type { CanvasKit, Surface } from '@rollerbird/canvaskit-wasm-pdf';
import { convertPixiContainerToSkia } from '../skia/PixiSkiaRenderer';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './createScene';

export interface SkiaRenderer {
  render(container: Container): void;
  dispose(): void;
}

/** Skia-рендерер для второго канваса. */
export function createSkiaRenderer(
  canvas: HTMLCanvasElement,
  ck: CanvasKit,
): SkiaRenderer {
  const surface = ck.MakeSWCanvasSurface(canvas);
  if (!surface) {
    throw new Error('Не удалось создать Skia surface');
  }

  let activeSurface: Surface = surface;

  return {
    render(container: Container) {
      container.updateTransform();

      const skCanvas = activeSurface.getCanvas();
      skCanvas.clear(ck.Color4f(0.96, 0.96, 0.96, 1));
      convertPixiContainerToSkia(container, skCanvas, ck);
      activeSurface.flush();
    },

    dispose() {
      activeSurface.delete();
    },
  };
}

export { CANVAS_WIDTH, CANVAS_HEIGHT };
