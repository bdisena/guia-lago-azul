/**
 * Converte a planilha de prestadores (exportada do grupo de WhatsApp) em supabase/seed.sql.
 * Uso: npx tsx scripts/import-xlsx.ts caminho/para/planilha.xlsx
 */
import * as XLSX from "xlsx";
import { writeFileSync } from "node:fs";
import { normalizePhone, pickWhatsapp } from "../lib/phone";
import { slugify } from "../lib/slug";

const ICONES: Record<string, string> = {
  "Ar-condicionado / climatização": "❄️", "Arquitetura / paisagismo": "📐", "Automotivo": "🚗",
  "Bicicleta": "🚲", "Calhas": "🌧️", "Chaveiro": "🔑", "Costura / cortinas": "🧵",
  "Desentupidora / limpa-fossa": "🚽", "Diarista / faxina": "🧹", "Eletrodomésticos": "🧺",
  "Elétrica": "⚡", "Encanamento / hidráulica": "🔧", "Energia solar / boiler": "☀️",
  "Gesso / forro": "🏗️", "Gás e água": "🔥", "Imobiliária / corretor": "🏡", "Internet": "📶",
  "Jardinagem": "🌿", "Limpeza especializada": "🧽", "Marcenaria / planejados": "🪚",
  "Marmoraria / pedras": "🪨", "Material de construção": "🧱", "Montagem de móveis": "🪛",
  "Motorista / translado": "🚘", "Mudança / carreto / transporte": "🚚", "Piscina": "🏊",
  "Pisos": "🔲", "Serviços gerais": "🛠️", "Tapeçaria / estofados": "🛋️",
  "Vidraçaria / esquadrias": "🪟", "Dedetização / pragas": "🐜",
};
// categorias mais pedidas aparecem primeiro na home
const PRIORIDADE = ["Diarista / faxina", "Elétrica", "Encanamento / hidráulica", "Piscina",
  "Ar-condicionado / climatização", "Jardinagem", "Energia solar / boiler", "Serviços gerais"];

const q = (s: string | null | undefined) => (s == null ? "null" : `'${String(s).replace(/'/g, "''")}'`);
const arr = (a: string[]) => `array[${a.map(q).join(",")}]::text[]`;

const file = process.argv[2];
if (!file) throw new Error("Informe o caminho da planilha");
const wb = XLSX.readFile(file);
type Row = Record<string, string>;
const rows = XLSX.utils.sheet_to_json<Row>(wb.Sheets["Prestadores"], { raw: false });
const recomendados = new Set(
  XLSX.utils.sheet_to_json<Row>(wb.Sheets["Mais recomendados"], { raw: false }).map((r) => r["Prestador / empresa"].trim()),
);

// correção: dedetização estava sob "Gás e água" na planilha
const fixCategoria = (nome: string, cat: string) => (/dedetiz/i.test(nome) ? "Dedetização / pragas" : cat);

const categorias = new Map<string, string>();
const out: string[] = ["-- Gerado por scripts/import-xlsx.ts — não editar à mão", "begin;"];
const avisos: string[] = [];
const slugs = new Set<string>();

for (const r of rows) {
  const nome = r["Prestador / empresa"].trim();
  const cats = r["Categoria"].split(";").map((c) => fixCategoria(nome, c.trim()));
  cats.forEach((c) => categorias.set(c, slugify(c)));
}
const catList = [...categorias.keys()].sort((a, b) => {
  const pa = PRIORIDADE.indexOf(a), pb = PRIORIDADE.indexOf(b);
  return (pa < 0 ? 99 : pa) - (pb < 0 ? 99 : pb) || a.localeCompare(b, "pt");
});
out.push("insert into categorias(slug, nome, icone, ordem) values");
out.push(catList.map((c, i) => `  (${q(categorias.get(c))}, ${q(c)}, ${q(ICONES[c] ?? "🛠️")}, ${i + 1})`).join(",\n") + "\non conflict (slug) do nothing;");

for (const r of rows) {
  const nome = r["Prestador / empresa"].trim();
  const telefones = r["Telefone"].split("/").map((t) => normalizePhone(t)).filter(Boolean) as string[];
  const whatsapp = pickWhatsapp(telefones);
  if (!whatsapp) avisos.push(`Sem WhatsApp válido: ${nome} (${r["Telefone"]})`);
  let slug = slugify(nome);
  while (slugs.has(slug)) slug += "-2";
  slugs.add(slug);
  const como = r["Como apareceu no grupo"] || "";
  const origem = /recomenda/i.test(como) ? "recomendacao" : /pedido/i.test(como) ? "pedido" : "compartilhado";
  const cats = r["Categoria"].split(";").map((c) => fixCategoria(nome, c.trim()));
  out.push(
    `insert into prestadores(slug, nome, telefones, whatsapp, servicos, mais_recomendado, origem, indicado_em, atende_todos) values ` +
      `(${q(slug)}, ${q(nome)}, ${arr(telefones)}, ${q(whatsapp)}, ${arr(cats)}, ${recomendados.has(nome)}, '${origem}', ` +
      `(select id from condominios where slug='lago-azul'), true) on conflict (slug) do nothing;`,
  );
  for (const c of cats)
    out.push(`insert into prestador_categorias select p.id, c.id from prestadores p, categorias c where p.slug=${q(slug)} and c.slug=${q(categorias.get(c))} on conflict do nothing;`);
  const nota = `Origem: ${como} em ${r["Data"]} (grupo Lago Azul), por ${String(r["Compartilhado por"] ?? "").replace(/^~\s*/, "").trim()}.`;
  out.push(`insert into prestador_notas select id, ${q(nota)} from prestadores where slug=${q(slug)} on conflict do nothing;`);
}
out.push("commit;");
writeFileSync("supabase/seed.sql", out.join("\n") + "\n");
console.log(`${rows.length} prestadores, ${categorias.size} categorias, ${recomendados.size} mais recomendados`);
avisos.forEach((a) => console.warn("⚠ " + a));
