import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { alterarPlano } from "../../actions";
import { formatPhone } from "@/lib/phone";

export default async function PrestadoresAdmin({ searchParams }: { searchParams: Promise<{ q?: string; plano?: string; salvo?: string }> }) {
  const { q, plano, salvo } = await searchParams;
  const { sb } = await requireAdmin();
  let query = sb.from("prestadores").select("id,slug,nome,telefones,plano,verificado,mais_recomendado,ativo,servicos").order("nome");
  if (q) query = query.ilike("nome", `%${q}%`);
  if (plano) query = query.eq("plano", plano);
  const { data, error } = await query;
  if (error) throw error;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">Prestadores <span className="muted text-base font-normal">({data.length})</span></h1>
        <div className="flex-1" />
        <Link href="/admin/prestadores/novo" className="btn btn-primary text-sm">+ Novo prestador</Link>
      </div>
      {salvo && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-800">“{salvo}” salvo. O app atualiza em instantes.</p>}
      <form className="flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder="Buscar por nome…" className="input max-w-xs" />
        <select name="plano" defaultValue={plano ?? ""} className="input max-w-[11rem]">
          <option value="">Todos os planos</option><option value="free">Free</option><option value="destaque">Destaque</option><option value="suspenso">Suspenso</option>
        </select>
        <button className="btn btn-ghost">Filtrar</button>
      </form>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="muted border-b border-[var(--line)] text-left text-xs uppercase">
            <tr><th className="p-3">Nome</th><th className="p-3">Serviços</th><th className="p-3">Telefone</th><th className="p-3">Selos</th><th className="p-3">Plano</th><th /></tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {data.map((p) => (
              <tr key={p.id} className={p.ativo ? "" : "opacity-50"}>
                <td className="p-3 font-medium">{p.nome}</td>
                <td className="muted p-3">{p.servicos.join(", ")}</td>
                <td className="whitespace-nowrap p-3">{p.telefones.map(formatPhone).join(" / ")}</td>
                <td className="p-3">{p.verificado && "✓ "}{p.mais_recomendado && "👍"}</td>
                <td className="p-3">
                  <form action={alterarPlano} className="flex gap-1">
                    <input type="hidden" name="id" value={p.id} />
                    <select name="plano" defaultValue={p.plano} className="rounded-lg border border-[var(--line)] px-2 py-1">
                      <option value="free">Free</option><option value="destaque">Destaque</option><option value="suspenso">Suspenso</option>
                    </select>
                    <button className="rounded-lg border border-[var(--line)] px-2 text-xs">OK</button>
                  </form>
                </td>
                <td className="p-3 text-right"><Link href={`/admin/prestadores/${p.id}`} className="text-lago-600">Editar</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
