# Pixi.js + Skia (CanvasKit) Demo

Тестовое задание: рендер `PIXI.Container` через Pixi.js и Skia, экспорт в векторный PDF.

## Стек

- TypeScript + Vite
- `pixi.js-legacy@7.2.4` с `forceCanvas: true`
- `@rollerbird/canvaskit-wasm-pdf` — CanvasKit WASM с PDF backend

## Запуск

```bash
npm install
npm run dev
```

Откройте http://localhost:5173

## Сборка

```bash
npm run build
npm run preview
```

## Функции

- **Канвас 1** — нативный рендер Pixi.js
- **Канвас 2** — тот же контейнер через обёртку `convertPixiContainerToSkia`
- **Сгенерировать фигуру** — добавляет случайный `PIXI.Graphics`
- **Экспорт в PDF** — векторная графика через Skia PDF (спрайты — bitmap)

## Структура

```
src/
  app/           — Pixi app, сцена, UI
  skia/          — обёртка Pixi → Skia, PDF export
  interaction/   — hit-test для Skia-канваса
```

## PDF WASM

При `npm install` скрипт `postinstall` копирует `canvaskit-pdf.wasm` в `public/`.
Сборка основана на [@rollerbird/canvaskit-wasm-pdf](https://www.npmjs.com/package/html2pdf-skia) (Skia с `skia_enable_pdf=true`).

## Деплой

Статический хостинг (GitHub Pages, Vercel, Netlify):

```bash
npm run build
# dist/ — готовая сборка
```

Убедитесь, что `.wasm` отдаётся с `Content-Type: application/wasm`.
