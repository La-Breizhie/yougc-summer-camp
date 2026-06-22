import ProgressBar from "./ProgressBar";

type PassportCardProps = {
  title: string;
  completed: number;
  total: number;
};

export default function PassportCard({
  title,
  completed,
  total,
}: PassportCardProps) {
  const progress = total > 0 ? (completed / total) * 100 : 0;
  const isValidated = total > 0 && completed === total;

  return (
    <article className="relative overflow-hidden rounded-[1.75rem] border border-white/75 bg-white/70 p-5 shadow-[0_18px_45px_rgba(120,92,145,0.12)]">
      <div className="absolute -right-8 -top-8 size-24 rounded-full bg-[#ffd166]/35" />
      <div className="relative space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8a6e93]">
              Catégorie
            </p>
            <h2 className="mt-2 text-xl font-black">{title}</h2>
          </div>

          {isValidated ? (
            <span className="rotate-[-8deg] rounded-full border-2 border-[#d65f7f] px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#d65f7f]">
              validé
            </span>
          ) : null}
        </div>

        <p className="font-semibold text-[#5a4966]">
          {completed} / {total} exercices réalisés
        </p>
        <ProgressBar value={progress} />
      </div>
    </article>
  );
}
