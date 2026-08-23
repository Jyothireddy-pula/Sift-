const STATUS_LABELS = {
  extracting: "Reading document",
  ocr: "Running OCR",
  "ocr-fallback": "Scanned page detected — running OCR",
  summarizing: "Generating summary",
  suggesting: "Analyzing for improvements",
};

export default function Loader({ status, progress, detail }) {
  if (!status || status === "idle" || status === "done" || status === "error") return null;

  const label = STATUS_LABELS[status] || "Working";

  return (
    <div className="glass-strong panel-corner rounded-xl p-7 text-center">
      <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-accent" />
      <p className="font-display text-[15px] font-semibold text-white">{label}…</p>
      {detail && <p className="mt-1 font-mono text-[12.5px] text-white/40">{detail}</p>}
      {typeof progress === "number" && (
        <div className="mx-auto mt-4 h-1 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
