import { Header } from "@/components/Header";
import { PageIntro } from "@/components/PageIntro";
import { IndicarForm } from "@/components/IndicarForm";
import { getCatalogo } from "@/lib/data";

export const metadata = { title: "Indicar prestador" };

export default async function IndicarPage() {
  const { categorias } = await getCatalogo();
  return (
    <>
      <Header back="/" />
      <PageIntro eyebrow="Indicação" title={<>Compartilhe um<br />profissional de confiança.</>}>Quem fez um ótimo trabalho na sua casa merece ser lembrado pelos vizinhos.</PageIntro>
      <div className="px-4 pt-8">
        <IndicarForm categorias={categorias} />
      </div>
    </>
  );
}
