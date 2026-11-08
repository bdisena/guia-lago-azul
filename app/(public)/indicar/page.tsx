import { Header } from "@/components/Header";
import { IndicarForm } from "@/components/IndicarForm";
import { getCatalogo } from "@/lib/data";

export const metadata = { title: "Indicar prestador" };

export default async function IndicarPage() {
  const { categorias } = await getCatalogo();
  return (
    <>
      <Header back="/" title="Indicar prestador" />
      <div className="space-y-4 px-4 pt-4">
        <div>
          <h1 className="text-2xl font-extrabold">Indique um bom profissional</h1>
          <p className="muted text-sm">Ajude seus vizinhos: indique quem fez um bom trabalho na sua casa.</p>
        </div>
        <IndicarForm categorias={categorias} />
      </div>
    </>
  );
}
