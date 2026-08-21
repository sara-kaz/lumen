import Link from "next/link";
import LabExplainer from "./LabExplainer";

export const metadata = {
  title: "Explain my results — Lumen",
  description:
    "Paste or upload a lab report and get a plain-language explanation of what each value measures, what it doesn't tell you, and what to ask your doctor.",
};

export default function LabsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-14">
      <Link href="/" className="font-mono text-xs text-muted hover:text-accent">
        ← Lumen
      </Link>
      <LabExplainer />
    </main>
  );
}
