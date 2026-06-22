"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type PaperEditorProps = {
  initialValue: string;
  onSave: (content: string) => Promise<void>;
};

export default function PaperEditor({ initialValue, onSave }: PaperEditorProps) {
  const [content, setContent] = useState(initialValue);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setContent(initialValue);
    setIsDirty(false);
  }, [initialValue]);

  const formattedSavedAt = useMemo(() => {
    if (!savedAt) {
      return "";
    }

    return new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(savedAt);
  }, [savedAt]);

  const saveContent = useCallback(
    async (mode: "manual" | "auto") => {
      setIsSaving(true);
      setMessage("");

      try {
        await onSave(content);
        setIsDirty(false);
        setSavedAt(new Date());
        setMessage(
          mode === "manual"
            ? "Lettre enregistrée."
            : "Sauvegarde automatique effectuée.",
        );
      } catch {
        setMessage("Impossible d'enregistrer pour le moment.");
      } finally {
        setIsSaving(false);
      }
    },
    [content, onSave],
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (isDirty && !isSaving) {
        void saveContent("auto");
      }
    }, 10000);

    return () => window.clearInterval(interval);
  }, [isDirty, isSaving, saveContent]);

  function handleDownloadAndPrint() {
    const file = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "lettre-a-la-toi-de-septembre.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    window.print();
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[#fffaf0] p-4 shadow-[0_24px_70px_rgba(120,92,145,0.16)] sm:p-6">
      <div className="pointer-events-none absolute inset-0 opacity-70 paper-texture" />
      <div className="pointer-events-none absolute right-6 top-5 flex rotate-6 gap-2 text-2xl">
        <span>👑</span>
        <span>☀️</span>
        <span>🎬</span>
        <span>✨</span>
        <span>🌴</span>
      </div>

      <div className="relative pt-10">
        <label
          htmlFor="letter"
          className="mb-3 block text-sm font-bold uppercase tracking-[0.25em] text-[#8a6e93]"
        >
          Page d'écriture
        </label>
        <textarea
          id="letter"
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            setIsDirty(true);
          }}
          rows={16}
          className="min-h-[28rem] w-full resize-y rounded-[1.5rem] border border-[#f4cdd8] bg-white/72 p-5 leading-8 text-[#2f243a] outline-none transition placeholder:text-[#9b899f] focus:border-[#b9a7ff] focus:ring-4 focus:ring-[#b9a7ff]/25"
          placeholder="Écris ta lettre ici..."
        />

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-h-6 text-sm font-semibold text-[#6f4b76]">
            {message}
            {formattedSavedAt ? (
              <span className="ml-2 text-[#8a6e93]">
                Dernière sauvegarde : {formattedSavedAt}
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void saveContent("manual")}
              disabled={isSaving}
              className="rounded-full bg-[#2f243a] px-5 py-3 font-bold text-white shadow-lg shadow-[#2f243a]/15 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Enregistrement..." : "Enregistrer ma lettre"}
            </button>
            <button
              type="button"
              onClick={handleDownloadAndPrint}
              className="rounded-full bg-white px-5 py-3 font-bold text-[#2f243a] shadow-lg shadow-[#2f243a]/10 transition hover:-translate-y-0.5"
            >
              Télécharger / imprimer ma lettre
            </button>
          </div>
        </div>
      </div>

      <div className="print-letter">
        <h1>Exercice — La Lettre à la Toi de septembre (Terry)</h1>
        <p>{content}</p>
      </div>
    </section>
  );
}
