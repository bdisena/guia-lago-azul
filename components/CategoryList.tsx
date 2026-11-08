"use client";
import Link from "next/link";
import type { Banner, Categoria, Condominio, Prestador } from "@/lib/types";
import { useCondo } from "./CondoProvider";
import { CondoChips } from "./CondoPicker";
import { ProviderCard } from "./ProviderCard";
import { BannerSlot } from "./BannerSlot";

export function CategoryList({ categoria, prestadores, condominios, banners }: {
  categoria: Categoria; prestadores: Prestador[]; condominios: Condominio[]; banners: Banner[];
}) {
  const { atual } = useCondo();
  const lista = prestadores.filter((p) => !atual || p.atende_todos || p.condominio_ids.includes(atual.id));
  const destaques = lista.filter((p) => p.plano === "destaque");
  const recomendados = lista.filter((p) => p.plano !== "destaque" && (p.mais_recomendado || p.verificado));
  const demais = lista.filter((p) => p.plano !== "destaque" && !p.mais_recomendado && !p.verificado);

  return (
    <div className="space-y-4 px-4 pt-4">
      <div>
        <h1 className="text-2xl font-extrabold"><span aria-hidden="true">{categoria.icone}</span> {categoria.nome}</h1>
        <p className="muted text-sm">{lista.length} indicado{lista.length === 1 ? "" : "s"}{atual ? ` que atendem o ${atual.nome}` : " nos 5 condomínios"}</p>
      </div>
      <CondoChips />
      <Bloco titulo="Parceiros em destaque" lista={destaques} condominios={condominios} categoria={categoria.nome} />
      <Bloco titulo="Mais recomendados pelos vizinhos" lista={recomendados} condominios={condominios} categoria={categoria.nome} />
      {(destaques.length > 0 || recomendados.length > 0) && <BannerSlot banners={banners} posicao="entre_categorias" />}
      <Bloco titulo={destaques.length || recomendados.length ? "Outros indicados" : undefined} lista={demais} condominios={condominios} categoria={categoria.nome} />
      {lista.length === 0 && (
        <div className="card p-5 text-center">
          <p className="font-semibold">Ainda não há indicados aqui{atual ? ` para o ${atual.nome}` : ""}.</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href={`/orcamento?categoria=${categoria.id}`} className="btn btn-primary">Pedir Orçamento Express</Link>
            <Link href="/indicar" className="btn btn-ghost">Indicar um prestador</Link>
          </div>
        </div>
      )}
      {lista.length > 0 && (
        <Link href={`/orcamento?categoria=${categoria.id}`} className="card block p-4 text-center text-sm">
          Não achou o ideal? <span className="font-semibold text-lago-600">Peça um Orçamento Express →</span>
        </Link>
      )}
    </div>
  );
}

function Bloco({ titulo, lista, condominios, categoria }: { titulo?: string; lista: Prestador[]; condominios: Condominio[]; categoria: string }) {
  if (!lista.length) return null;
  return (
    <section className="space-y-3">
      {titulo && <h2 className="text-sm font-bold uppercase tracking-wide text-lago-700">{titulo}</h2>}
      {lista.map((p) => <ProviderCard key={p.id} p={p} condominios={condominios} categoriaNome={p.servicos.length > 1 ? p.servicos.join(" · ") : categoria} />)}
    </section>
  );
}
