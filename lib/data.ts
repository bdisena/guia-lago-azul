import { unstable_cache } from "next/cache";
import { publicClient } from "./supabase/public";
import type { Catalogo, Prestador, Vantagem } from "./types";

const PRESTADOR_COLS =
  "id,slug,nome,telefones,whatsapp,descricao,servicos,plano,verificado,mais_recomendado,origem,indicado_em,atende_todos,fotos,ativo,prestador_categorias(categoria_id),prestador_condominios(condominio_id)";

type RawPrestador = Omit<Prestador, "categoria_ids" | "condominio_ids"> & {
  prestador_categorias: { categoria_id: number }[];
  prestador_condominios: { condominio_id: number }[];
};

function mapPrestador(r: RawPrestador): Prestador {
  const { prestador_categorias, prestador_condominios, ...rest } = r;
  return {
    ...rest,
    categoria_ids: prestador_categorias.map((x) => x.categoria_id),
    condominio_ids: prestador_condominios.map((x) => x.condominio_id),
  };
}

/** Ordem de exibição: Destaque > Verificado > Mais recomendado > recomendação > nome. */
export function rankPrestador(p: Prestador): number {
  return (p.plano === "destaque" ? 1000 : 0) + (p.verificado ? 100 : 0) + (p.mais_recomendado ? 10 : 0) +
    (p.origem === "recomendacao" ? 1 : 0);
}
export function sortPrestadores(list: Prestador[]): Prestador[] {
  return [...list].sort((a, b) => rankPrestador(b) - rankPrestador(a) || a.nome.localeCompare(b.nome, "pt"));
}

export const getCatalogo = unstable_cache(
  async (): Promise<Catalogo> => {
    const sb = publicClient();
    const today = new Date().toISOString().slice(0, 10);
    const [cond, cat, prest, ban] = await Promise.all([
      sb.from("condominios").select("id,slug,nome").order("id"),
      sb.from("categorias").select("id,slug,nome,icone,ordem").order("ordem"),
      sb.from("prestadores").select(PRESTADOR_COLS),
      sb.from("banners").select("id,anunciante,titulo,subtitulo,imagem_url,link,posicao,inicio,fim").eq("ativo", true),
    ]);
    for (const r of [cond, cat, prest, ban]) if (r.error) throw r.error;
    return {
      condominios: cond.data!,
      categorias: cat.data!,
      prestadores: sortPrestadores((prest.data as unknown as RawPrestador[]).map(mapPrestador)),
      banners: (ban.data ?? []).filter((b) => (!b.inicio || b.inicio <= today) && (!b.fim || b.fim >= today)),
    };
  },
  ["catalogo"],
  { revalidate: 300, tags: ["catalogo"] },
);

export const getVantagens = unstable_cache(
  async (): Promise<Vantagem[]> => {
    const { data, error } = await publicClient()
      .from("clube_vantagens").select("id,parceiro,segmento,oferta,whatsapp,link").eq("ativo", true).order("parceiro");
    if (error) throw error;
    return data;
  },
  ["vantagens"],
  { revalidate: 300, tags: ["catalogo"] },
);

/** Prestador atende o condomínio? (atende_todos ou vínculo explícito) */
export function atende(p: Prestador, condominioId: number | null): boolean {
  if (!condominioId) return true;
  return p.atende_todos || p.condominio_ids.includes(condominioId);
}
