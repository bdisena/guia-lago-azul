"use client";
import { useEffect } from "react";
import { track, type EventoTipo } from "@/lib/track";
import { useCondo } from "./CondoProvider";

export function TrackView({ tipo, prestador, categoria }: { tipo: EventoTipo; prestador?: string; categoria?: number }) {
  const { atual } = useCondo();
  useEffect(() => {
    const k = `guia:v:${tipo}:${prestador ?? categoria}`;
    try { if (sessionStorage.getItem(k)) return; sessionStorage.setItem(k, "1"); } catch {}
    track(tipo, { prestador, categoria, condominio: atual?.slug });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo, prestador, categoria]);
  return null;
}
