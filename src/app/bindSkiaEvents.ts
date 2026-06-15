import type { Container, DisplayObject } from 'pixi.js-legacy';
import { canvasPointFromEvent, hitTestDisplayObject } from '../interaction/skiaHitTest';

function emitPointerEvent(target: DisplayObject, type: 'pointerdown' | 'pointerup'): void {
  // Минимальное синтетическое событие для обработчиков .on()
  target.emit(type, { type, target } as never);
}

/** Подключает pointerDown / pointerUp на Skia-канвасе через hit-test. */
export function bindSkiaPointerEvents(
  canvas: HTMLCanvasElement,
  root: Container,
): void {
  let pressedTarget: ReturnType<typeof hitTestDisplayObject> = null;

  canvas.addEventListener('pointerdown', (event) => {
    const point = canvasPointFromEvent(canvas, event);
    root.updateTransform();
    pressedTarget = hitTestDisplayObject(root, point);

    if (pressedTarget) {
      emitPointerEvent(pressedTarget, 'pointerdown');
    }
  });

  canvas.addEventListener('pointerup', (event) => {
    const point = canvasPointFromEvent(canvas, event);
    root.updateTransform();
    const target = hitTestDisplayObject(root, point) ?? pressedTarget;

    if (target) {
      emitPointerEvent(target, 'pointerup');
    }

    pressedTarget = null;
  });
}
