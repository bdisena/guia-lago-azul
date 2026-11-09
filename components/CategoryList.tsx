"use client";
import Link from "next/link";
import type { Banner, Categoria, Condominio, Prestador } from "@/lib/types";
import { useCondo } from "./CondoProvider";
import { CondoChips } from "./CondoPicker";
import { ProviderCard } from "./ProviderCard";
import { BannerSlot } from "./BannerSlot";
import { IconArrow } from "./Icons";

export function CategoryList({ categoria, prestadores, condominios, banners }: {
  categoria: Categoria; prestadores: Prestador[]; condominios: Condominio[]; banners: Banner[];
}) {
  const { atual } = useCondo();
  const lista = prestadores.filter((p) => !atual || p.atende_todos || p.condominio_ids.includes(atual.id));
  const destaques = lista.filter((p) => p.plano === "destaque");
  const recomendados = lista.filter((p) => p.plano !== "destaque" && (p.mais_recomendado || p.verificado));
  const demais = lista.filter((p) => p.plano !== "destaque" && !p.mais_recomendado && !p.verificado);

  return (
    <div>
      <section className="bg-[var(--ink)] px-4 pt-6 text-white">
        <p className="eyebrow eyebrow-light">Especialidade</p>
        <h1 className="fade-up mt-3 font-display text-[38px] leading-[1.04]">{categoria.nome}</h1>
        <p className="mt-2 text-[13px] text-white/60">
          {lista.length} {lista.length === 1 ? "profissional indicado" : "profissionais indicados"}{atual ? ` · atendem o ${atual.nome}` : " · nos 5 residenciais"}
        </p>
        <div className="mt-6"><CondoChips dark /></div>
      </section>

      <div className="space-y-10 px-4 pt-8">
        <Bloco titulo="Parceiros do Guia" lista={destaques} condominios={condominios} categoria={categoria.nome} />
        <Bloco titulo="Mais recomendados" lista={recomendados} condominios={condominios} categoria={categoria.nome} />
        {(destaques.length > 0 || recomendados.length > 0) && <BannerSlot banners={banners} posicao="entre_categorias" />}
        <Bloco titulo={destaques.length || recomendados.length ? "Também indicados" : "Indicados"} lista={demais} condominios={condominios} categoria={categoria.nome} />

        {lista.length === 0 && (
          <div className="border border-[var(--line-strong)] p-6">
            <p className="font-display text-[24px] leading-tight">Ainda não há indicações{atual ? ` para o ${atual.nome}` : ""}.</p>
            <div className="mt-5 grid gap-2">
              <Link href={`/orcamento?categoria=${categoria.id}`} className="btn btn-primary">Solicitar orçamento</Link>
              <Link href="/indicar" className="btn btn-ghost">Indicar um profissional</Link>
            </div>
          </div>
        )}
        {lista.length > 0 && (
          <Link href={`/orcamento?categoria=${categoria.id}`} className="group flex items-center justify-between border-y border-[var(--ink)] py-5">
            <span>
              <span className="eyebrow">Prefere que a gente cuide disso?</span>
              <span className="mt-1 block font-display text-[21px]">Solicite um Orçamento Express</span>
            </span>
            <IconArrow className="h-5 w-5 transition group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  );
}

function Bloco({ titulo, lista, condominios, categoria }: { titulo: string; lista: Prestador[]; condominios: Condominio[]; categoria: string }) {
  if (!lista.length) return null;
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between border-b border-[var(--ink)] pb-3">
        <h2 className="font-display text-[24px] leading-none">{titulo}</h2>
        <span className="eyebrow">{String(lista.length).padStart(2, "0")}</span>
      </div>
      {lista.map((p) => <ProviderCard key={p.id} p={p} condominios={condominios} categoriaNome={p.servicos.length > 1 ? p.servicos.join(" · ") : categoria} />)}
    </section>
  );
}
