import Link from "next/link";
import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout eyebrow="Cahier de vacances">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="rounded-[2.5rem] border border-white/80 bg-white/70 p-6 shadow-[0_24px_70px_rgba(120,92,145,0.16)] sm:p-10">
          <p className="mb-4 inline-flex rounded-full bg-[#ffd166]/60 px-4 py-2 text-sm font-bold text-[#6f4b76]">
            YouGC Academy
          </p>
          <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            ☀️ Bienvenue dans le Cahier de Vacances : YouGC Summer Camp ☀️
          </h1>

          <div className="mt-8 space-y-5 text-lg leading-8 text-[#4f415b]">
            <p>Félicitations Queen 👑,</p>

            <p>
              L’été est là… et avec lui les apéros en terrasse, les couchers de
              soleil, les week-ends improvisés, les vacances et les moments de
              déconnexion bien mérités.
            </p>

            <p>Mais on sait aussi quelque chose :</p>

            <p>
              Les créatrices qui continuent à avancer, même avec de toutes
              petites actions, sont souvent celles qui récoltent les plus beaux
              résultats à la rentrée.
            </p>

            <p>
              C’est exactement pour ça que nous avons créé ce Cahier de Vacances
              : YouGC Summer Camp.
            </p>
          </div>

          <Link
            href="/login"
            className="mt-8 inline-flex rounded-full bg-[#2f243a] px-7 py-4 text-lg font-black text-white shadow-xl shadow-[#2f243a]/20 transition hover:-translate-y-0.5"
          >
            Commencer mon Summer Camp
          </Link>
        </div>

        <div className="relative min-h-[26rem] overflow-hidden rounded-[2.5rem] border border-white/80 bg-gradient-to-br from-[#f9c7d6] via-[#ffd166] to-[#78dcca] p-8 shadow-[0_24px_70px_rgba(120,92,145,0.18)]">
          <div className="absolute -right-12 -top-12 size-44 rounded-full bg-white/35" />
          <div className="absolute -bottom-16 -left-10 size-52 rounded-full bg-[#b9a7ff]/35" />
          <div className="relative flex h-full min-h-[22rem] flex-col justify-between rounded-[2rem] bg-white/68 p-7 backdrop-blur">
            <div className="flex justify-between text-4xl">
              <span>☀️</span>
              <span>👑</span>
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-[#8a6e93]">
                YouGC Summer Camp
              </p>
            </div>
            <div className="flex justify-end gap-3 text-3xl">
              <span>🎬</span>
              <span>✨</span>
              <span>🌴</span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
