"use client";
import Link from "next/link";
import type { Condominio, Prestador } from "@/lib/types";
import { WhatsAppButton } from "./WhatsAppButton";
import { IconArrow } from "./Icons";

export function Selos({ p, condominios, dark = false, semParceiro = false }: { p: Prestador; condominios: Condominio[]; dark?: boolean; semParceiro?: boolean }) {
  const indicado = condominios.find((c) => c.id === p.indicado_em);
  const items: string[] = [];
  if (p.plano === "destaque" && !semParceiro) items.push("Parceiro");
  if (p.verificado) items.push("Verificado");
  if (p.mais_recomendado) items.push("Mais recomendado");
  return (
    <div className="space-y-1.5">
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((t) => (
            <span key={t} className={`inline-flex items-center gap-1 border px-1.5 py-[3px] text-[9.5px] font-semibold uppercase leading-none tracking-[0.16em] ${
              dark ? "border-white/30 text-white/85" : t === "Parceiro" ? "border-[var(--ink)] bg-[var(--ink)] text-white" : "border-[var(--line-strong)] text-[var(--ink)]"}`}>
              {(t === "Verificado") && <span aria-hidden="true">✓</span>}{t}
            </span>
          ))}
        </div>
      )}
      {indicado && <p className={`font-display text-[14px] italic ${dark ? "text-white/55" : "text-[var(--muted)]"}`}>Indicado por moradores do {indicado.nome}</p>}
    </div>
  );
}

export function ProviderCard({ p, condominios, categoriaNome }: { p: Prestador; condominios: Condominio[]; categoriaNome?: string }) {
  const destaque = p.plano === "destaque";
  return (
    <article className={`relative p-5 ${destaque ? "bg-[var(--ink)] text-white" : "card"}`}>
      <Link href={`/p/${p.slug}`} className="group block">
        <div className="flex items-start gap-4">
          <Avatar nome={p.nome} foto={destaque ? p.fotos[0] : undefined} destaque={destaque} />
          <div className="min-w-0 flex-1 pr-2">
            <p className={`eyebrow ${destaque ? "eyebrow-light" : ""} truncate`}>{destaque && <span className="text-white">Parceiro do Guia · </span>}{categoriaNome ?? p.servicos.join(" · ")}</p>
            <h3 className="mt-1 font-display text-[22px] leading-[1.1]">{p.nome}</h3>
            <div className="mt-2.5"><Selos p={p} condominios={condominios} dark={destaque} semParceiro /></div>
          </div>
        </div>
      </Link>
      <div className={`mt-4 flex items-center gap-3 border-t pt-4 ${destaque ? "border-white/15" : "border-[var(--line)]"}`}>
        <div className="flex-1"><WhatsAppButton prestador={p} dark={destaque} /></div>
        <Link href={`/p/${p.slug}`} className={`link-arrow ${destaque ? "text-white/70 hover:text-white" : "text-[var(--muted)] hover:text-[var(--ink)]"}`}
          aria-label={`Ver perfil de ${p.nome}`}>
          Perfil <IconArrow className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

export function Avatar({ nome, foto, destaque, size = 52 }: { nome: string; foto?: string; destaque?: boolean; size?: number }) {
  const ini = nome.replace(/[^\p{L}\p{N} ]/gu, "").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  if (foto)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={foto} alt="" width={size} height={size} className="shrink-0 object-cover grayscale-[15%]" style={{ width: size, height: size }} />;
  return (
    <div className={`grid shrink-0 place-items-center font-display ${destaque ? "border border-white/30 text-white" : "bg-[var(--ink)] text-white"}`}
      style={{ width: size, height: size, fontSize: size / 2.4 }} aria-hidden="true">
      {ini || "·"}
    </div>
  );
}
