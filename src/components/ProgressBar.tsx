type ProgressBarProps = {
  value: number;
  label?: string;
};

export default function ProgressBar({ value, label }: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm font-semibold text-[#5a4966]">
        {label ? <span>{label}</span> : <span>Progression</span>}
        <span>{safeValue}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/80 shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#78dcca] via-[#ffd166] to-[#f9c7d6] transition-all duration-500"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
