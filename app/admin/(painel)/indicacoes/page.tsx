import { requireAdmin } from "@/lib/admin";
import { aprovarIndicacao, rejeitarIndicacao } from "../../actions";
import { formatPhone } from "@/lib/phone";

export default async function IndicacoesAdmin() {
  const { sb } = await requireAdmin();
  const { data, error } = await sb.from("indicacoes")
    .select("*, categorias(nome), condominios(nome)").order("created_at", { ascending: false }).limit(200);
  if (error) throw error;
  const pend = data.filter((i) => i.status === "pendente");
  const hist = data.filter((i) => i.status !== "pendente");
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Indicações de moradores</h1>
      {pend.length === 0 && <p className="muted">Nenhuma indicação pendente.</p>}
      <div className="grid gap-3 md:grid-cols-2">
        {pend.map((i) => (
          <div key={i.id} className="card space-y-2 p-4">
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-bold">{i.nome_prestador}</p>
              <span className="muted text-xs">{new Date(i.created_at).toLocaleDateString("pt-BR")}</span>
            </div>
            <p className="text-sm">{formatPhone(i.telefone.startsWith("55") ? i.telefone : "55" + i.telefone)} · {i.categorias?.nome ?? i.categoria_texto ?? "sem categoria"}</p>
            {i.comentario && <p className="rounded-lg bg-lago-50 p-2 text-sm">“{i.comentario}”</p>}
            <p className="muted text-xs">Por {i.morador_nome || "anônimo"}{i.condominios ? ` · ${i.condominios.nome}` : ""}</p>
            <div className="flex gap-2 pt-1">
              <form action={aprovarIndicacao}><input type="hidden" name="id" value={i.id} /><button className="btn btn-primary text-sm">Aprovar e publicar</button></form>
              <form action={rejeitarIndicacao}><input type="hidden" name="id" value={i.id} /><button className="btn btn-ghost text-sm">Rejeitar</button></form>
            </div>
          </div>
        ))}
      </div>
      {hist.length > 0 && (
        <details className="card p-4">
          <summary className="cursor-pointer font-semibold">Histórico ({hist.length})</summary>
          <ul className="mt-2 divide-y divide-[var(--line)] text-sm">
            {hist.map((i) => <li key={i.id} className="py-2">{i.nome_prestador} · <span className="muted">{i.status}</span></li>)}
          </ul>
        </details>
      )}
    </div>
  );
}
