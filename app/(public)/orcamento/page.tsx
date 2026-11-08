import { Header } from "@/components/Header";
import { OrcamentoForm } from "@/components/OrcamentoForm";
import { getCatalogo } from "@/lib/data";

export const metadata = { title: "Orçamento Express" };

export default async function OrcamentoPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams;
  const { categorias } = await getCatalogo();
  return (
    <>
      <Header back="/" title="Orçamento Express" />
      <div className="space-y-4 px-4 pt-4">
        <div>
          <h1 className="text-2xl font-extrabold">Orçamento Express</h1>
          <p className="muted text-sm">Conte o que precisa. Até 3 parceiros credenciados chamam você no WhatsApp. Grátis para moradores.</p>
        </div>
        <OrcamentoForm categorias={categorias} categoriaInicial={categoria ? Number(categoria) : undefined} />
      </div>
    </>
  );
}
