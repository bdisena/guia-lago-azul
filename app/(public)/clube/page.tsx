import { Header } from "@/components/Header";
import { PageIntro } from "@/components/PageIntro";
import { ClubeList } from "@/components/ClubeList";
import { getVantagens } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Privilégios" };

export default async function ClubePage() {
  const vantagens = await getVantagens();
  return (
    <>
      <Header back="/" />
      <PageIntro eyebrow="Clube de Privilégios" title={<>Condições reservadas<br />aos moradores.</>}>
        Parceiros selecionados da região, com benefícios exclusivos para os cinco residenciais.
      </PageIntro>
      <div className="px-4 pt-8"><ClubeList vantagens={vantagens} /></div>
    </>
  );
}
