import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import { runOcrOnImageData } from "./runOcr";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs";

const MIN_CHARS_PER_PAGE_BEFORE_OCR_FALLBACK = 15;

function groupTextItemsIntoLines(items) {
  let full = "";
  let lastY = null;
  let line = "";
  for (const item of items) {
    const y = item.transform[5];
    if (lastY !== null && Math.abs(y - lastY) > 5) {
      full += line.trim() + "\n";
      line = "";
    }
    line += item.str + " ";
    lastY = y;
  }
  full += line.trim();
  return full;
}

async function ocrPdfPage(page) {
  const viewport = page.getViewport({ scale: 2 });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext("2d");
  await page.render({ canvasContext: context, viewport }).promise;
  const text = await runOcrOnImageData(canvas);
  canvas.remove();
  return text;
}

export async function extractPdfText(file, onProgress) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  let full = "";
  let usedOcrFallback = false;

  for (let p = 1; p <= pdf.numPages; p++) {
    onProgress?.({ phase: "reading", page: p, total: pdf.numPages });

    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    let pageText = groupTextItemsIntoLines(content.items);

    if (pageText.trim().length < MIN_CHARS_PER_PAGE_BEFORE_OCR_FALLBACK) {
      onProgress?.({ phase: "ocr-fallback", page: p, total: pdf.numPages });
      pageText = await ocrPdfPage(page);
      usedOcrFallback = true;
    }

    full += pageText.trim() + `\n\n--- Page ${p} ---\n\n`;
  }

  return { text: full.trim(), usedOcrFallback, pageCount: pdf.numPages };
}
