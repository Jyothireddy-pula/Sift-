function countSyllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  const groups = w.match(/[aeiouy]+/g);
  let count = groups ? groups.length : 1;
  if (w.endsWith("e") && count > 1) count -= 1;
  return Math.max(count, 1);
}

function fleschLabel(score) {
  if (score >= 90) return "Very easy";
  if (score >= 70) return "Easy";
  if (score >= 60) return "Standard";
  if (score >= 50) return "Fairly difficult";
  if (score >= 30) return "Difficult";
  return "Very difficult";
}

export function computeTextStats(text) {
  const trimmed = (text || "").trim();
  const words = trimmed.length ? trimmed.split(/\s+/) : [];
  const wordCount = words.length;
  const characterCount = trimmed.length;
  const sentences = trimmed.split(/[.!?]+(?:\s|$)/).filter((s) => s.trim().length > 0);
  const sentenceCount = Math.max(sentences.length, 1);
  const syllableCount = words.reduce((sum, w) => sum + countSyllables(w), 0);

  const readingTimeMin = Math.max(1, Math.round(wordCount / 200));

  let fleschScore = null;
  if (wordCount > 0) {
    const raw =
      206.835 -
      1.015 * (wordCount / sentenceCount) -
      84.6 * (syllableCount / wordCount);
    fleschScore = Math.max(0, Math.min(100, Math.round(raw)));
  }

  return {
    wordCount,
    characterCount,
    sentenceCount,
    readingTimeMin,
    fleschScore,
    fleschLabel: fleschScore === null ? "—" : fleschLabel(fleschScore),
  };
}
