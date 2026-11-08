"use client";
import { useCondo } from "./CondoProvider";

/** Chips de condomínio (filtro de abrangência). */
export function CondoChips() {
  const { condominios, atual, escolher } = useCondo();
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="radiogroup" aria-label="Condomínio">
      <Chip on={!atual} onClick={() => escolher(null)}>Todos</Chip>
      {condominios.map((c) => (
        <Chip key={c.slug} on={atual?.slug === c.slug} onClick={() => escolher(c.slug)}>{c.nome}</Chip>
      ))}
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      role="radio"
      aria-checked={on}
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
        on ? "border-lago-600 bg-lago-600 text-white" : "border-[var(--line)] bg-white text-[var(--ink)]"
      }`}
    >
      {children}
    </button>
  );
}

/** Modal da primeira visita: "Em qual condomínio você mora?" */
export function CondoWelcome() {
  const { condominios, definido, escolher } = useCondo();
  if (definido) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="card w-full max-w-sm p-5 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="cw-title">
        <p className="text-sm font-semibold uppercase tracking-wide text-lago-600">Bem-vindo(a)!</p>
        <h2 id="cw-title" className="mt-1 text-xl font-bold">Em qual condomínio você mora?</h2>
        <p className="muted mt-1 text-sm">Usamos isso para mostrar quem atende você e preencher a mensagem do WhatsApp. Sem cadastro.</p>
        <div className="mt-4 grid gap-2">
          {condominios.map((c) => (
            <button key={c.slug} className="btn btn-ghost justify-start" onClick={() => escolher(c.slug)}>{c.nome}</button>
          ))}
          <button className="mt-1 text-sm text-lago-600 underline" onClick={() => escolher(null)}>Prefiro não informar</button>
        </div>
      </div>
    </div>
  );
}
