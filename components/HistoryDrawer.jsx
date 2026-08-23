import { IconFile, IconHistory, IconTrash, IconX } from "./Icons";

function timeAgo(ts) {
  const diff = Math.max(0, Date.now() - ts);
  const min = Math.round(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.round(hr / 24)}d ago`;
}

export default function HistoryDrawer({ open, entries, onClose, onLoad, onRemove, onClear }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="animate-fadeUp relative flex h-full w-full max-w-sm flex-col border-l border-white/10 bg-surface/95 backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-sm font-semibold text-white">
            <IconHistory className="h-4 w-4 text-accent" />
            Recent Summaries
          </h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close history"
          >
            <IconX className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto p-4">
          {entries.length === 0 ? (
            <p className="mt-10 text-center font-mono text-[12px] text-white/30">
              No summaries yet. They&apos;re saved locally in this browser.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {entries.map((e) => (
                <li
                  key={e.id}
                  className="group rounded-lg border border-white/[0.08] bg-white/[0.02] p-3.5 transition-colors hover:border-white/20"
                >
                  <div className="flex items-start justify-between gap-2">
                    <button onClick={() => onLoad(e)} className="min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-1.5 text-[13px] font-medium text-white/85">
                        <IconFile className="h-3.5 w-3.5 flex-shrink-0 text-accent2" />
                        <span className="truncate">{e.fileName || "Document"}</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-white/45">{e.summary}</p>
                      <p className="mt-1.5 font-mono text-[10px] uppercase tracking-wide text-white/25">
                        {e.length} · {timeAgo(e.timestamp)}
                      </p>
                    </button>
                    <button
                      onClick={() => onRemove(e.id)}
                      className="flex-shrink-0 rounded-md p-1.5 text-white/25 opacity-0 transition-opacity hover:bg-red-400/10 hover:text-red-300 group-hover:opacity-100"
                      aria-label="Delete entry"
                    >
                      <IconTrash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {entries.length > 0 && (
          <div className="border-t border-white/[0.07] p-4">
            <button
              onClick={onClear}
              className="w-full rounded-lg border border-white/10 py-2 font-mono text-[11px] uppercase tracking-wide text-white/50 transition-colors hover:border-red-400/30 hover:text-red-300"
            >
              Clear all
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
