import { Header } from "@/components/Header";
import { waLink } from "@/lib/whatsapp";

export const metadata = { title: "Anuncie no Guia" };

const CONTATO = process.env.NEXT_PUBLIC_CONTATO_WHATSAPP ?? "";

const planos = [
  { nome: "Básico", preco: "Grátis", itens: ["Nome, telefone e categoria", "Botão de WhatsApp", "Entrada por indicação de moradores"] },
  { nome: "Destaque", preco: "R$ 59 a R$ 99/mês", itens: ["Fixado no topo da categoria", "Moldura e selo de Parceiro", "Galeria de fotos de serviços", "Prioridade no Orçamento Express", "Relatório mensal de cliques"], top: true },
  { nome: "Selo Verificado", preco: "Anual", itens: ["Checagem cadastral e de antecedentes", "Validação de referências com vizinhos", "Selo ✓ Verificado no perfil"] },
  { nome: "Banner regional", preco: "R$ 250/mês", itens: ["Espaço no topo e entre categorias", "Ideal para lojas, marmorarias, solar, piscinas", "Relatório de cliques"] },
  { nome: "Leads de orçamento", preco: "R$ 35/lead", itens: ["Pedidos qualificados de moradores", "Até 3 parceiros por pedido"] },
];

export default function AnunciePage() {
  const msg = "Olá! Tenho interesse em anunciar no Guia dos Condomínios.";
  return (
    <>
      <Header back="/" title="Anuncie" />
      <div className="space-y-4 px-4 pt-4">
        <div className="rounded-3xl bg-lago-900 p-5 text-white">
          <h1 className="text-2xl font-extrabold">Seja encontrado por ~2.000 residências</h1>
          <p className="mt-1 text-sm text-white/80">Lago Azul, Lagoa Bonita, Portal do Lago, Recanto dos Pássaros e Jacarandá: moradores que contratam serviços toda semana.</p>
        </div>
        {planos.map((p) => (
          <section key={p.nome} className={`card p-4 ${p.top ? "border-2 border-ouro-400" : ""}`}>
            <div className="flex items-baseline justify-between">
              <h2 className="font-bold">{p.nome}</h2>
              <span className="font-semibold text-lago-700">{p.preco}</span>
            </div>
            <ul className="muted mt-2 space-y-1 text-sm">{p.itens.map((i) => <li key={i}>• {i}</li>)}</ul>
          </section>
        ))}
        {CONTATO && (
          <a href={waLink(CONTATO, msg)} target="_blank" rel="noopener noreferrer" className="btn btn-zap w-full py-3.5">Falar com a equipe do Guia</a>
        )}
      </div>
    </>
  );
}
