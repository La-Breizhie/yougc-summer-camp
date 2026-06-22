"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { startEmailLogin } from "@/lib/progress";

export default function LoginPage() {
  const router = useRouter();
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const result = await startEmailLogin(firstname, email);

      if (result.needsEmailConfirmation) {
        setMessage("Un lien de connexion vient d'être envoyé par email.");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setMessage("Impossible de lancer la connexion pour le moment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Layout eyebrow="Connexion">
      <section className="mx-auto w-full max-w-2xl rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-[0_24px_70px_rgba(120,92,145,0.16)] sm:p-10">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#8a6e93]">
            YouGC Summer Camp
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">
            Connexion par email
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="firstname" className="font-bold">
              Prénom
            </label>
            <input
              id="firstname"
              name="firstname"
              type="text"
              value={firstname}
              onChange={(event) => setFirstname(event.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-[#f4cdd8] bg-white/80 px-4 py-3 outline-none transition focus:border-[#b9a7ff] focus:ring-4 focus:ring-[#b9a7ff]/25"
            />
          </div>

          <div>
            <label htmlFor="email" className="font-bold">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-[#f4cdd8] bg-white/80 px-4 py-3 outline-none transition focus:border-[#b9a7ff] focus:ring-4 focus:ring-[#b9a7ff]/25"
            />
          </div>

          {message ? (
            <p className="rounded-2xl bg-[#78dcca]/22 px-4 py-3 font-semibold text-[#3f6760]">
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-[#2f243a] px-6 py-4 text-lg font-black text-white shadow-xl shadow-[#2f243a]/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Connexion..." : "Continuer"}
          </button>
        </form>
      </section>
    </Layout>
  );
}
