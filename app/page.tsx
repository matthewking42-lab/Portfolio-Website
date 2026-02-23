import Link from "next/link";
import { prisma } from "@/lib/prisma";
import HeroMap from "@/components/HeroMap";

// Force dynamic rendering to avoid build-time DB queries (required for Netlify deploy)
export const dynamic = "force-dynamic";

function Stat({
  value,
  label,
  sub,
}: {
  value: string;
  label: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col gap-1 px-8 py-6 bg-white">
      <span className="font-mono text-3xl font-light text-accent">{value}</span>
      <span className="font-mono text-xs uppercase tracking-widest text-gray-400">
        {label}
      </span>
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
    </div>
  );
}

export default async function HomePage() {
  const projectCount = await prisma.project.count({
    where: { published: true },
  });

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Hero */}
      <section className="flex-1 flex items-center max-w-7xl mx-auto px-6 md:px-12 pt-14 w-full">
        <div className="w-full grid md:grid-cols-2 gap-12 lg:gap-20 items-center py-16 md:py-20">
          {/* Left: text content */}
          <div style={{ animation: "fade-up 0.7s ease-out 0.1s both" }}>
            <style>{`
              @keyframes fade-up {
                from { opacity: 0; transform: translateY(18px); }
                to   { opacity: 1; transform: translateY(0); }
              }
              @keyframes fade-in {
                from { opacity: 0; }
                to   { opacity: 1; }
              }
            `}</style>

            {/* Role label */}
            <div className="flex items-center gap-3 mb-8">
              <span className="block w-7 h-px bg-accent" />
              <span className="font-mono text-accent text-xs tracking-[0.18em] uppercase">
                Civil &amp; Structural Design Engineer
              </span>
            </div>

            {/* Name */}
            <h1 className="font-mono text-6xl sm:text-7xl md:text-8xl font-light text-gray-900 leading-none tracking-tight mb-8">
              Matthew
              <br />
              King
            </h1>

            {/* Tagline */}
            <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-lg mb-10">
              Designing railway bridges and structural infrastructure across the
              UK, with a focus on precision, safety, and longevity.
            </p>

            {/* CTAs */}
            <div className="flex gap-3 flex-wrap">
              <Link href="/projects" className="btn-primary">
                View Projects Map
              </Link>
              <Link href="/about" className="btn-secondary">
                About Me
              </Link>
            </div>
          </div>

          {/* Right: animated project map */}
          <div
            className="hidden md:flex flex-col gap-2"
            style={{ animation: "fade-in 0.8s ease-out 0.5s both" }}
          >
            <div className="relative h-[440px] border border-gray-200 overflow-hidden">
              <HeroMap />
            </div>
            <p className="font-mono text-[10px] text-gray-400 tracking-widest uppercase text-right">
              Live project tour — click to explore
            </p>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            <Stat
              value={String(projectCount)}
              label="Projects"
              sub="Across the UK"
            />
            <Stat value="Rail" label="Primary sector" sub="Network Rail" />
            <Stat
              value="2018"
              label="Career start"
              sub="Trainee → Design Engineer"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
