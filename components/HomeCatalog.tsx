"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Catalogo } from "@/lib/types";
import { normalizeText } from "@/lib/slug";
import { useCondo } from "./CondoProvider";
import { CondoChips } from "./CondoPicker";
import { ProviderCard } from "./ProviderCard";
import { BannerSlot } from "./BannerSlot";

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
    <div className="space-y-5 px-4 pt-4">
      <section className="rounded-3xl bg-gradient-to-br from-lago-700 via-lago-600 to-lago-500 p-5 text-white shadow-sm">
        <h1 className="text-2xl font-extrabold leading-tight">Quem os vizinhos indicam?</h1>
        <p className="mt-1 text-sm text-white/85">{prestadores.length} prestadores recomendados nos grupos dos condomínios. Grátis, sem cadastro.</p>
        <label className="relative mt-4 block">
          <span className="sr-only">Buscar serviço ou profissional</span>
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-[var(--muted)]" aria-hidden="true">🔎</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ex.: eletricista, piscina, diarista…"
            className="input !border-transparent !py-3.5 pl-11 text-[var(--ink)] shadow-md"
            autoComplete="off"
            enterKeyHint="search"
          />
        </label>
      </section>

      <CondoChips />

      {termos.length > 0 ? (
        <section aria-live="polite" className="space-y-3">
          {catsEncontradas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {catsEncontradas.map((c) => (
                <Link key={c.id} href={`/c/${c.slug}`} className="rounded-full bg-lago-50 px-3 py-1.5 text-sm font-medium text-lago-700">
                  {c.icone} {c.nome} →
                </Link>
              ))}
            </div>
          )}
          <p className="muted text-sm">{resultados.length} resultado{resultados.length === 1 ? "" : "s"} para “{q.trim()}”</p>
          {resultados.map((p) => <ProviderCard key={p.id} p={p} condominios={condominios} />)}
          {resultados.length === 0 && (
            <div className="card p-5 text-center">
              <p className="font-semibold">Ninguém indicado para isso ainda.</p>
              <p className="muted mt-1 text-sm">Peça um orçamento e a gente encontra parceiros para você.</p>
              <Link href="/orcamento" className="btn btn-primary mt-3">Solicitar Orçamento Express</Link>
            </div>
          )}
        </section>
      ) : (
        <>
          <BannerSlot banners={banners} posicao="topo" />

          {destaques.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-bold">Parceiros em destaque</h2>
              {destaques.map((p) => <ProviderCard key={p.id} p={p} condominios={condominios} />)}
            </section>
          )}

          <section>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-lg font-bold">Categorias</h2>
              <span className="muted text-xs">{categorias.length} tipos de serviço</span>
            </div>
            <CategoryGrid cats={categorias.slice(0, 9)} contagem={contagem} />
            <div className="my-3 empty:hidden"><BannerSlot banners={banners} posicao="entre_categorias" /></div>
            <CategoryGrid cats={categorias.slice(9)} contagem={contagem} />
          </section>

          <Link href="/orcamento" className="card flex items-center gap-3 border-lago-200 bg-lago-50 p-4">
            <span className="text-3xl" aria-hidden="true">📝</span>
            <span className="flex-1">
              <span className="block font-bold">Orçamento Express</span>
              <span className="muted block text-sm">Descreva o serviço e até 3 parceiros chamam você.</span>
            </span>
            <span className="text-lago-600">→</span>
          </Link>
        </>
      )}
    </div>
  );
}

function CategoryGrid({ cats, contagem }: { cats: Catalogo["categorias"]; contagem: Map<number, number> }) {
  return (
    <ul className="mt-2.5 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
      {cats.map((c) => (
        <li key={c.id}>
          <Link
            href={`/c/${c.slug}`}
            className="card flex h-full flex-col items-center justify-center gap-1 px-1.5 py-3 text-center transition hover:border-lago-200 hover:bg-lago-50"
          >
            <span className="text-2xl" aria-hidden="true">{c.icone}</span>
            <span className="text-[12.5px] font-medium leading-tight">{c.nome}</span>
            <span className="muted text-[11px]">{contagem.get(c.id) ?? 0}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
