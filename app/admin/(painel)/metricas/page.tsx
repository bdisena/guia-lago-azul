import { requireAdmin } from "@/lib/admin";

export default async function MetricasAdmin({ searchParams }: { searchParams: Promise<{ dias?: string }> }) {
  const dias = [7, 30, 90].includes(Number((await searchParams).dias)) ? Number((await searchParams).dias) : 30;
  const { sb } = await requireAdmin();
  const [{ data: prest, error: e1 }, { data: cats, error: e2 }] = await Promise.all([
    sb.rpc("metricas_prestadores", { p_dias: dias }),
    sb.rpc("metricas_categorias", { p_dias: dias }),
  ]);
  if (e1 || e2) throw e1 ?? e2;
  type PR = { prestador_id: string; nome: string; plano: string; views: number; cliques: number; leads: number };
  type CR = { categoria_id: number; nome: string; views: number; cliques: number };
  const P = prest as PR[], C = cats as CR[];
  const tot = P.reduce((a, p) => ({ v: a.v + Number(p.views), c: a.c + Number(p.cliques), l: a.l + Number(p.leads) }), { v: 0, c: 0, l: 0 });
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold">Métricas</h1>
        <div className="flex-1" />
        {[7, 30, 90].map((d) => (
          <a key={d} href={`?dias=${d}`} className={`rounded-full border px-3 py-1 text-sm ${d === dias ? "border-lago-600 bg-lago-600 text-white" : "border-[var(--line)] bg-white"}`}>{d} dias</a>
        ))}
        <a href={`/admin/metricas-csv?dias=${dias}`} className="btn btn-ghost py-1 text-sm">Exportar CSV</a>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Stat n={tot.v} l="Visualizações de perfil" /><Stat n={tot.c} l="Cliques no WhatsApp" /><Stat n={tot.l} l="Leads enviados" />
      </div>
      <section>
        <h2 className="mb-2 font-bold">Por prestador</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="muted border-b border-[var(--line)] text-left text-xs uppercase">
              <tr><th className="p-3">Prestador</th><th className="p-3">Plano</th><th className="p-3 text-right">Views</th><th className="p-3 text-right">Cliques WhatsApp</th><th className="p-3 text-right">Leads</th></tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {P.map((p) => (
                <tr key={p.prestador_id}>
                  <td className="p-3">{p.nome}</td><td className="p-3">{p.plano === "destaque" ? "★ Destaque" : p.plano}</td>
                  <td className="p-3 text-right tabular-nums">{p.views}</td><td className="p-3 text-right font-semibold tabular-nums">{p.cliques}</td>
                  <td className="p-3 text-right tabular-nums">{p.leads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="mb-2 font-bold">Por categoria</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="muted border-b border-[var(--line)] text-left text-xs uppercase">
              <tr><th className="p-3">Categoria</th><th className="p-3 text-right">Views da categoria</th><th className="p-3 text-right">Cliques WhatsApp</th></tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {C.map((c) => (
                <tr key={c.categoria_id}><td className="p-3">{c.nome}</td><td className="p-3 text-right tabular-nums">{c.views}</td><td className="p-3 text-right tabular-nums">{c.cliques}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({ n, l }: { n: number; l: string }) {
  return <div className="card p-4"><p className="text-3xl font-extrabold tabular-nums">{n}</p><p className="muted text-sm">{l}</p></div>;
}
