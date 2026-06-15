import type { Container } from 'pixi.js-legacy';
import type { CanvasKit } from '@rollerbird/canvaskit-wasm-pdf';
import { convertPixiContainerToSkia } from './PixiSkiaRenderer';

type PdfMetadataInput = Parameters<CanvasKit['MakePDFDocument']>[0] & {
  _rootTag: null;
};

function createPdfDocument(ck: CanvasKit, title: string) {
  return ck.MakePDFDocument({
    title,
    _rootTag: null,
  } as PdfMetadataInput);
}

export function exportSceneToPdf(
  ck: CanvasKit,
  container: Container,
  width: number,
  height: number,
): Uint8Array {
  container.updateTransform();

  const pdfDoc = createPdfDocument(ck, 'scene');

  const canvas = pdfDoc.beginPage(width, height);
  canvas.clear(ck.WHITE);
  // Повторно используем тот же Skia-рендер: Graphics попадут в PDF как вектор.
  convertPixiContainerToSkia(container, canvas, ck);
  pdfDoc.endPage();

  const bytes = pdfDoc.close();
  pdfDoc.delete();

  return bytes;
}

export function downloadPdf(bytes: Uint8Array, filename = 'scene.pdf'): void {
  const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
