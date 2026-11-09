"use client";
import type { Vantagem } from "@/lib/types";
import { waLink, APP_NAME } from "@/lib/whatsapp";
import { track } from "@/lib/track";
import { useCondo } from "./CondoProvider";
import { IconArrow } from "./Icons";

export function ClubeList({ vantagens }: { vantagens: Vantagem[] }) {
  const { atual } = useCondo();
  if (!vantagens.length)
    return (
      <div className="border border-[var(--line-strong)] p-7">
        <p className="eyebrow">Em breve</p>
        <p className="mt-3 font-display text-[26px] leading-tight">Uma seleção de privilégios está sendo preparada.</p>
        <p className="muted mt-3 text-[14px] leading-relaxed">Restaurantes, serviços automotivos, pet care e mais, com condições reservadas aos moradores dos cinco residenciais.</p>
        <a href="/anuncie" className="link-arrow mt-6 text-[var(--ink)]">Quero oferecer um privilégio <IconArrow className="h-4 w-4" /></a>
      </div>
    );
  return (
    <ul className="space-y-4">
      {vantagens.map((v) => {
        const href = v.whatsapp
          ? waLink(v.whatsapp, `Olá! Sou morador(a) ${atual ? `do ${atual.nome}` : "dos condomínios"} e vi o privilégio "${v.oferta}" no ${APP_NAME}.`)
          : v.link;
        return (
          <li key={v.id} className="card p-6">
            <p className="eyebrow">{v.segmento ?? "Privilégio"}</p>
            <p className="mt-2 font-display text-[24px] leading-tight">{v.parceiro}</p>
            <p className="mt-2 text-[15px] leading-relaxed">{v.oferta}</p>
            {href && (
              <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-5 w-full"
                onClick={() => track("click_clube", { clube: v.id, condominio: atual?.slug })}>
                Utilizar privilégio
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
