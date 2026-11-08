export type Plano = "free" | "destaque" | "suspenso";
export type Origem = "recomendacao" | "pedido" | "compartilhado" | "cadastro";

export interface Condominio { id: number; slug: string; nome: string }
export interface Categoria { id: number; slug: string; nome: string; icone: string; ordem: number }

export interface Prestador {
  id: string;
  slug: string;
  nome: string;
  telefones: string[];
  whatsapp: string | null;
  descricao: string | null;
  servicos: string[];
  plano: Plano;
  verificado: boolean;
  mais_recomendado: boolean;
  origem: Origem;
  indicado_em: number | null;
  atende_todos: boolean;
  fotos: string[];
  ativo: boolean;
  categoria_ids: number[];
  condominio_ids: number[];
}

export interface Banner {
  id: string; anunciante: string; titulo: string; subtitulo: string | null;
  imagem_url: string | null; link: string | null; posicao: "topo" | "entre_categorias";
}
export interface Vantagem {
  id: string; parceiro: string; segmento: string | null; oferta: string; whatsapp: string | null; link: string | null;
}

export interface Catalogo {
  condominios: Condominio[];
  categorias: Categoria[];
  prestadores: Prestador[];
  banners: Banner[];
}
