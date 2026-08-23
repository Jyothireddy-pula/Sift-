import { callGemini } from "../../lib/gemini";

const MAX_INPUT_CHARS = 20000;
const MAX_HISTORY_TURNS = 4;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { text, question, history } = req.body || {};

  if (!text || text.trim().length < 20) {
    return res.status(400).json({ error: "Not enough document text to answer from." });
  }
  if (!question || question.trim().length < 3) {
    return res.status(400).json({ error: "Please enter a question." });
  }

  const clipped = text.slice(0, MAX_INPUT_CHARS);
  const priorTurns = Array.isArray(history) ? history.slice(-MAX_HISTORY_TURNS) : [];
  const conversation = priorTurns
    .map((turn) => `Q: ${turn.question}\nA: ${turn.answer}`)
    .join("\n\n");

  const prompt = `You are answering questions about a specific document. Only use information
found in the document below. If the answer isn't in the document, say so clearly instead of
guessing.

DOCUMENT:
${clipped}

${conversation ? `PREVIOUS Q&A IN THIS CONVERSATION:\n${conversation}\n` : ""}
NEW QUESTION: ${question.trim()}

Return ONLY valid JSON in this exact shape, no markdown fences:
{"answer": string}`;

  try {
    const raw = await callGemini(prompt);
    const parsed = JSON.parse(raw);
    return res.status(200).json(parsed);
  } catch (err) {
    console.error("ask error:", err.message);
    return res.status(500).json({ error: "Could not answer that question. Please try again." });
  }
}
