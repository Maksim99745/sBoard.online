import { SHAPES, type Circle, type Ellipse, type Polygon, type Rectangle, type RoundedRectangle } from '@pixi/core';
import type { Graphics } from '@pixi/graphics';
import type { CanvasKit, Canvas, Paint, Path } from '@rollerbird/canvaskit-wasm-pdf';
import { pixiColorToSkia } from './color';

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

function drawEllipsePath(ck: CanvasKit, path: Path, shape: Ellipse): void {
  const left = shape.x - shape.width / 2;
  const top = shape.y - shape.height / 2;
  path.addOval(ck.LTRBRect(left, top, left + shape.width, top + shape.height));
}

/** Рисует PIXI.Graphics на Skia-canvas с учётом мировой матрицы. */
export function renderGraphics(
  graphics: Graphics,
  canvas: Canvas,
  ck: CanvasKit,
): void {
  const worldAlpha = graphics.worldAlpha;
  const graphicsData = graphics.geometry.graphicsData;

  for (const data of graphicsData) {
    const shape = data.shape;
    const fillStyle = data.fillStyle;
    const lineStyle = data.lineStyle;
    const fillColor = data.fillStyle.color | 0;
    const lineColor = data.lineStyle.color | 0;

    canvas.save();

    if (data.matrix) {
      const m = data.matrix;
      canvas.concat([m.a, m.c, m.tx, m.b, m.d, m.ty, 0, 0, 1]);
    }

    if (data.type === SHAPES.POLY) {
      const polygon = shape as Polygon;
      const path = new ck.Path();
      addPolygonToPath(path, polygon.points, polygon.closeStroke);

      if (fillStyle.visible) {
        const fillPaint = makeFillPaint(ck, fillColor, fillStyle.alpha * worldAlpha);
        canvas.drawPath(path, fillPaint);
        fillPaint.delete();
      }

      if (lineStyle.visible) {
        const strokePaint = makeStrokePaint(
          ck,
          lineColor,
          lineStyle.alpha * worldAlpha,
          lineStyle.width,
        );
        canvas.drawPath(path, strokePaint);
        strokePaint.delete();
      }

      path.delete();
    } else if (data.type === SHAPES.RECT) {
      const rect = shape as Rectangle;

      if (fillStyle.visible) {
        const fillPaint = makeFillPaint(ck, fillColor, fillStyle.alpha * worldAlpha);
        canvas.drawRect(ck.XYWHRect(rect.x, rect.y, rect.width, rect.height), fillPaint);
        fillPaint.delete();
      }

      if (lineStyle.visible) {
        const strokePaint = makeStrokePaint(
          ck,
          lineColor,
          lineStyle.alpha * worldAlpha,
          lineStyle.width,
        );
        canvas.drawRect(ck.XYWHRect(rect.x, rect.y, rect.width, rect.height), strokePaint);
        strokePaint.delete();
      }
    } else if (data.type === SHAPES.CIRC) {
      const circle = shape as Circle;
      const path = new ck.Path();
      path.addCircle(circle.x, circle.y, circle.radius);

      if (fillStyle.visible) {
        const fillPaint = makeFillPaint(ck, fillColor, fillStyle.alpha * worldAlpha);
        canvas.drawPath(path, fillPaint);
        fillPaint.delete();
      }

      if (lineStyle.visible) {
        const strokePaint = makeStrokePaint(
          ck,
          lineColor,
          lineStyle.alpha * worldAlpha,
          lineStyle.width,
        );
        canvas.drawPath(path, strokePaint);
        strokePaint.delete();
      }

      path.delete();
    } else if (data.type === SHAPES.ELIP) {
      const ellipse = shape as Ellipse;
      const path = new ck.Path();
      drawEllipsePath(ck, path, ellipse);

      if (fillStyle.visible) {
        const fillPaint = makeFillPaint(ck, fillColor, fillStyle.alpha * worldAlpha);
        canvas.drawPath(path, fillPaint);
        fillPaint.delete();
      }

      if (lineStyle.visible) {
        const strokePaint = makeStrokePaint(
          ck,
          lineColor,
          lineStyle.alpha * worldAlpha,
          lineStyle.width,
        );
        canvas.drawPath(path, strokePaint);
        strokePaint.delete();
      }

      path.delete();
    } else if (data.type === SHAPES.RREC) {
      const roundRect = shape as RoundedRectangle;
      const path = new ck.Path();
      path.addRRect(
        ck.RRectXY(ck.XYWHRect(roundRect.x, roundRect.y, roundRect.width, roundRect.height), roundRect.radius, roundRect.radius),
      );

      if (fillStyle.visible) {
        const fillPaint = makeFillPaint(ck, fillColor, fillStyle.alpha * worldAlpha);
        canvas.drawPath(path, fillPaint);
        fillPaint.delete();
      }

      if (lineStyle.visible) {
        const strokePaint = makeStrokePaint(
          ck,
          lineColor,
          lineStyle.alpha * worldAlpha,
          lineStyle.width,
        );
        canvas.drawPath(path, strokePaint);
        strokePaint.delete();
      }

      path.delete();
    }

    canvas.restore();
  }
}
