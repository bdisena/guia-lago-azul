import { Header } from "@/components/Header";
import { HomeCatalog } from "@/components/HomeCatalog";
import { getCatalogo } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const catalogo = await getCatalogo();
  return (
    <>
      <Header />
      <HomeCatalog catalogo={catalogo} />
      <footer className="mx-4 mt-12 border-t border-[var(--line)] pt-6 text-center">
        <p className="font-display text-[15px] italic text-[var(--muted)]">Lago Azul · Lagoa Bonita · Portal do Lago · Recanto dos Pássaros · Jacarandá</p>
        <a href="/sobre" className="eyebrow mt-3 inline-block hover:text-[var(--ink)]">Sobre o Guia · Privacidade</a>
      </footer>
    </>
  );
}
