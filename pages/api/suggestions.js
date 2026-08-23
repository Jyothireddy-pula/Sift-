import { callGemini } from "../../lib/gemini";

const MAX_INPUT_CHARS = 20000;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { text } = req.body || {};

  if (!text || text.trim().length < 20) {
    return res.status(400).json({ error: "Not enough text to analyze." });
  }

  const clipped = text.slice(0, MAX_INPUT_CHARS);

  const prompt = `Analyze the following document and give 3-6 concrete, specific suggestions
to improve its clarity, structure, and readability. Be specific to this document's
actual content — avoid generic advice.
Return ONLY valid JSON in this exact shape, no markdown fences:
{"suggestions": string[]}

DOCUMENT:
${clipped}`;

  try {
    const raw = await callGemini(prompt);
    const parsed = JSON.parse(raw);
    return res.status(200).json(parsed);
  } catch (err) {
    console.error("suggestions error:", err.message);
    return res.status(500).json({ error: "Could not generate suggestions. Please try again." });
  }
}
