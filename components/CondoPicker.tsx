"use client";
import { useCondo } from "./CondoProvider";

/** Seletor de condomínio em estilo de abas sublinhadas. */
export function CondoChips({ dark = false }: { dark?: boolean }) {
  const { condominios, atual, escolher } = useCondo();
  const opts = [{ slug: null as string | null, nome: "Todos" }, ...condominios.map((c) => ({ slug: c.slug as string | null, nome: c.nome }))];
  return (
    <div className={`no-scrollbar -mx-4 flex gap-6 overflow-x-auto border-b px-4 ${dark ? "border-white/15" : "border-[var(--line)]"}`} role="radiogroup" aria-label="Condomínio">
      {opts.map((o) => {
        const on = (atual?.slug ?? null) === o.slug;
        return (
          <button key={o.nome} role="radio" aria-checked={on} onClick={() => escolher(o.slug)}
            className={`relative shrink-0 pb-3 pt-1 text-[11px] font-semibold uppercase tracking-[0.16em] transition ${
              dark ? (on ? "text-white" : "text-white/45 hover:text-white/80") : (on ? "text-[var(--ink)]" : "text-[var(--muted)] hover:text-[var(--ink)]")
            }`}>
            {o.nome}
            {on && <span className={`absolute inset-x-0 -bottom-px h-[2px] ${dark ? "bg-white" : "bg-[var(--ink)]"}`} />}
          </button>
        );
      })}
    </div>
  );
}

/** Boas-vindas da primeira visita. */
export function CondoWelcome() {
  const { condominios, definido, escolher } = useCondo();
  if (definido) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="fade-up w-full max-w-md bg-[var(--ink)] px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-7 text-white shadow-2xl"
        role="dialog" aria-modal="true" aria-labelledby="cw-title">
        <p className="eyebrow eyebrow-light">Bem-vindo(a)</p>
        <h2 id="cw-title" className="mt-3 font-display text-[32px] leading-[1.05]">Em qual residencial<br />você mora?</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/60">Assim mostramos quem atende você e já identificamos o condomínio no contato. Sem cadastro.</p>
        <ul className="mt-6 divide-y divide-white/10 border-y border-white/10">
          {condominios.map((c) => (
            <li key={c.slug}>
              <button className="flex w-full items-center justify-between py-3.5 text-left font-display text-[21px] transition hover:pl-1" onClick={() => escolher(c.slug)}>
                {c.nome}<span className="text-white/40">→</span>
              </button>
            </li>
          ))}
        </ul>
        <button className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50 hover:text-white" onClick={() => escolher(null)}>
          Prefiro não informar
        </button>
      </div>
    </div>
  );
}
