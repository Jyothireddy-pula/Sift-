import { useState } from "react";
import TiltCard from "./TiltCard";
import { IconAlert, IconChat, IconSend } from "./Icons";

export default function AskPanel({ text }) {
  const [question, setQuestion] = useState("");
  const [turns, setTurns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async (e) => {
    e.preventDefault();
    const q = question.trim();
    if (!q || loading) return;

    setError("");
    setLoading(true);
    setQuestion("");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          question: q,
          history: turns.map(({ question, answer }) => ({ question, answer })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not answer that question.");
      setTurns((prev) => [...prev, { question: q, answer: data.answer }]);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TiltCard className="animate-fadeUp delay-3">
      <section className="glass-strong panel-corner rounded-xl p-6 sm:p-7">
        <h2 className="mb-1 flex items-center gap-2 font-display text-base font-semibold tracking-tight text-white">
          <IconChat className="h-4 w-4 text-accent" />
          Ask This Document
        </h2>
        <p className="mb-4 font-mono text-[11.5px] text-white/35">
          Answers are grounded only in the extracted text — no outside knowledge.
        </p>

        {turns.length > 0 && (
          <div className="scrollbar-thin mb-4 max-h-64 space-y-3 overflow-y-auto pr-1">
            {turns.map((t, i) => (
              <div key={i} className="space-y-1.5">
                <p className="flex gap-2 font-mono text-[12.5px] text-accent2">
                  <span className="opacity-60">Q</span>
                  <span className="text-white/80">{t.question}</span>
                </p>
                <p className="flex gap-2 pl-4 text-[14px] leading-relaxed text-white/75">
                  <span className="font-mono text-white/30">A</span>
                  <span>{t.answer}</span>
                </p>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div className="mb-4 flex items-center gap-2 font-mono text-[12px] text-white/40">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/15 border-t-accent" />
            Thinking…
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-400/25 bg-red-500/[0.07] px-3.5 py-2 text-[13px] text-red-200">
            <IconAlert className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAsk} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What does the document recommend for section 3?"
            disabled={loading}
            className="flex-1 rounded-lg border border-white/10 bg-white/[0.02] px-3.5 py-2.5 text-[14px] text-white placeholder:text-white/30 outline-none transition-colors focus:border-accent/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="flex items-center justify-center rounded-lg bg-accent px-4 text-ink transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            aria-label="Ask"
          >
            <IconSend className="h-4 w-4" />
          </button>
        </form>
      </section>
    </TiltCard>
  );
}
