"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import PassportCard from "@/components/PassportCard";
import {
  Profile,
  ProgressRecord,
  getCategoryProgress,
  getCurrentProfile,
  getProgressRecords,
} from "@/lib/progress";

export default function PassportPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progressRecords, setProgressRecords] = useState<ProgressRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPassport() {
      try {
        const currentProfile = await getCurrentProfile();
        setProfile(currentProfile);

        if (currentProfile) {
          setProgressRecords(await getProgressRecords(currentProfile.id));
        }
      } catch {
        setError("Impossible de charger le passeport.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadPassport();
  }, []);

  const categoryProgress = useMemo(
    () => getCategoryProgress(progressRecords),
    [progressRecords],
  );

  return (
    <Layout eyebrow="Passeport">
      <section className="rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-[0_24px_70px_rgba(120,92,145,0.16)] sm:p-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#8a6e93]">
              YouGC Summer Camp
            </p>
            <h1 className="mt-3 text-4xl font-black">Passeport</h1>
          </div>
          <Link
            href="/dashboard"
            className="w-fit rounded-full bg-[#2f243a] px-5 py-3 font-bold text-white shadow-lg shadow-[#2f243a]/15 transition hover:-translate-y-0.5"
          >
            Retour au dashboard
          </Link>
        </div>

        {isLoading ? (
          <p className="font-semibold text-[#5a4966]">Chargement...</p>
        ) : null}

        {!isLoading && !profile ? (
          <div className="space-y-4">
            <p className="font-semibold text-[#5a4966]">Connexion requise.</p>
            <Link
              href="/login"
              className="inline-flex rounded-full bg-[#2f243a] px-5 py-3 font-bold text-white"
            >
              Se connecter
            </Link>
          </div>
        ) : null}

        {!isLoading && profile ? (
          <div className="grid gap-5 md:grid-cols-2">
            {categoryProgress.map((category) => (
              <PassportCard
                key={category.title}
                title={category.title}
                completed={category.completed}
                total={category.total}
              />
            ))}
          </div>
        ) : null}

        {error ? (
          <p className="mt-5 rounded-2xl bg-[#f9c7d6]/45 px-4 py-3 font-semibold text-[#7d3f54]">
            {error}
          </p>
        ) : null}
      </section>
    </Layout>
  );
}
