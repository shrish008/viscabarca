import type { ReactNode } from "react";
import { Header } from "./Header";
import { BottomCtaBar } from "./BottomCtaBar";
import { Footer } from "./Footer";

export function PageShell({
  title,
  hero,
  children,
}: {
  title?: string;
  hero?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Header title={title} />
      {hero}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-8 py-5 md:py-10">{children}</main>
      <Footer />
      <BottomCtaBar />
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-ink/80">{label}</label>
      {children}
    </div>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="bg-paper rounded-2xl border border-ink/10 shadow-sm p-5">
      {children}
    </div>
  );
}
