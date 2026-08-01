import type { ReactNode } from "react";
import { Header } from "./Header";
import { BottomCtaBar } from "./BottomCtaBar";

export function PageShell({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Header title={title} />
      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-5">{children}</main>
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
