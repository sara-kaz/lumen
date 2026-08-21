import Link from "next/link";
import CareFinder from "./CareFinder";

export const metadata = {
  title: "Where should I go? — Lumen",
  description:
    "Describe what's going on and find out how urgently you should be seen, what to watch for, and where the nearest emergency department or walk-in clinic actually is.",
};

export default function CarePage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-14">
      <Link href="/" className="font-mono text-xs text-muted hover:text-accent">
        ← Lumen
      </Link>
      <CareFinder />
    </main>
  );
}
