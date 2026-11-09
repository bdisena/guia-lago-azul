import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { TrackView } from "@/components/TrackView";
import { Avatar, Selos } from "@/components/ProviderCard";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getCatalogo } from "@/lib/data";
import { formatPhone } from "@/lib/phone";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getCatalogo()).prestadores.find((x) => x.slug === slug);
  return { title: p?.nome ?? "Prestador", robots: { index: false } };
}

const ORIGEM: Record<string, string> = {
  recomendacao: "Recebeu recomendação positiva explícita de moradores no grupo.",
  pedido: "Foi indicado por moradores em resposta a um pedido de indicação no grupo.",
  compartilhado: "Contato compartilhado por moradores no grupo.",
  cadastro: "Cadastrado e aprovado pela curadoria do guia.",
};

export default async function PrestadorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { prestadores, categorias, condominios } = await getCatalogo();
  const p = prestadores.find((x) => x.slug === slug);
  if (!p) notFound();
  const cats = categorias.filter((c) => p.categoria_ids.includes(c.id));
  const pago = p.plano === "destaque";
  const abrangencia = p.atende_todos
    ? "Atende os 5 condomínios"
    : `Atende: ${condominios.filter((c) => p.condominio_ids.includes(c.id)).map((c) => c.nome).join(", ")}`;

  return (
    <>
      <Header back={cats[0] ? `/c/${cats[0].slug}` : "/"} />
      <TrackView tipo="view_prestador" prestador={p.id} />
      <section className="bg-[var(--ink)] px-4 pb-8 pt-6 text-white">
        <div className="flex items-center justify-between">
          <p className="eyebrow eyebrow-light">{cats.map((c) => c.nome).join(" · ")}</p>
          {pago && <p className="eyebrow eyebrow-light">Parceiro do Guia</p>}
        </div>
        <div className="mt-5 flex items-end gap-4">
          <Avatar nome={p.nome} foto={pago ? p.fotos[0] : undefined} destaque size={72} />
          <h1 className="fade-up flex-1 font-display text-[34px] leading-[1.02]">{p.nome}</h1>
        </div>
        <div className="mt-5"><Selos p={p} condominios={condominios} dark semParceiro /></div>
        {p.descricao && <p className="mt-5 whitespace-pre-line text-[15px] leading-relaxed text-white/75">{p.descricao}</p>}
        <div className="mt-7"><WhatsAppButton prestador={p} size="lg" dark /></div>
        <p className="mt-3 text-center text-[12px] text-white/45">A mensagem segue pronta, identificando o seu residencial.</p>
      </section>

      <div className="space-y-10 px-4 pt-8">
        {pago && p.fotos.length > 0 && (
          <section>
            <h2 className="mb-4 border-b border-[var(--ink)] pb-3 font-display text-[24px] leading-none">Portfólio</h2>
            <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4">
              {p.fotos.map((f) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={f} src={f} alt={`Serviço de ${p.nome}`} className="h-48 w-64 shrink-0 snap-start object-cover" loading="lazy" />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-1 border-b border-[var(--ink)] pb-3 font-display text-[24px] leading-none">Ficha</h2>
          <dl>
            {p.servicos.length > 0 && <Row k="Serviços">{p.servicos.join(", ")}</Row>}
            <Row k="Abrangência">{abrangencia}</Row>
            <Row k="Telefone">{p.telefones.map(formatPhone).join(" / ")}</Row>
            <Row k="Origem da indicação">{ORIGEM[p.origem]}</Row>
          </dl>
        </section>

        <p className="text-[12px] leading-relaxed text-[var(--muted)]">
          As indicações refletem a experiência de moradores e não constituem garantia de qualidade, preço ou disponibilidade.
          {p.verificado ? " Este profissional passou pela checagem cadastral e de referências do Guia." : ""}{" "}
          É este profissional? <Link href="/sobre#prestador" className="text-[var(--ink)] underline underline-offset-2">Atualize ou remova seus dados</Link>.
        </p>
      </div>
    </>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[8.5rem_1fr] gap-3 border-b border-[var(--line)] py-4 text-[14.5px]">
      <dt className="eyebrow pt-[3px]">{k}</dt>
      <dd>{children}</dd>
    </div>
  );
}
