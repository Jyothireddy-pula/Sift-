import { IconCheck } from "./Icons";

const STEPS = ["Upload", "Extract", "Summarize", "Results"];

export default function StepIndicator({ current }) {
  return (
    <div className="mx-auto mb-9 flex max-w-md items-center justify-between px-2">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const active = stepNum === current;
        const done = stepNum < current;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-md border text-[11px] font-mono font-medium transition-all duration-300
                  ${done ? "border-accent/60 bg-accent/10 text-accent" : ""}
                  ${active ? "border-accent bg-accent text-ink shadow-glow scale-105" : ""}
                  ${!done && !active ? "border-white/10 bg-white/[0.02] text-white/35" : ""}
                `}
              >
                {done ? <IconCheck className="h-3 w-3" /> : String(stepNum).padStart(2, "0")}
              </div>
              <span className={`font-mono text-[9.5px] uppercase tracking-[0.14em] ${active ? "text-white/75" : "text-white/30"}`}>
                {label}
              </span>
            </div>
            {stepNum !== STEPS.length && (
              <div className="mx-1.5 mb-4 h-px flex-1 bg-white/[0.07]">
                <div
                  className="h-full bg-accent transition-all duration-500"
                  style={{ width: done ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
