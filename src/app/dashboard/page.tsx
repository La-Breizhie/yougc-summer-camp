"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ExerciseCard from "@/components/ExerciseCard";
import Layout from "@/components/Layout";
import ProgressBar from "@/components/ProgressBar";
import {
  EXERCISES,
  Profile,
  ProgressRecord,
  getCurrentProfile,
  getExerciseCompletion,
  getGlobalCompletion,
  getLastActivity,
  getProgressRecords,
} from "@/lib/progress";

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progressRecords, setProgressRecords] = useState<ProgressRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const currentProfile = await getCurrentProfile();
        setProfile(currentProfile);

        if (currentProfile) {
          setProgressRecords(await getProgressRecords(currentProfile.id));
        }
      } catch {
        setError("Impossible de charger le dashboard.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadDashboard();
  }, []);

  const globalCompletion = useMemo(
    () => getGlobalCompletion(progressRecords),
    [progressRecords],
  );
  const lastActivity = useMemo(
    () => getLastActivity(progressRecords),
    [progressRecords],
  );
  const mainExercise = EXERCISES[0];

  return (
    <Layout eyebrow="Dashboard">
      <section className="rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-[0_24px_70px_rgba(120,92,145,0.16)] sm:p-10">
        {isLoading ? (
          <p className="font-semibold text-[#5a4966]">Chargement...</p>
        ) : null}

        {!isLoading && !profile ? (
          <div className="space-y-5">
            <h1 className="text-3xl font-black">Connexion requise</h1>
            <Link
              href="/login"
              className="inline-flex rounded-full bg-[#2f243a] px-6 py-3 font-bold text-white"
            >
              Se connecter
            </Link>
          </div>
        ) : null}

        {!isLoading && profile ? (
          <div className="space-y-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#8a6e93]">
                  YouGC Summer Camp
                </p>
                <h1 className="mt-3 text-4xl font-black">
                  Bonjour {profile.firstname} 👑
                </h1>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={mainExercise.href}
                  className="rounded-full bg-[#2f243a] px-5 py-3 text-center font-bold text-white shadow-lg shadow-[#2f243a]/15 transition hover:-translate-y-0.5"
                >
                  Reprendre
                </Link>
                <Link
                  href="/passport"
                  className="rounded-full bg-white px-5 py-3 text-center font-bold text-[#2f243a] shadow-lg shadow-[#2f243a]/10 transition hover:-translate-y-0.5"
                >
                  Voir mon passeport
                </Link>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[1.5rem] bg-[#fff7e8] p-5">
                <ProgressBar
                  value={globalCompletion}
                  label="Barre de progression globale"
                />
              </div>

              <div className="rounded-[1.5rem] bg-[#f9c7d6]/35 p-5">
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#8a6e93]">
                  Dernière activité
                </p>
                <p className="mt-2 text-lg font-black">
                  {lastActivity
                    ? `${lastActivity.title} · ${new Intl.DateTimeFormat(
                        "fr-FR",
                      ).format(new Date(lastActivity.updatedAt))}`
                    : "Aucune activité enregistrée"}
                </p>
              </div>
            </div>

            <ExerciseCard
              title={mainExercise.title}
              href={mainExercise.href}
              category={mainExercise.category}
              completion={getExerciseCompletion(
                progressRecords,
                mainExercise.slug,
              )}
            />
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
