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
      <Header back={cats[0] ? `/c/${cats[0].slug}` : "/"} title={p.nome} />
      <TrackView tipo="view_prestador" prestador={p.id} />
      <div className="space-y-4 px-4 pt-4">
        <section className={`card p-5 ${pago ? "border-2 border-ouro-400 bg-gradient-to-br from-ouro-50 to-white" : ""}`}>
          <div className="flex items-start gap-4">
            <Avatar nome={p.nome} foto={pago ? p.fotos[0] : undefined} destaque={pago} size={64} />
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-extrabold leading-tight">{p.nome}</h1>
              <div className="mt-1 flex flex-wrap gap-x-2 text-sm">
                {cats.map((c) => (
                  <Link key={c.id} href={`/c/${c.slug}`} className="text-lago-600">{c.icone} {c.nome}</Link>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3"><Selos p={p} condominios={condominios} /></div>
          {p.descricao && <p className="mt-3 whitespace-pre-line text-[15px]">{p.descricao}</p>}
          <div className="mt-4"><WhatsAppButton prestador={p} size="lg" destaque={pago} /></div>
          <p className="muted mt-2 text-center text-xs">A mensagem já vai pronta, com o nome do seu condomínio.</p>
        </section>

        {pago && p.fotos.length > 0 && (
          <section>
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-lago-700">Serviços realizados</h2>
            <div className="no-scrollbar -mx-4 flex snap-x gap-2 overflow-x-auto px-4">
              {p.fotos.map((f) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={f} src={f} alt={`Serviço de ${p.nome}`} className="h-44 w-60 shrink-0 snap-start rounded-xl object-cover" loading="lazy" />
              ))}
            </div>
          </section>
        )}

        <section className="card divide-y divide-[var(--line)] text-sm">
          {p.servicos.length > 0 && <Row k="Serviços">{p.servicos.join(", ")}</Row>}
          <Row k="Abrangência">{abrangencia}</Row>
          <Row k="Telefone">{p.telefones.map(formatPhone).join(" / ")}</Row>
          <Row k="Como chegou ao guia">{ORIGEM[p.origem]}</Row>
        </section>

        <p className="muted px-1 text-xs leading-relaxed">
          As indicações refletem a experiência de moradores e não são garantia de qualidade, preço ou disponibilidade.
          {p.verificado ? " Este prestador passou pela checagem cadastral e de referências do guia." : ""}{" "}
          É este prestador? <Link href="/sobre#prestador" className="underline">Atualize ou remova seus dados</Link>.
        </p>
      </div>
    </>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 px-4 py-3">
      <span className="muted w-32 shrink-0">{k}</span>
      <span className="flex-1">{children}</span>
    </div>
  );
}
