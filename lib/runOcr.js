import { createWorker } from "tesseract.js";

export async function runOcr(file, onProgress) {
  const worker = await createWorker("eng", 1, {
    logger: (m) => {
      if (m.status === "recognizing text") {
        onProgress?.(Math.round(m.progress * 100));
      }
    },
  });
  try {
    const { data } = await worker.recognize(file);
    return data.text;
  } finally {
    await worker.terminate();
  }
}

export async function runOcrOnImageData(canvasOrImage) {
  const worker = await createWorker("eng");
  try {
    const { data } = await worker.recognize(canvasOrImage);
    return data.text;
  } finally {
    await worker.terminate();
  }
}
