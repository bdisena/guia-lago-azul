/** Cabeçalho editorial das páginas internas (faixa preta contínua ao header). */
export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="bg-[var(--ink)] px-4 pb-8 pt-6 text-white">
      <p className="eyebrow eyebrow-light">{eyebrow}</p>
      <h1 className="fade-up mt-3 font-display text-[36px] leading-[1.04] tracking-[-0.01em]">{title}</h1>
      {children && <div className="mt-3 max-w-md text-[14px] leading-relaxed text-white/60">{children}</div>}
    </section>
  );
}
