import { computeTextStats } from "../lib/textStats";
import { IconClock, IconGauge, IconType } from "./Icons";

export default function DocStats({ text }) {
  const stats = computeTextStats(text);

  const items = [
    {
      icon: IconType,
      label: "Words",
      value: stats.wordCount.toLocaleString(),
    },
    {
      icon: IconClock,
      label: "Reading time",
      value: `${stats.readingTimeMin} min`,
    },
    {
      icon: IconGauge,
      label: "Readability",
      value: stats.fleschScore === null ? "—" : `${stats.fleschScore}`,
      sub: stats.fleschLabel,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map(({ icon: Icon, label, value, sub }) => (
        <div key={label} className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5">
          <div className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-wider text-white/35">
            <Icon className="h-3 w-3" />
            {label}
          </div>
          <div className="mt-1 font-display text-[15px] font-semibold text-white">{value}</div>
          {sub && <div className="font-mono text-[10px] text-white/40">{sub}</div>}
        </div>
      ))}
    </div>
  );
}
