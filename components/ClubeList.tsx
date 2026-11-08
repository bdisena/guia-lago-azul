"use client";
import type { Vantagem } from "@/lib/types";
import { waLink, APP_NAME } from "@/lib/whatsapp";
import { track } from "@/lib/track";
import { useCondo } from "./CondoProvider";

export function ClubeList({ vantagens }: { vantagens: Vantagem[] }) {
  const { atual } = useCondo();
  if (!vantagens.length)
    return (
      <div className="card p-6 text-center">
        <p className="text-4xl">🎁</p>
        <p className="mt-2 font-semibold">Novos parceiros chegando em breve</p>
        <p className="muted mt-1 text-sm">Restaurantes, lava-rápidos, pet shops e mais, com condições exclusivas para moradores.</p>
        <a href="/anuncie" className="btn btn-ghost mt-4">Tenho um negócio e quero participar</a>
      </div>
    );
  return (
    <ul className="space-y-3">
      {vantagens.map((v) => {
        const href = v.whatsapp
          ? waLink(v.whatsapp, `Olá! Sou morador(a) ${atual ? `do ${atual.nome}` : "dos condomínios"} e vi a oferta "${v.oferta}" no ${APP_NAME}.`)
          : v.link;
        return (
          <li key={v.id} className="card p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-ouro-50 text-2xl">🎁</div>
              <div className="flex-1">
                <p className="font-bold">{v.parceiro}</p>
                {v.segmento && <p className="muted text-xs">{v.segmento}</p>}
                <p className="mt-1 text-[15px] font-medium text-lago-700">{v.oferta}</p>
              </div>
            </div>
            {href && (
              <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-zap mt-3 w-full text-sm"
                onClick={() => track("click_clube", { clube: v.id, condominio: atual?.slug })}>
                Quero esta vantagem
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
