"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import PaperEditor from "@/components/PaperEditor";
import {
  Profile,
  getCurrentProfile,
  getLetterAnswer,
  saveLetterAnswer,
} from "@/lib/progress";

export default function LettreSeptembrePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [initialLetter, setInitialLetter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadExercise() {
      try {
        const currentProfile = await getCurrentProfile();
        setProfile(currentProfile);

        if (currentProfile) {
          setInitialLetter(await getLetterAnswer(currentProfile.id));
        }
      } catch {
        setError("Impossible de charger l'exercice.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadExercise();
  }, []);

  async function handleSave(letter: string) {
    if (!profile) {
      throw new Error("Missing profile");
    }

    await saveLetterAnswer(profile.id, letter);
  }

  return (
    <Layout eyebrow="Mindset & Organisation">
      <article className="space-y-6">
        <section className="rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-[0_24px_70px_rgba(120,92,145,0.16)] sm:p-10">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#8a6e93]">
                YouGC Summer Camp
              </p>
              <h1 className="mt-3 text-3xl font-black sm:text-4xl">
                Exercice — La Lettre à la Toi de septembre (Terry)
              </h1>
            </div>
            <Link
              href="/dashboard"
              className="w-fit rounded-full bg-white px-5 py-3 font-bold text-[#2f243a] shadow-lg shadow-[#2f243a]/10 transition hover:-translate-y-0.5"
            >
              Dashboard
            </Link>
          </div>

          <div className="rounded-[1.5rem] bg-[#fff7e8] p-5 text-lg leading-8 text-[#4f415b]">
            <p>
              Écris une lettre à la créatrice que tu seras dans 2 mois et
              réponds à :
            </p>
            <ul className="mt-4 list-inside list-disc space-y-1">
              <li>De quoi es-tu fière ?</li>
              <li>Qu&apos;as-tu osé faire ?</li>
              <li>As-tu respecter ton plan d’action ?</li>
              <li>Qu&apos;as-tu appris ?</li>
            </ul>
            <p className="mt-4">
              —&gt; Objectif: faire un exercice de projection
            </p>
          </div>
        </section>

        {isLoading ? (
          <section className="rounded-[2rem] border border-white/80 bg-white/75 p-6 font-semibold text-[#5a4966] shadow-[0_24px_70px_rgba(120,92,145,0.16)]">
            Chargement...
          </section>
        ) : null}

        {!isLoading && !profile ? (
          <section className="space-y-4 rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-[0_24px_70px_rgba(120,92,145,0.16)]">
            <p className="font-semibold text-[#5a4966]">Connexion requise.</p>
            <Link
              href="/login"
              className="inline-flex rounded-full bg-[#2f243a] px-5 py-3 font-bold text-white"
            >
              Se connecter
            </Link>
          </section>
        ) : null}

        {!isLoading && profile ? (
          <PaperEditor initialValue={initialLetter} onSave={handleSave} />
        ) : null}

        {error ? (
          <p className="rounded-2xl bg-[#f9c7d6]/45 px-4 py-3 font-semibold text-[#7d3f54]">
            {error}
          </p>
        ) : null}
      </article>
    </Layout>
  );
}
