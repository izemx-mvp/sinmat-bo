import { createContext, useContext } from "react";
import type { Actions, EtatSinmat } from "./store-types";

export const Ctx = createContext<(EtatSinmat & Actions) | null>(null);

export function useSinmat() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSinmat doit être utilisé dans SinmatProvider");
  return ctx;
}
