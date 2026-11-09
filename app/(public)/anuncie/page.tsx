import { Header } from "@/components/Header";
import { PageIntro } from "@/components/PageIntro";
import { waLink } from "@/lib/whatsapp";

export const metadata = { title: "Seja parceiro" };

const CONTATO = process.env.NEXT_PUBLIC_CONTATO_WHATSAPP ?? "";

const planos = [
  { nome: "Listagem", preco: "Cortesia", itens: ["Nome, telefone e especialidade", "Contato direto via WhatsApp", "Entrada por indicação de moradores"] },
  { nome: "Parceiro do Guia", preco: "R$ 59 – 99 / mês", itens: ["Posição de destaque na especialidade", "Apresentação em cartão exclusivo", "Portfólio de serviços realizados", "Prioridade no Orçamento Express", "Relatório mensal de contatos"], top: true },
  { nome: "Selo Verificado", preco: "Anual", itens: ["Checagem cadastral e de antecedentes", "Validação de referências com moradores", "Selo ✓ Verificado no perfil"] },
  { nome: "Espaço patrocinado", preco: "R$ 250 / mês", itens: ["Presença na página inicial e entre especialidades", "Indicado para lojas, marmorarias, energia solar e piscinas", "Relatório de cliques"] },
  { nome: "Orçamentos qualificados", preco: "R$ 35 / lead", itens: ["Pedidos de moradores dos cinco residenciais", "No máximo três parceiros por pedido"] },
];

export default function AnunciePage() {
  const msg = "Olá! Tenho interesse em ser parceiro do Guia dos Condomínios.";
  return (
    <>
      <Header back="/" />
      <PageIntro eyebrow="Para empresas e profissionais" title={<>Seja apresentado a<br />~2.000 residências.</>}>
        Lago Azul, Lagoa Bonita, Portal do Lago, Recanto dos Pássaros e Jacarandá: moradores que contratam serviços todas as semanas.
      </PageIntro>
      <div className="space-y-4 px-4 pt-8">
        {planos.map((p) => (
          <section key={p.nome} className={p.top ? "bg-[var(--ink)] p-6 text-white" : "card p-6"}>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-[24px] leading-tight">{p.nome}</h2>
              <span className={`eyebrow ${p.top ? "eyebrow-light" : ""} shrink-0`}>{p.preco}</span>
            </div>
            <ul className={`mt-4 space-y-2 border-t pt-4 text-[14px] ${p.top ? "border-white/15 text-white/75" : "border-[var(--line)] text-[var(--muted)]"}`}>
              {p.itens.map((i) => <li key={i} className="flex gap-3"><span aria-hidden="true">—</span>{i}</li>)}
            </ul>
          </section>
        ))}
        {CONTATO && (
          <a href={waLink(CONTATO, msg)} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full !py-4">Falar com a curadoria</a>
        )}
      </div>
    </>
  );
}
