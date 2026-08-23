const OPTIONS = [
  { key: "short", label: "Short", hint: "2-3 sentences" },
  { key: "medium", label: "Medium", hint: "1-2 paragraphs" },
  { key: "long", label: "Long", hint: "3-4 paragraphs" },
];

export default function LengthSelector({ value, onChange, disabled }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {OPTIONS.map((opt) => {
        const active = value === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.key)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all
              ${active
                ? "border-accent bg-accent text-ink shadow-glow"
                : "border-white/10 bg-white/[0.02] text-white/65 hover:border-white/20 hover:text-white"}
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
            title={opt.hint}
          >
            {opt.label}
            <span className={`ml-1.5 font-mono text-[11px] ${active ? "opacity-70" : "opacity-45"}`}>{opt.hint}</span>
          </button>
        );
      })}
    </div>
  );
}
