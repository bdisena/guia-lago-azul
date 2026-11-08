import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { CategoryList } from "@/components/CategoryList";
import { TrackView } from "@/components/TrackView";
import { getCatalogo } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { categorias } = await getCatalogo();
  const c = categorias.find((x) => x.slug === slug);
  return { title: c ? `${c.nome} indicados pelos vizinhos` : "Categoria" };
}

export default async function CategoriaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { categorias, prestadores, condominios, banners } = await getCatalogo();
  const categoria = categorias.find((c) => c.slug === slug);
  if (!categoria) notFound();
  const lista = prestadores.filter((p) => p.categoria_ids.includes(categoria.id));
  return (
    <>
      <Header back="/" title={categoria.nome} />
      <TrackView tipo="view_categoria" categoria={categoria.id} />
      <CategoryList categoria={categoria} prestadores={lista} condominios={condominios} banners={banners} />
    </>
  );
}
