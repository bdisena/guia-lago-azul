"use client";
import { useEffect, useState } from "react";
import type { Banner } from "@/lib/types";
import { track } from "@/lib/track";
import { useCondo } from "./CondoProvider";

/** Banner patrocinado; se houver vários, rotaciona a cada 6s. Sem anunciante, mostra convite para anunciar. */
export function BannerSlot({ banners, posicao }: { banners: Banner[]; posicao: Banner["posicao"] }) {
  const lista = banners.filter((b) => b.posicao === posicao);
  const [i, setI] = useState(0);
  const { atual } = useCondo();
  useEffect(() => {
    if (lista.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % lista.length), 6000);
    return () => clearInterval(t);
  }, [lista.length]);

  if (!lista.length) {
    if (posicao !== "topo") return null;
    return (
      <a href="/anuncie" className="block rounded-2xl border border-dashed border-lago-200 bg-lago-50 px-4 py-3 text-sm text-lago-700">
        <span className="font-semibold">Sua empresa aqui.</span> Anuncie para ~2.000 residências dos 5 condomínios →
      </a>
    );
  }
  const b = lista[i % lista.length];
  const inner = (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-lago-700 to-lago-500 text-white">
      {b.imagem_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={b.imagem_url} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
      )}
      <div className="relative px-4 py-4">
        <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">Patrocinado</span>
        <p className="mt-1.5 text-lg font-bold leading-tight">{b.titulo}</p>
        {b.subtitulo && <p className="text-sm opacity-90">{b.subtitulo}</p>}
        <p className="mt-1 text-xs opacity-80">{b.anunciante}</p>
      </div>
    </div>
  );
  return b.link ? (
    <a href={b.link} target="_blank" rel="noopener noreferrer sponsored" onClick={() => track("click_banner", { banner: b.id, condominio: atual?.slug })}>
      {inner}
    </a>
  ) : inner;
}
