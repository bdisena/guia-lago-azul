import { requireAdmin } from "@/lib/admin";
import { alterarStatusOrcamento } from "../../actions";
import { formatPhone } from "@/lib/phone";
import { mensagemLead, waLink } from "@/lib/whatsapp";
import { EnviarLeadButton } from "@/components/admin/EnviarLeadButton";

const STATUS = { novo: "🟡 Novo", enviado: "🔵 Enviado", concluido: "🟢 Concluído", cancelado: "⚪ Cancelado" } as const;

export default async function OrcamentosAdmin({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const { sb } = await requireAdmin();
  let q = sb.from("orcamentos").select("*, categorias(id,nome), condominios(id,nome), orcamento_destinos(prestador_id, enviado_em)")
    .order("created_at", { ascending: false }).limit(100);
  if (status) q = q.eq("status", status);
  const [{ data: orcs, error }, { data: prestadores }] = await Promise.all([
    q,
    sb.from("prestadores").select("id,nome,whatsapp,plano,verificado,mais_recomendado,atende_todos,prestador_categorias(categoria_id),prestador_condominios(condominio_id)")
      .eq("ativo", true).neq("plano", "suspenso").not("whatsapp", "is", null),
  ]);
  if (error) throw error;

  type P = NonNullable<typeof prestadores>[number];
  const score = (p: P) => (p.plano === "destaque" ? 100 : 0) + (p.verificado ? 10 : 0) + (p.mais_recomendado ? 1 : 0);
  const nomeDe = new Map(prestadores!.map((p) => [p.id, p.nome]));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold">Orçamento Express</h1>
        <div className="flex-1" />
        {["", "novo", "enviado", "concluido", "cancelado"].map((s) => (
          <a key={s} href={s ? `?status=${s}` : "?"} className={`rounded-full border px-3 py-1 text-sm ${status === s || (!status && !s) ? "border-lago-600 bg-lago-600 text-white" : "border-[var(--line)] bg-white"}`}>
            {s ? STATUS[s as keyof typeof STATUS] : "Todos"}
          </a>
        ))}
      </div>
      <p className="muted text-sm">Cada envio registrado conta como 1 lead (R$ 35) para o prestador, no máximo 3 por pedido. Os parceiros Destaque e Verificados aparecem primeiro.</p>
      {orcs.length === 0 && <p className="muted">Nenhum pedido.</p>}
      {orcs.map((o) => {
        const enviados = new Set<string>(o.orcamento_destinos.map((d: { prestador_id: string }) => d.prestador_id));
        const sugestoes = prestadores!
          .filter((p) => !o.categoria_id || p.prestador_categorias.some((c: { categoria_id: number }) => c.categoria_id === o.categoria_id))
          .filter((p) => p.atende_todos || p.prestador_condominios.some((c: { condominio_id: number }) => c.condominio_id === o.condominio_id))
          .sort((a, b) => score(b) - score(a) || a.nome.localeCompare(b.nome))
          .slice(0, 8);
        const texto = mensagemLead({ nome: o.nome, condominio: o.condominios.nome, categoria: o.categorias?.nome, descricao: o.descricao, whatsapp: o.whatsapp.startsWith("55") ? o.whatsapp : "55" + o.whatsapp });
        return (
          <article key={o.id} className="card space-y-3 p-4">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-sm">{STATUS[o.status as keyof typeof STATUS]}</span>
              <p className="font-bold">{o.categorias?.nome ?? "Sem categoria"} · {o.condominios.nome}</p>
              <span className="muted ml-auto text-xs">{new Date(o.created_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</span>
            </div>
            <p className="whitespace-pre-line rounded-lg bg-lago-50 p-3 text-sm">{o.descricao}</p>
            <p className="text-sm">
              {o.nome} · <a className="text-lago-600" href={waLink(o.whatsapp.startsWith("55") ? o.whatsapp : "55" + o.whatsapp)} target="_blank" rel="noreferrer">{formatPhone(o.whatsapp.startsWith("55") ? o.whatsapp : "55" + o.whatsapp)}</a>
            </p>
            {enviados.size > 0 && (
              <p className="text-sm">Enviado para ({enviados.size}/3): <b>{[...enviados].map((id) => nomeDe.get(id) ?? "—").join(", ")}</b></p>
            )}
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase text-lago-700">Sugestões de parceiros</p>
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {sugestoes.map((p) => (
                  <li key={p.id} className="flex items-center gap-2 rounded-lg border border-[var(--line)] px-3 py-2 text-sm">
                    <span className="flex-1 truncate">{p.plano === "destaque" && "★ "}{p.verificado && "✓ "}{p.nome}</span>
                    <EnviarLeadButton orcamentoId={o.id} prestadorId={p.id} href={waLink(p.whatsapp!, texto)}
                      enviado={enviados.has(p.id)} bloqueado={!enviados.has(p.id) && enviados.size >= 3} />
                  </li>
                ))}
                {sugestoes.length === 0 && <li className="muted text-sm">Nenhum prestador para esta categoria/condomínio.</li>}
              </ul>
            </div>
            <form action={alterarStatusOrcamento} className="flex gap-2">
              <input type="hidden" name="id" value={o.id} />
              <select name="status" defaultValue={o.status} className="rounded-lg border border-[var(--line)] px-2 py-1 text-sm">
                {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <button className="btn btn-ghost py-1 text-sm">Atualizar status</button>
            </form>
          </article>
        );
      })}
    </div>
  );
}
