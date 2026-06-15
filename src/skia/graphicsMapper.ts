import { SHAPES, type Circle, type Ellipse, type Polygon, type Rectangle, type RoundedRectangle } from '@pixi/core';
import type { Graphics } from '@pixi/graphics';
import type { CanvasKit, Canvas, Paint, Path } from '@rollerbird/canvaskit-wasm-pdf';
import { pixiColorToSkia } from './color';

type GraphicsData = Graphics['geometry']['graphicsData'][number];
type SupportedShape = Circle | Ellipse | Polygon | Rectangle | RoundedRectangle;

function makeFillPaint(ck: CanvasKit, color: number, alpha: number): Paint {
  const paint = new ck.Paint();
  paint.setStyle(ck.PaintStyle.Fill);
  paint.setColor(pixiColorToSkia(ck, color, alpha));
  paint.setAntiAlias(true);
  return paint;
}

function makeStrokePaint(ck: CanvasKit, color: number, alpha: number, width: number): Paint {
  const paint = new ck.Paint();
  paint.setStyle(ck.PaintStyle.Stroke);
  paint.setColor(pixiColorToSkia(ck, color, alpha));
  paint.setStrokeWidth(width);
  paint.setAntiAlias(true);
  return paint;
}

function addPolygonToPath(path: Path, points: number[], close: boolean): void {
  if (points.length < 2) return;

  path.moveTo(points[0], points[1]);
  for (let i = 2; i < points.length; i += 2) {
    path.lineTo(points[i], points[i + 1]);
  }
  if (close) {
    path.close();
  }
}

function createPath(ck: CanvasKit, type: number, shape: SupportedShape): Path | null {
  const path = new ck.Path();

  if (type === SHAPES.POLY) {
    const polygon = shape as Polygon;
    addPolygonToPath(path, polygon.points, polygon.closeStroke);
    return path;
  }

  if (type === SHAPES.RECT) {
    const rect = shape as Rectangle;
    path.addRect(ck.XYWHRect(rect.x, rect.y, rect.width, rect.height));
    return path;
  }

  if (type === SHAPES.CIRC) {
    const circle = shape as Circle;
    path.addCircle(circle.x, circle.y, circle.radius);
    return path;
  }

  if (type === SHAPES.ELIP) {
    const ellipse = shape as Ellipse;
    const left = ellipse.x - ellipse.width / 2;
    const top = ellipse.y - ellipse.height / 2;
    path.addOval(ck.LTRBRect(left, top, left + ellipse.width, top + ellipse.height));
    return path;
  }

  if (type === SHAPES.RREC) {
    const rect = shape as RoundedRectangle;
    const skRect = ck.XYWHRect(rect.x, rect.y, rect.width, rect.height);
    path.addRRect(ck.RRectXY(skRect, rect.radius, rect.radius));
    return path;
  }

  path.delete();
  return null;
}

function drawPathWithStyles(ck: CanvasKit, canvas: Canvas, path: Path, data: GraphicsData, alpha: number): void {
  const fillStyle = data.fillStyle;
  const lineStyle = data.lineStyle;

  if (fillStyle.visible) {
    const paint = makeFillPaint(ck, fillStyle.color | 0, fillStyle.alpha * alpha);
    canvas.drawPath(path, paint);
    paint.delete();
  }

  if (lineStyle.visible) {
    const paint = makeStrokePaint(ck, lineStyle.color | 0, lineStyle.alpha * alpha, lineStyle.width);
    canvas.drawPath(path, paint);
    paint.delete();
  }
}

function applyDataMatrix(canvas: Canvas, data: GraphicsData): void {
  if (!data.matrix) return;

  const matrix = data.matrix;
  canvas.concat([matrix.a, matrix.c, matrix.tx, matrix.b, matrix.d, matrix.ty, 0, 0, 1]);
}

export function renderGraphics(
  graphics: Graphics,
  canvas: Canvas,
  ck: CanvasKit,
): void {
  const worldAlpha = graphics.worldAlpha;
  const graphicsData = graphics.geometry.graphicsData;

  for (const data of graphicsData) {
    // В PDF эти Path остаются векторными, в отличие от Sprite.
    const path = createPath(ck, data.type, data.shape as SupportedShape);
    if (!path) continue;

    canvas.save();
    applyDataMatrix(canvas, data);
    drawPathWithStyles(ck, canvas, path, data, worldAlpha);
    canvas.restore();
    path.delete();
  }
}
