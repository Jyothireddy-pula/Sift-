import { callGemini } from "../../lib/gemini";

const MAX_INPUT_CHARS = 20000;

const LENGTH_SPEC = {
  short: "2-3 sentences",
  medium: "1-2 short paragraphs",
  long: "3-4 detailed paragraphs covering every major section",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { text, length } = req.body || {};

  if (!text || text.trim().length < 20) {
    return res.status(400).json({ error: "Not enough text to summarize." });
  }

  const wasClipped = text.length > MAX_INPUT_CHARS;
  const clipped = text.slice(0, MAX_INPUT_CHARS);
  const spec = LENGTH_SPEC[length] || LENGTH_SPEC.medium;

  const prompt = `Summarize the following document in ${spec}.
Then list the 3-6 most important key points as short bullets.
Return ONLY valid JSON in this exact shape, no markdown fences:
{"summary": string, "keyPoints": string[]}

DOCUMENT:
${clipped}`;

  try {
    const raw = await callGemini(prompt);
    const parsed = JSON.parse(raw);
    return res.status(200).json({ ...parsed, wasClipped });
  } catch (err) {
    console.error("summarize error:", err.message);
    return res.status(500).json({ error: "Summarization failed. Please try again." });
  }
}
