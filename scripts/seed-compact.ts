// Gera uma versão compacta (JSON) do seed para aplicar via SQL editor/MCP.
import * as XLSX from "xlsx";
import { writeFileSync } from "node:fs";
import { normalizePhone, pickWhatsapp } from "../lib/phone";
import { slugify } from "../lib/slug";
const wb = XLSX.readFile(process.argv[2]);
type Row = Record<string, string>;
const rows = XLSX.utils.sheet_to_json<Row>(wb.Sheets["Prestadores"], { raw: false });
const rec = new Set(XLSX.utils.sheet_to_json<Row>(wb.Sheets["Mais recomendados"], { raw: false }).map((r) => r["Prestador / empresa"].trim()));
const fix = (n: string, c: string) => (/dedetiz/i.test(n) ? "Dedetização / pragas" : c);
const slugs = new Set<string>();
const data = rows.map((r) => {
  const n = r["Prestador / empresa"].trim();
  const t = r["Telefone"].split("/").map((x) => normalizePhone(x)).filter(Boolean) as string[];
  let s = slugify(n); while (slugs.has(s)) s += "-2"; slugs.add(s);
  const como = r["Como apareceu no grupo"] || "";
  return { s, n, t, w: pickWhatsapp(t), c: r["Categoria"].split(";").map((c) => slugify(fix(n, c.trim()))),
    r: rec.has(n), o: /recomenda/i.test(como) ? "recomendacao" : /pedido/i.test(como) ? "pedido" : "compartilhado",
    nt: `Origem: ${como} em ${r["Data"]} (grupo Lago Azul), por ${String(r["Compartilhado por"] ?? "").replace(/^~\s*/, "").trim()}.` };
});
const j = JSON.stringify(data).replace(/'/g, "''");
writeFileSync(process.argv[3], `with d as (select * from jsonb_to_recordset('${j}'::jsonb) as x(s text,n text,t text[],w text,c text[],r bool,o origem_t,nt text)),
ins as (insert into prestadores(slug,nome,telefones,whatsapp,servicos,mais_recomendado,origem,indicado_em)
 select s,n,t,w,(select array_agg(cat.nome order by cat.ordem) from categorias cat where cat.slug=any(d.c)),r,o,(select id from condominios where slug='lago-azul') from d
 on conflict (slug) do nothing returning id, slug),
pc as (insert into prestador_categorias select ins.id, cat.id from ins join d on d.s=ins.slug join categorias cat on cat.slug=any(d.c))
insert into prestador_notas select ins.id, d.nt from ins join d on d.s=ins.slug;`);
