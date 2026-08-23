import { useState } from "react";
import TiltCard from "./TiltCard";
import { IconAlert, IconCheck, IconCopy, IconDownload } from "./Icons";

export default function SummaryPanel({ summary, keyPoints, suggestions, wasClipped }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const parts = [summary, "", "Key Points:", ...(keyPoints || []).map((k) => `- ${k}`)];
    try {
      await navigator.clipboard.writeText(parts.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — ignore silently, non-critical UX affordance
    }
  };

  const handleDownload = () => {
    const parts = [
      "SUMMARY", "", summary, "", "KEY POINTS",
      ...(keyPoints || []).map((k) => `- ${k}`),
      "", "IMPROVEMENT SUGGESTIONS",
      ...(suggestions || []).map((s) => `- ${s}`),
    ];
    const blob = new Blob([parts.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {wasClipped && (
        <div className="flex items-start gap-2.5 rounded-lg border border-accent3/25 bg-accent3/[0.06] px-4 py-2.5 text-sm text-accent3">
          <IconAlert className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>Document was long — summarized the first 20,000 characters.</span>
        </div>
      )}

      <TiltCard className="animate-fadeUp">
        <section className="glass-strong panel-corner card-lift rounded-xl p-6 sm:p-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-base font-semibold tracking-tight text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Summary
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 font-mono text-[11px] font-medium text-white/60 transition-colors hover:border-white/25 hover:text-white"
              >
                {copied ? <IconCheck className="h-3.5 w-3.5 text-accent" /> : <IconCopy className="h-3.5 w-3.5" />}
                {copied ? "COPIED" : "COPY"}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 font-mono text-[11px] font-medium text-white/60 transition-colors hover:border-white/25 hover:text-white"
              >
                <IconDownload className="h-3.5 w-3.5" />
                .TXT
              </button>
            </div>
          </div>
          <p className="whitespace-pre-wrap font-body text-[15px] leading-relaxed text-white/80">{summary}</p>
        </section>
      </TiltCard>

      {keyPoints?.length > 0 && (
        <TiltCard className="animate-fadeUp delay-1">
          <section className="glass-strong panel-corner card-lift rounded-xl p-6 sm:p-7">
            <h2 className="mb-4 flex items-center gap-2 font-display text-base font-semibold tracking-tight text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-accent2" />
              Key Points
            </h2>
            <ul className="space-y-2.5">
              {keyPoints.map((point, i) => (
                <li key={i} className="flex gap-3 text-[14.5px] text-white/85">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border border-accent2/30 bg-accent2/10 font-mono text-[10px] text-accent2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </section>
        </TiltCard>
      )}

      {suggestions?.length > 0 && (
        <TiltCard className="animate-fadeUp delay-2">
          <section className="glass-strong panel-corner card-lift rounded-xl p-6 sm:p-7">
            <h2 className="mb-4 flex items-center gap-2 font-display text-base font-semibold tracking-tight text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-accent3" />
              Improvement Suggestions
            </h2>
            <ul className="space-y-2.5">
              {suggestions.map((s, i) => (
                <li key={i} className="flex gap-3 text-[14.5px] text-white/85">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border border-accent3/30 bg-accent3/10 font-mono text-[10px] text-accent3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </section>
        </TiltCard>
      )}
    </div>
  );
}
