import type { Container } from 'pixi.js-legacy';
import type { CanvasKit } from '@rollerbird/canvaskit-wasm-pdf';
import { convertPixiContainerToSkia } from './PixiSkiaRenderer';

/** Экспортирует сцену в векторный PDF через Skia PDF backend. */
export function exportSceneToPdf(
  ck: CanvasKit,
  container: Container,
  width: number,
  height: number,
): Uint8Array {
  const pdfDoc = ck.MakePDFDocument({
    title: 'Pixi Skia Export',
    author: 'pixi-skia-demo',
    creator: 'Skia CanvasKit PDF',
  });

  const canvas = pdfDoc.beginPage(width, height);
  canvas.clear(ck.WHITE);
  convertPixiContainerToSkia(container, canvas, ck);
  pdfDoc.endPage();

  const bytes = pdfDoc.close();
  pdfDoc.delete();

  return bytes;
}

/** Скачивает PDF-байты как файл. */
export function downloadPdf(bytes: Uint8Array, filename = 'scene.pdf'): void {
  const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
