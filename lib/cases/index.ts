import type { Case } from "../types";
import { peOkafor } from "./pe-okafor";
import { dkaReyes } from "./dka-reyes";
import { deliriumAbadi } from "./delirium-abadi";
import { sahMensah } from "./sah-mensah";
import { miCastillo } from "./mi-castillo";
import { endocarditisNowak } from "./endocarditis-nowak";

const DIFFICULTY_ORDER = { intro: 0, core: 1, hard: 2 } as const;

export const CASES: Case[] = [
  dkaReyes,
  peOkafor,
  sahMensah,
  deliriumAbadi,
  miCastillo,
  endocarditisNowak,
].sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]);

export function getCase(id: string): Case | undefined {
  return CASES.find((c) => c.id === id);
}
