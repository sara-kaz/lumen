import Link from "next/link";
import MedDecoder from "./MedDecoder";

export const metadata = {
  title: "What am I taking? — Lumen",
  description:
    "Photograph your medications or type them in. Lumen explains what each one is for and flags combinations worth asking a pharmacist about — grounded in official FDA labelling.",
};

export default function MedsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-14">
      <Link href="/" className="font-mono text-xs text-muted hover:text-accent">
        ← Lumen
      </Link>
      <MedDecoder />
    </main>
  );
}
