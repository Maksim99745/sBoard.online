import './style.css';
import { createPixiApp } from './app/createPixiApp';
import { addRandomShape, createDemoScene, preloadAssets } from './app/createScene';
import { createSkiaRenderer } from './app/skiaRenderer';
import { bindSkiaPointerEvents } from './app/bindSkiaEvents';
import { loadCanvasKit } from './skia/loadCanvasKit';
import { downloadPdf, exportSceneToPdf } from './skia/pdfExport';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './app/createScene';

function buildLayout(): {
  pixiCanvas: HTMLCanvasElement;
  skiaCanvas: HTMLCanvasElement;
  randomBtn: HTMLButtonElement;
  pdfBtn: HTMLButtonElement;
} {
  const appRoot = document.querySelector<HTMLDivElement>('#app')!;

  appRoot.innerHTML = `
    <aside class="sidebar">
      <button class="btn" id="btn-random">Сгенерировать случайную линию/фигуру</button>
      <button class="btn" id="btn-pdf">Экспорт в PDF</button>
    </aside>
    <section class="canvases">
      <article class="canvas-panel">
        <h2>Канвас1</h2>
        <p class="subtitle">Pixi.js</p>
        <canvas id="pixi-canvas" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}"></canvas>
      </article>
      <article class="canvas-panel">
        <h2>Канвас2</h2>
        <p class="subtitle">Skia</p>
        <canvas id="skia-canvas" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}"></canvas>
      </article>
    </section>
  `;

  return {
    pixiCanvas: document.querySelector('#pixi-canvas') as HTMLCanvasElement,
    skiaCanvas: document.querySelector('#skia-canvas') as HTMLCanvasElement,
    randomBtn: document.querySelector('#btn-random') as HTMLButtonElement,
    pdfBtn: document.querySelector('#btn-pdf') as HTMLButtonElement,
  };
}

async function bootstrap(): Promise<void> {
  const { pixiCanvas, skiaCanvas, randomBtn, pdfBtn } = buildLayout();

  await preloadAssets();

  const ck = await loadCanvasKit();
  const pixiApp = createPixiApp(pixiCanvas);
  const mainContainer = createDemoScene();

  pixiApp.stage.addChild(mainContainer);

  const skiaRenderer = createSkiaRenderer(skiaCanvas, ck);
  bindSkiaPointerEvents(skiaCanvas, mainContainer);

  const renderScene = () => {
    pixiApp.render();
    skiaRenderer.render(mainContainer);
  };

  renderScene();

  randomBtn.addEventListener('click', () => {
    addRandomShape(mainContainer);
    renderScene();
  });

  pdfBtn.addEventListener('click', () => {
    const bytes = exportSceneToPdf(ck, mainContainer, CANVAS_WIDTH, CANVAS_HEIGHT);
    downloadPdf(bytes);
  });
}

bootstrap().catch((error) => {
  console.error('Ошибка инициализации:', error);
});
