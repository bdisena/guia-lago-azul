"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { Condominio } from "@/lib/types";

interface Ctx {
  condominios: Condominio[];
  atual: Condominio | null;
  definido: boolean;
  escolher: (slug: string | null) => void;
}
const CondoCtx = createContext<Ctx>({ condominios: [], atual: null, definido: true, escolher: () => {} });
const KEY = "guia:condominio";

export function CondoProvider({ condominios, children }: { condominios: Condominio[]; children: React.ReactNode }) {
  const [slug, setSlug] = useState<string | null>(null);
  const [definido, setDefinido] = useState(true);

  useEffect(() => {
    // ?c=lago-azul (QR code da portaria) tem prioridade sobre o salvo
    const fromUrl = new URLSearchParams(window.location.search).get("c");
    let saved: string | null = null;
    try { saved = localStorage.getItem(KEY); } catch {}
    const valid = (s: string | null) => s && condominios.some((c) => c.slug === s);
    if (valid(fromUrl)) {
      setSlug(fromUrl);
      try { localStorage.setItem(KEY, fromUrl!); } catch {}
    } else if (valid(saved)) setSlug(saved);
    else setDefinido(saved === "todos");
  }, [condominios]);

  const escolher = (s: string | null) => {
    setSlug(s);
    setDefinido(true);
    try { localStorage.setItem(KEY, s ?? "todos"); } catch {}
  };

  const atual = condominios.find((c) => c.slug === slug) ?? null;
  return <CondoCtx.Provider value={{ condominios, atual, definido, escolher }}>{children}</CondoCtx.Provider>;
}

export const useCondo = () => useContext(CondoCtx);
