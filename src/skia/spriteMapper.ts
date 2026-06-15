import type { Sprite } from '@pixi/sprite';
import type { CanvasKit, Canvas, Image } from '@rollerbird/canvaskit-wasm-pdf';

const imageCache = new WeakMap<object, Image>();

function getImageSource(sprite: Sprite): CanvasImageSource | null {
  const resource = sprite.texture.baseTexture.resource as { source?: CanvasImageSource } | undefined;
  return resource?.source ?? null;
}

function getSkiaImage(sprite: Sprite, ck: CanvasKit): Image | null {
  const source = getImageSource(sprite);
  if (!source) return null;

  const cacheKey = sprite.texture.baseTexture;
  const cached = imageCache.get(cacheKey);
  if (cached) return cached;

  const image = ck.MakeImageFromCanvasImageSource(source);
  if (!image) return null;

  imageCache.set(cacheKey, image);
  return image;
}

export function renderSprite(sprite: Sprite, canvas: Canvas, ck: CanvasKit): void {
  const image = getSkiaImage(sprite, ck);
  if (!image) return;

  // Sprite по условию можно оставить bitmap, но трансформации берём от Pixi.
  const width = sprite.texture.orig.width;
  const height = sprite.texture.orig.height;
  const anchorX = sprite.anchor.x * width;
  const anchorY = sprite.anchor.y * height;

  const paint = new ck.Paint();
  paint.setAntiAlias(true);
  paint.setAlphaf(sprite.worldAlpha);

  const src = ck.XYWHRect(0, 0, width, height);
  const dst = ck.XYWHRect(-anchorX, -anchorY, width, height);

  canvas.drawImageRect(image, src, dst, paint, false);
  paint.delete();
}
