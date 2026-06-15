import { Container, Graphics, Sprite, type DisplayObject } from 'pixi.js-legacy';
import type { CanvasKit, Canvas } from '@rollerbird/canvaskit-wasm-pdf';
import { renderGraphics } from './graphicsMapper';
import { renderSprite } from './spriteMapper';

function applyWorldTransform(canvas: Canvas, displayObject: DisplayObject): void {
  const wt = displayObject.worldTransform;
  canvas.concat([wt.a, wt.c, wt.tx, wt.b, wt.d, wt.ty, 0, 0, 1]);
}

/**
 * Обёртка: рекурсивно обходит PIXI.Container и рисует дочерние объекты в Skia.
 * Поддерживает translate / rotate / scale через worldTransform.
 */
export function convertPixiContainerToSkia(
  container: Container,
  skCanvas: Canvas,
  ck: CanvasKit,
): void {
  for (const child of container.children) {
    if (!child.visible) continue;

    skCanvas.save();
    applyWorldTransform(skCanvas, child);

    if (child instanceof Graphics) {
      renderGraphics(child, skCanvas, ck);
    } else if (child instanceof Sprite) {
      renderSprite(child, skCanvas, ck);
    } else if (child instanceof Container && !(child instanceof Graphics)) {
      convertPixiContainerToSkia(child, skCanvas, ck);
    }

    skCanvas.restore();
  }
}
