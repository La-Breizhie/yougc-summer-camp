import Link from "next/link";

type LayoutProps = {
  children: React.ReactNode;
  eyebrow?: string;
};

export default function Layout({ children, eyebrow }: LayoutProps) {
  return (
    <main className="min-h-screen px-4 py-6 text-[#2f243a] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/60 px-5 py-4 shadow-[0_18px_55px_rgba(120,92,145,0.14)] backdrop-blur md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#ffd166] text-xl shadow-inner">
              ☀️
            </span>
            <span>YouGC Summer Camp</span>
          </Link>

          <nav className="flex flex-wrap gap-2 text-sm font-semibold">
            <Link
              href="/dashboard"
              className="rounded-full bg-white/70 px-4 py-2 transition hover:bg-white"
            >
              Dashboard
            </Link>
            <Link
              href="/passport"
              className="rounded-full bg-white/70 px-4 py-2 transition hover:bg-white"
            >
              Passeport
            </Link>
          </nav>
        </header>

        {eyebrow ? (
          <p className="w-fit rounded-full bg-[#f9c7d6]/65 px-4 py-2 text-sm font-bold uppercase tracking-[0.25em] text-[#6f4b76]">
            {eyebrow}
          </p>
        ) : null}

        {children}
      </div>
    </main>
  );
}
