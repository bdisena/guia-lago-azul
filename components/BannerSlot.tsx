"use client";
import { useEffect, useState } from "react";
import type { Banner } from "@/lib/types";
import { track } from "@/lib/track";
import { useCondo } from "./CondoProvider";
import { IconArrow } from "./Icons";

/** Espaço patrocinado; com vários anunciantes, alterna a cada 7s. */
export function BannerSlot({ banners, posicao }: { banners: Banner[]; posicao: Banner["posicao"] }) {
  const lista = banners.filter((b) => b.posicao === posicao);
  const [i, setI] = useState(0);
  const { atual } = useCondo();
  useEffect(() => {
    if (lista.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % lista.length), 7000);
    return () => clearInterval(t);
  }, [lista.length]);

  if (!lista.length) {
    if (posicao !== "topo") return null;
    return (
      <a href="/anuncie" className="group flex items-center justify-between gap-4 border border-[var(--line-strong)] px-5 py-4">
        <span>
          <span className="eyebrow">Espaço para parceiros</span>
          <span className="mt-1 block font-display text-[19px] leading-snug">Apresente sua empresa a ~2.000 residências.</span>
        </span>
        <IconArrow className="h-5 w-5 shrink-0 transition group-hover:translate-x-1" />
      </a>
    );
  }
  const b = lista[i % lista.length];
  const inner = (
    <div className="relative overflow-hidden bg-chumbo text-white">
      {b.imagem_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={b.imagem_url} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35 grayscale" />
      )}
      <div className="relative flex items-end justify-between gap-4 px-5 py-5">
        <div>
          <p className="eyebrow eyebrow-light">Apresentado por {b.anunciante}</p>
          <p className="mt-2 font-display text-[24px] leading-[1.1]">{b.titulo}</p>
          {b.subtitulo && <p className="mt-1 text-[13px] text-white/70">{b.subtitulo}</p>}
        </div>
        {b.link && <IconArrow className="h-5 w-5 shrink-0" />}
      </div>
    </div>
  );
  return b.link ? (
    <a href={b.link} target="_blank" rel="noopener noreferrer sponsored" onClick={() => track("click_banner", { banner: b.id, condominio: atual?.slug })}>
      {inner}
    </a>
  ) : inner;
}
