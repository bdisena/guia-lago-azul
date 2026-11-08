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
      <footer className="muted px-4 pt-8 text-center text-xs">
        <a href="/sobre" className="underline">Sobre o guia, privacidade e remoção de cadastro</a>
      </footer>
    </>
  );
}
