import { Container, Point, type DisplayObject } from 'pixi.js-legacy';

function isInteractive(obj: DisplayObject): boolean {
  return obj.eventMode === 'static' || obj.eventMode === 'dynamic';
}

function containsGlobalPoint(obj: DisplayObject, globalPoint: Point): boolean {
  const localPoint = obj.toLocal(globalPoint);
  const bounds = obj.getLocalBounds();
  return bounds.contains(localPoint.x, localPoint.y);
}

/**
 * Hit-test по дереву DisplayObject (сверху вниз).
 * Работает для Skia-канваса, где нет встроенного interaction manager.
 */
export function hitTestDisplayObject(
  container: Container,
  globalPoint: Point,
): DisplayObject | null {
  container.updateTransform();

  for (let i = container.children.length - 1; i >= 0; i--) {
    const child = container.children[i];
    if (!child.visible) continue;

    if (child instanceof Container) {
      const nested = hitTestDisplayObject(child, globalPoint);
      if (nested) return nested;
    }

    if (!isInteractive(child)) continue;

    if (containsGlobalPoint(child, globalPoint)) {
      return child;
    }
  }

  return null;
}

export function canvasPointFromEvent(
  canvas: HTMLCanvasElement,
  event: PointerEvent,
): Point {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return new Point(
    (event.clientX - rect.left) * scaleX,
    (event.clientY - rect.top) * scaleY,
  );
}
