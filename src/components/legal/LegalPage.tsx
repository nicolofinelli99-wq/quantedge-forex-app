import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 pb-20 pt-16">
        <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-dim hover:text-ink">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to home
        </Link>
        <h1 className="mb-2 text-[28px] font-bold">{title}</h1>
        <p className="mb-10 text-[13px] text-faint">Last updated: {updated}</p>
        <div className="legal-prose space-y-6 text-[14.5px] leading-relaxed text-dim">{children}</div>
      </div>
      <Footer />
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2.5 text-[16.5px] font-semibold text-ink">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
