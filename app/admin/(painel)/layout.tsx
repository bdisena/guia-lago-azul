import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { sair } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false } };

const nav = [
  ["/admin", "Visão geral"], ["/admin/prestadores", "Prestadores"], ["/admin/indicacoes", "Indicações"],
  ["/admin/orcamentos", "Orçamentos"], ["/admin/banners", "Banners"], ["/admin/clube", "Clube"], ["/admin/metricas", "Métricas"],
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 bg-[var(--ink)] text-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
          <Link href="/admin" className="font-display text-xl">Guia · Painel</Link>
          <span className="hidden truncate text-xs text-white/50 sm:block">{user.email}</span>
          <div className="flex-1" />
          <Link href="/" className="text-sm text-white/80" target="_blank">Ver app ↗</Link>
          <form action={sair}><button className="text-sm text-white/50 hover:text-white">Sair</button></form>
        </div>
        <nav className="no-scrollbar mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 pb-2">
          {nav.map(([href, label]) => (
            <Link key={href} href={href} className="shrink-0 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60 hover:text-white">{label}</Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl p-4">{children}</main>
    </div>
  );
}
