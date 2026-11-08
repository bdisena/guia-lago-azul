"use client";
import Link from "next/link";
import type { Condominio, Prestador } from "@/lib/types";
import { WhatsAppButton } from "./WhatsAppButton";

export function Selos({ p, condominios }: { p: Prestador; condominios: Condominio[] }) {
  const indicado = condominios.find((c) => c.id === p.indicado_em);
  return (
    <div className="flex flex-wrap gap-1.5">
      {p.plano === "destaque" && <Tag className="bg-ouro-400 text-white">★ Parceiro</Tag>}
      {p.verificado && <Tag className="bg-lago-600 text-white">✓ Verificado</Tag>}
      {p.mais_recomendado && <Tag className="bg-ouro-50 text-ouro-600 ring-1 ring-ouro-200">👍 Mais recomendado</Tag>}
      {indicado && <Tag className="bg-lago-50 text-lago-700">Indicado por moradores do {indicado.nome}</Tag>}
    </div>
  );
}

function Tag({ className, children }: { className: string; children: React.ReactNode }) {
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold leading-5 ${className}`}>{children}</span>;
}

export function ProviderCard({ p, condominios, categoriaNome }: { p: Prestador; condominios: Condominio[]; categoriaNome?: string }) {
  const destaque = p.plano === "destaque";
  return (
    <article
      className={`card relative overflow-hidden p-4 ${destaque ? "border-2 border-ouro-400 bg-gradient-to-br from-ouro-50 to-white shadow-sm" : ""}`}
    >
      <Link href={`/p/${p.slug}`} className="block">
        <div className="flex items-start gap-3">
          <Avatar nome={p.nome} foto={destaque ? p.fotos[0] : undefined} destaque={destaque} />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold leading-tight">{p.nome}</h3>
            <p className="muted mt-0.5 truncate text-sm">{categoriaNome ?? p.servicos.join(" · ")}</p>
            <div className="mt-2"><Selos p={p} condominios={condominios} /></div>
          </div>
        </div>
      </Link>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1"><WhatsAppButton prestador={p} destaque={destaque} /></div>
        <Link href={`/p/${p.slug}`} className="btn btn-ghost text-sm" aria-label={`Ver detalhes de ${p.nome}`}>Ver</Link>
      </div>
    </article>
  );
}

export function Avatar({ nome, foto, destaque, size = 48 }: { nome: string; foto?: string; destaque?: boolean; size?: number }) {
  const ini = nome.replace(/[^\p{L}\p{N} ]/gu, "").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  if (foto)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={foto} alt="" width={size} height={size} className="shrink-0 rounded-xl object-cover" style={{ width: size, height: size }} />;
  return (
    <div
      className={`grid shrink-0 place-items-center rounded-xl font-bold ${destaque ? "bg-ouro-400 text-white" : "bg-lago-100 text-lago-700"}`}
      style={{ width: size, height: size, fontSize: size / 2.8 }}
      aria-hidden="true"
    >
      {ini || "?"}
    </div>
  );
}
