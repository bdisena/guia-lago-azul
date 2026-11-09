"use client";
import Link from "next/link";
import { useCondo } from "./CondoProvider";
import { IconBack } from "./Icons";

export function Header({ back, title }: { back?: string; title?: string }) {
  const { atual } = useCondo();
  return (
    <header className="sticky top-0 z-20 bg-[var(--ink)] text-white pt-[env(safe-area-inset-top)]">
      <div className="flex h-14 items-center gap-3 px-4">
        {back ? (
          <Link href={back} className="-ml-1.5 grid h-9 w-9 place-items-center text-white/80 hover:text-white" aria-label="Voltar">
            <IconBack />
          </Link>
        ) : (
          <Link href="/" aria-label="Início" className="grid h-8 w-8 place-items-center border border-white/30 font-display text-lg leading-none">G</Link>
        )}
        <div className="min-w-0 flex-1">
          {title ? (
            <p className="truncate font-display text-[19px] leading-tight">{title}</p>
          ) : (
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.28em]">Guia dos Condomínios</p>
          )}
        </div>
        <span className="eyebrow eyebrow-light hidden max-w-[45%] truncate text-right min-[380px]:block">
          {atual ? atual.nome : "Private Concierge"}
        </span>
      </div>
    </header>
  );
}
