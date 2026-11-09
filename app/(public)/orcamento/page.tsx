import { Header } from "@/components/Header";
import { PageIntro } from "@/components/PageIntro";
import { OrcamentoForm } from "@/components/OrcamentoForm";
import { getCatalogo } from "@/lib/data";

export const metadata = { title: "Orçamento Express" };

export default async function OrcamentoPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams;
  const { categorias } = await getCatalogo();
  return (
    <>
      <Header back="/" />
      <PageIntro eyebrow="Orçamento Express" title={<>Descreva o serviço.<br />Nós cuidamos do resto.</>}>Até três parceiros selecionados entram em contato pelo WhatsApp. Cortesia aos moradores.</PageIntro>
      <div className="px-4 pt-8">
        <OrcamentoForm categorias={categorias} categoriaInicial={categoria ? Number(categoria) : undefined} />
      </div>
    </>
  );
}
