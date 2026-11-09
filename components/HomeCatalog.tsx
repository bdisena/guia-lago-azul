"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Catalogo } from "@/lib/types";
import { normalizeText } from "@/lib/slug";
import { useCondo } from "./CondoProvider";
import { CondoChips } from "./CondoPicker";
import { ProviderCard } from "./ProviderCard";
import { BannerSlot } from "./BannerSlot";
import { IconArrow, IconSearch } from "./Icons";

const SINONIMOS: Record<string, string> = {
  faxina: "diarista", faxineira: "diarista", limpeza: "limpeza diarista", luz: "eletrica eletricista",
  eletricista: "eletrica", encanador: "encanamento hidraulica", vazamento: "encanamento hidraulica",
  piscineiro: "piscina", ar: "ar-condicionado climatizacao", jardineiro: "jardinagem", solar: "energia solar",
  vidro: "vidracaria", mecanico: "automotivo mecanica", pedreiro: "servicos gerais pedreiro", marceneiro: "marcenaria",
};

export function HomeCatalog({ catalogo }: { catalogo: Catalogo }) {
  const { categorias, prestadores, condominios, banners } = catalogo;
  const { atual } = useCondo();
  const [q, setQ] = useState("");

  const index = useMemo(() => {
    const catNome = new Map(categorias.map((c) => [c.id, c.nome]));
    return prestadores.map((p) => ({
      p,
      text: normalizeText([p.nome, ...p.servicos, ...p.categoria_ids.map((id) => catNome.get(id) ?? ""), p.descricao ?? ""].join(" ")),
    }));
  }, [prestadores, categorias]);

  const termos = normalizeText(q).split(/\s+/).filter((t) => t.length > 1);
  const resultados = termos.length
    ? index
        .filter(({ p }) => !atual || p.atende_todos || p.condominio_ids.includes(atual.id))
        .filter(({ text }) => termos.every((t) => text.includes(t) || (SINONIMOS[t] ?? "").split(" ").some((s) => s && text.includes(s))))
        .map(({ p }) => p)
    : [];
  const catsEncontradas = termos.length
    ? categorias.filter((c) => termos.every((t) => normalizeText(c.nome).includes(t) || (SINONIMOS[t] ?? "").split(" ").some((s) => s && normalizeText(c.nome).includes(s))))
    : [];

  const contagem = useMemo(() => {
    const m = new Map<number, number>();
    prestadores
      .filter((p) => !atual || p.atende_todos || p.condominio_ids.includes(atual.id))
      .forEach((p) => p.categoria_ids.forEach((id) => m.set(id, (m.get(id) ?? 0) + 1)));
    return m;
  }, [prestadores, atual]);

  const destaques = prestadores.filter((p) => p.plano === "destaque").slice(0, 3);

  return (
    <div>
      <section className="bg-[var(--ink)] px-4 pb-6 pt-8 text-white">
        <p className="eyebrow eyebrow-light fade-up">Private Concierge · 5 residenciais</p>
        <h1 className="fade-up mt-4 font-display text-[40px] leading-[1.02] tracking-[-0.015em]">
          Os profissionais<br />em quem seus vizinhos <em className="text-white/70">confiam.</em>
        </h1>
        <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/60">
          {prestadores.length} indicações curadas dos grupos dos condomínios. Cortesia aos moradores, sem cadastro.
        </p>
        <label className="relative mt-7 block">
          <span className="sr-only">Buscar serviço ou profissional</span>
          <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Do que você precisa hoje?"
            className="w-full rounded-[2px] bg-white py-4 pl-12 pr-4 text-[16px] text-[var(--ink)] outline-none placeholder:text-[var(--muted)] focus:ring-2 focus:ring-white/40"
            autoComplete="off"
            enterKeyHint="search"
          />
        </label>
        <div className="mt-7"><CondoChips dark /></div>
      </section>

      <div className="space-y-10 px-4 pt-8">
      {termos.length > 0 ? (
        <section aria-live="polite" className="space-y-4">
          {catsEncontradas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {catsEncontradas.map((c) => (
                <Link key={c.id} href={`/c/${c.slug}`} className="link-arrow border border-[var(--line-strong)] px-3 py-2 hover:border-[var(--ink)]">
                  {c.nome} <IconArrow className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          )}
          <p className="eyebrow">{resultados.length} resultado{resultados.length === 1 ? "" : "s"} · “{q.trim()}”</p>
          {resultados.map((p) => <ProviderCard key={p.id} p={p} condominios={condominios} />)}
          {resultados.length === 0 && (
            <div className="border border-[var(--line-strong)] p-6">
              <p className="font-display text-[24px] leading-tight">Ainda não temos uma indicação para isso.</p>
              <p className="muted mt-2 text-sm">Deixe conosco: encaminhamos seu pedido a até três parceiros.</p>
              <Link href="/orcamento" className="btn btn-primary mt-5 w-full">Solicitar orçamento</Link>
            </div>
          )}
        </section>
      ) : (
        <>
          <BannerSlot banners={banners} posicao="topo" />

          {destaques.length > 0 && (
            <section className="space-y-4">
              <SectionTitle eyebrow="Seleção" title="Parceiros do Guia" />
              {destaques.map((p) => <ProviderCard key={p.id} p={p} condominios={condominios} />)}
            </section>
          )}

          <section>
            <SectionTitle eyebrow={`${categorias.length} especialidades`} title="Serviços" />
            <CategoryGrid cats={categorias.slice(0, 10)} contagem={contagem} offset={0} />
            <div className="my-6 empty:hidden"><BannerSlot banners={banners} posicao="entre_categorias" /></div>
            <CategoryGrid cats={categorias.slice(10)} contagem={contagem} offset={10} />
          </section>

          <Link href="/orcamento" className="group block bg-[var(--ink)] p-6 text-white">
            <p className="eyebrow eyebrow-light">Orçamento Express</p>
            <p className="mt-3 font-display text-[28px] leading-[1.08]">Descreva o serviço.<br />Nós cuidamos do resto.</p>
            <p className="mt-3 text-[13px] leading-relaxed text-white/60">Até três parceiros selecionados entram em contato com você.</p>
            <span className="link-arrow mt-5 text-white">Solicitar <IconArrow className="h-4 w-4 transition group-hover:translate-x-1" /></span>
          </Link>
        </>
      )}
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-4 flex items-end justify-between border-b border-[var(--ink)] pb-3">
      <h2 className="font-display text-[28px] leading-none">{title}</h2>
      <span className="eyebrow">{eyebrow}</span>
    </div>
  );
}

function CategoryGrid({ cats, contagem, offset }: { cats: Catalogo["categorias"]; contagem: Map<number, number>; offset: number }) {
  return (
    <ul className="grid sm:grid-cols-2 sm:gap-x-8">
      {cats.map((c, i) => (
        <li key={c.id} className="border-b border-[var(--line)]">
          <Link href={`/c/${c.slug}`} className="group flex items-baseline gap-4 py-4">
            <span className="w-6 font-display text-[15px] italic text-[var(--muted)]">{String(offset + i + 1).padStart(2, "0")}</span>
            <span className="flex-1 text-[15.5px] font-medium tracking-[-0.01em]">{c.nome}</span>
            <span className="text-[12px] tabular-nums text-[var(--muted)]">{contagem.get(c.id) ?? 0}</span>
            <IconArrow className="h-4 w-4 self-center text-[var(--muted)] transition group-hover:translate-x-1 group-hover:text-[var(--ink)]" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
