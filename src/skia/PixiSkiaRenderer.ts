import { Container, Graphics, Sprite, type DisplayObject } from 'pixi.js-legacy';
import type { CanvasKit, Canvas } from '@rollerbird/canvaskit-wasm-pdf';
import { renderGraphics } from './graphicsMapper';
import { renderSprite } from './spriteMapper';

function applyLocalTransform(canvas: Canvas, displayObject: DisplayObject): void {
  const transform = displayObject.localTransform;
  canvas.concat([transform.a, transform.c, transform.tx, transform.b, transform.d, transform.ty, 0, 0, 1]);
}

function renderDisplayObject(displayObject: DisplayObject, skCanvas: Canvas, ck: CanvasKit): void {
  if (!displayObject.visible) return;

  skCanvas.save();
  // Идём по дереву рекурсивно, поэтому применяем именно локальную матрицу.
  applyLocalTransform(skCanvas, displayObject);

  if (displayObject instanceof Graphics) {
    renderGraphics(displayObject, skCanvas, ck);
  } else if (displayObject instanceof Sprite) {
    renderSprite(displayObject, skCanvas, ck);
  } else if (displayObject instanceof Container) {
    for (const child of displayObject.children) {
      renderDisplayObject(child, skCanvas, ck);
    }
  }

  skCanvas.restore();
}

export function convertPixiContainerToSkia(
  container: Container,
  skCanvas: Canvas,
  ck: CanvasKit,
): void {
  renderDisplayObject(container, skCanvas, ck);
}
