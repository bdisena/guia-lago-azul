"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { normalizePhone, pickWhatsapp } from "@/lib/phone";
import { slugify } from "@/lib/slug";

const str = (f: FormData, k: string) => (f.get(k) as string | null)?.trim() || null;
const lines = (s: string | null) => (s ?? "").split(/[\n,;]+/).map((x) => x.trim()).filter(Boolean);

function refresh() {
  revalidateTag("catalogo");
  revalidatePath("/", "layout");
}

async function uniqueSlug(sb: Awaited<ReturnType<typeof requireAdmin>>["sb"], nome: string, id?: string) {
  const base = slugify(nome) || "prestador";
  let slug = base;
  for (let i = 2; ; i++) {
    const { data } = await sb.from("prestadores").select("id").eq("slug", slug).maybeSingle();
    if (!data || data.id === id) return slug;
    slug = `${base}-${i}`;
  }
}

export async function salvarPrestador(formData: FormData) {
  const { sb } = await requireAdmin();
  const id = str(formData, "id");
  const nome = str(formData, "nome");
  if (!nome) throw new Error("Nome obrigatório");
  const telefones = lines(str(formData, "telefones")).map((t) => normalizePhone(t)).filter(Boolean) as string[];
  const wInput = str(formData, "whatsapp");
  const categorias = formData.getAll("categorias").map(Number);
  const condominios = formData.getAll("condominios").map(Number);
  const row = {
    nome,
    telefones,
    whatsapp: wInput ? normalizePhone(wInput) : pickWhatsapp(telefones),
    descricao: str(formData, "descricao"),
    servicos: lines(str(formData, "servicos")),
    plano: (str(formData, "plano") ?? "free") as "free" | "destaque" | "suspenso",
    verificado: formData.get("verificado") === "on",
    mais_recomendado: formData.get("mais_recomendado") === "on",
    ativo: formData.get("ativo") === "on",
    atende_todos: formData.get("atende_todos") === "on",
    fotos: lines(str(formData, "fotos")),
    indicado_em: str(formData, "indicado_em") ? Number(str(formData, "indicado_em")) : null,
    origem: (str(formData, "origem") ?? "cadastro") as "recomendacao" | "pedido" | "compartilhado" | "cadastro",
    slug: await uniqueSlug(sb, nome, id ?? undefined),
  };
  let pid = id;
  if (id) {
    const { error } = await sb.from("prestadores").update(row).eq("id", id);
    if (error) throw error;
  } else {
    const { data, error } = await sb.from("prestadores").insert(row).select("id").single();
    if (error) throw error;
    pid = data.id;
  }
  await sb.from("prestador_categorias").delete().eq("prestador_id", pid!);
  if (categorias.length) await sb.from("prestador_categorias").insert(categorias.map((c) => ({ prestador_id: pid, categoria_id: c })));
  await sb.from("prestador_condominios").delete().eq("prestador_id", pid!);
  if (!row.atende_todos && condominios.length)
    await sb.from("prestador_condominios").insert(condominios.map((c) => ({ prestador_id: pid, condominio_id: c })));
  await sb.from("prestador_notas").upsert({ prestador_id: pid, nota: str(formData, "nota"), updated_at: new Date().toISOString() });
  refresh();
  redirect(`/admin/prestadores?salvo=${encodeURIComponent(nome)}`);
}

export async function alterarPlano(formData: FormData) {
  const { sb } = await requireAdmin();
  const id = String(formData.get("id"));
  const plano = String(formData.get("plano")) as "free" | "destaque" | "suspenso";
  const { error } = await sb.from("prestadores").update({ plano }).eq("id", id);
  if (error) throw error;
  refresh();
  revalidatePath("/admin/prestadores");
}

export async function excluirPrestador(formData: FormData) {
  const { sb } = await requireAdmin();
  await sb.from("prestadores").delete().eq("id", String(formData.get("id")));
  refresh();
  redirect("/admin/prestadores");
}

export async function aprovarIndicacao(formData: FormData) {
  const { sb } = await requireAdmin();
  const id = String(formData.get("id"));
  const { data: ind, error } = await sb.from("indicacoes").select("*").eq("id", id).single();
  if (error) throw error;
  const tel = normalizePhone(ind.telefone);
  const { data: cat } = ind.categoria_id
    ? await sb.from("categorias").select("nome").eq("id", ind.categoria_id).single()
    : { data: null };
  const { data: p, error: e2 } = await sb.from("prestadores").insert({
    nome: ind.nome_prestador,
    slug: await uniqueSlug(sb, ind.nome_prestador),
    telefones: tel ? [tel] : [],
    whatsapp: tel ? pickWhatsapp([tel]) : null,
    servicos: cat ? [cat.nome] : ind.categoria_texto ? [ind.categoria_texto] : [],
    origem: ind.comentario ? "recomendacao" : "compartilhado",
    indicado_em: ind.condominio_id,
  }).select("id").single();
  if (e2) throw e2;
  if (ind.categoria_id) await sb.from("prestador_categorias").insert({ prestador_id: p.id, categoria_id: ind.categoria_id });
  await sb.from("prestador_notas").insert({
    prestador_id: p.id,
    nota: `Indicação via app${ind.morador_nome ? ` por ${ind.morador_nome}` : ""}. ${ind.comentario ?? ""}`.trim(),
  });
  await sb.from("indicacoes").update({ status: "aprovada", prestador_id: p.id }).eq("id", id);
  refresh();
  revalidatePath("/admin/indicacoes");
  if (!ind.categoria_id) redirect(`/admin/prestadores/${p.id}`); // precisa escolher categoria
}

export async function rejeitarIndicacao(formData: FormData) {
  const { sb } = await requireAdmin();
  await sb.from("indicacoes").update({ status: "rejeitada" }).eq("id", String(formData.get("id")));
  revalidatePath("/admin/indicacoes");
}

/** Registra o envio de um lead para um prestador (máx. 3 por pedido). */
export async function registrarEnvioLead(orcamentoId: string, prestadorId: string) {
  const { sb } = await requireAdmin();
  const { count } = await sb.from("orcamento_destinos").select("*", { count: "exact", head: true }).eq("orcamento_id", orcamentoId);
  const { data: ja } = await sb.from("orcamento_destinos").select("prestador_id").eq("orcamento_id", orcamentoId).eq("prestador_id", prestadorId).maybeSingle();
  if (!ja && (count ?? 0) >= 3) return { ok: false, erro: "Este pedido já foi enviado para 3 parceiros." };
  if (!ja) await sb.from("orcamento_destinos").insert({ orcamento_id: orcamentoId, prestador_id: prestadorId });
  await sb.from("orcamentos").update({ status: "enviado" }).eq("id", orcamentoId).eq("status", "novo");
  revalidatePath("/admin/orcamentos");
  return { ok: true };
}

export async function alterarStatusOrcamento(formData: FormData) {
  const { sb } = await requireAdmin();
  await sb.from("orcamentos").update({ status: String(formData.get("status")) as "novo" }).eq("id", String(formData.get("id")));
  revalidatePath("/admin/orcamentos");
}

export async function salvarBanner(formData: FormData) {
  const { sb } = await requireAdmin();
  const row = {
    anunciante: str(formData, "anunciante")!, titulo: str(formData, "titulo")!, subtitulo: str(formData, "subtitulo"),
    imagem_url: str(formData, "imagem_url"), link: str(formData, "link"),
    posicao: (str(formData, "posicao") ?? "topo") as "topo" | "entre_categorias",
    inicio: str(formData, "inicio"), fim: str(formData, "fim"), ativo: true,
  };
  const { error } = await sb.from("banners").insert(row);
  if (error) throw error;
  refresh();
  revalidatePath("/admin/banners");
}

export async function salvarVantagem(formData: FormData) {
  const { sb } = await requireAdmin();
  const w = str(formData, "whatsapp");
  const { error } = await sb.from("clube_vantagens").insert({
    parceiro: str(formData, "parceiro")!, segmento: str(formData, "segmento"), oferta: str(formData, "oferta")!,
    whatsapp: w ? normalizePhone(w) : null, link: str(formData, "link"), ativo: true,
  });
  if (error) throw error;
  refresh();
  revalidatePath("/admin/clube");
}

const TABELAS_TOGGLE = { banners: "banners", clube: "clube_vantagens" } as const;

export async function alternarAtivo(formData: FormData) {
  const { sb } = await requireAdmin();
  const t = TABELAS_TOGGLE[String(formData.get("tabela")) as keyof typeof TABELAS_TOGGLE];
  if (!t) return;
  await sb.from(t).update({ ativo: formData.get("ativo") === "true" }).eq("id", String(formData.get("id")));
  refresh();
  revalidatePath(`/admin/${formData.get("tabela")}`);
}

export async function excluirRegistro(formData: FormData) {
  const { sb } = await requireAdmin();
  const t = TABELAS_TOGGLE[String(formData.get("tabela")) as keyof typeof TABELAS_TOGGLE];
  if (!t) return;
  await sb.from(t).delete().eq("id", String(formData.get("id")));
  refresh();
  revalidatePath(`/admin/${formData.get("tabela")}`);
}

export async function sair() {
  const { sb } = await requireAdmin();
  await sb.auth.signOut();
  redirect("/admin/login");
}
