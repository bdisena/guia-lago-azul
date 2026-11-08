import { Header } from "@/components/Header";
import { ClubeList } from "@/components/ClubeList";
import { getVantagens } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Clube de Vantagens" };

export default async function ClubePage() {
  const vantagens = await getVantagens();
  return (
    <>
      <Header back="/" title="Clube de Vantagens" />
      <div className="space-y-4 px-4 pt-4">
        <div>
          <h1 className="text-2xl font-extrabold">Clube de Vantagens</h1>
          <p className="muted text-sm">Condições exclusivas para moradores dos 5 condomínios.</p>
        </div>
        <ClubeList vantagens={vantagens} />
      </div>
    </>
  );
}
