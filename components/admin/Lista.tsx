import { alternarAtivo, excluirRegistro } from "@/app/admin/actions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Lista({ itens, tabela, render }: { itens: any[]; tabela: string; render: (x: any) => React.ReactNode }) {
  return (
    <ul className="card divide-y divide-[var(--line)]">
      {itens.length === 0 && <li className="muted p-4 text-sm">Nada cadastrado ainda.</li>}
      {itens.map((x) => (
        <li key={x.id} className={`flex flex-wrap items-center gap-2 p-3 text-sm ${x.ativo ? "" : "opacity-50"}`}>
          <span className="flex-1">{render(x)}</span>
          <form action={alternarAtivo}>
            <input type="hidden" name="tabela" value={tabela} /><input type="hidden" name="id" value={x.id} />
            <input type="hidden" name="ativo" value={String(!x.ativo)} />
            <button className="btn btn-ghost py-1 text-xs">{x.ativo ? "Pausar" : "Ativar"}</button>
          </form>
          <form action={excluirRegistro}>
            <input type="hidden" name="tabela" value={tabela} /><input type="hidden" name="id" value={x.id} />
            <button className="py-1 text-xs text-red-700">Excluir</button>
          </form>
        </li>
      ))}
    </ul>
  );
}
