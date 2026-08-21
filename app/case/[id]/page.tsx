import { notFound } from "next/navigation";
import { getCase } from "@/lib/cases";
import { toPublicCase } from "@/lib/types";
import Simulation from "./Simulation";

export default async function CasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = getCase(id);
  if (!c) notFound();

  // Only the public projection crosses to the client — the diagnosis, the hidden
  // history and every pre-authored result stay on the server.
  return <Simulation publicCase={toPublicCase(c)} />;
}
