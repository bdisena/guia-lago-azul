"use client";
import Link from "next/link";
import { useCondo } from "./CondoProvider";

export function Header({ back, title }: { back?: string; title?: string }) {
  const { atual } = useCondo();
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-white/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        {back ? (
          <Link href={back} className="-ml-1 grid h-9 w-9 place-items-center rounded-full text-xl hover:bg-lago-50" aria-label="Voltar">←</Link>
        ) : (
          <Link href="/" className="grid h-9 w-9 place-items-center rounded-xl bg-lago-600 text-lg font-black text-white" aria-label="Início">G</Link>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold leading-tight">{title ?? "Guia dos Condomínios"}</p>
          <p className="muted truncate text-xs">{atual ? `Você está no ${atual.nome}` : "Lago Azul · Lagoa Bonita · Portal do Lago · Recanto · Jacarandá"}</p>
        </div>
      </div>
    </header>
  );
}
