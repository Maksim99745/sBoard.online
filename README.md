# Pixi + Skia demo

Небольшой пример для тестового задания: одна и та же сцена рисуется через Pixi.js и через Skia CanvasKit, а потом экспортируется в PDF.

## Деплой

https://s-board-online.vercel.app/

## Как запустить

```bash
npm install
npm run dev
```

После запуска откройте `http://localhost:5173`.

## Что есть на странице

- слева кнопки управления;
- первый canvas рисует сцену через Pixi.js;
- второй canvas рисует тот же `PIXI.Container` через Skia;
- кнопка "Сгенерировать случайную линию/фигуру" добавляет новый объект, не пересоздавая старую сцену;
- экспорт сохраняет сцену в PDF: графика остается векторной, спрайты попадают как bitmap.

## Главное по реализации

- проект написан на TypeScript и Vite;
- используется `pixi.js-legacy@7.2.4` с `forceCanvas: true`;
- Skia-рендер лежит в `src/skia`;
- события для второго canvas обрабатываются через простой hit-test в `src/interaction`;
- `postinstall` копирует `canvaskit-pdf.wasm` в `public`.

## Проверка сборки

```bash
npm run build
npm run preview
```

Если выкладывать проект на статический хостинг, важно, чтобы `.wasm` отдавался как `application/wasm`.
