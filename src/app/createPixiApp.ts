import { Application } from 'pixi.js-legacy';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './createScene';

/** Создаёт Pixi Application с CanvasRenderer (forceCanvas). */
export function createPixiApp(view: HTMLCanvasElement): Application {
  const app = new Application({
    view,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    forceCanvas: true,
    backgroundColor: 0xf5f5f5,
    antialias: true,
    resolution: 1,
  });

  return app;
}
