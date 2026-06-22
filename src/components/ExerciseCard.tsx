import Link from "next/link";
import ProgressBar from "./ProgressBar";

type ExerciseCardProps = {
  title: string;
  href: string;
  category: string;
  completion: number;
};

export default function ExerciseCard({
  title,
  href,
  category,
  completion,
}: ExerciseCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-white/75 bg-white/75 p-5 shadow-[0_18px_45px_rgba(120,92,145,0.12)]">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8a6e93]">
        {category}
      </p>
      <h2 className="mt-3 text-2xl font-black">{title}</h2>
      <div className="mt-5">
        <ProgressBar value={completion} />
      </div>
      <Link
        href={href}
        className="mt-6 inline-flex rounded-full bg-[#2f243a] px-5 py-3 font-bold text-white shadow-lg shadow-[#2f243a]/15 transition hover:-translate-y-0.5"
      >
        Reprendre
      </Link>
    </article>
  );
}
