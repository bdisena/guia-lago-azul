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
      <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
          <Link href="/admin" className="font-bold">Guia · Admin</Link>
          <span className="muted hidden truncate text-xs sm:block">{user.email}</span>
          <div className="flex-1" />
          <Link href="/" className="text-sm text-lago-600" target="_blank">Ver app ↗</Link>
          <form action={sair}><button className="text-sm text-[var(--muted)]">Sair</button></form>
        </div>
        <nav className="no-scrollbar mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 pb-2">
          {nav.map(([href, label]) => (
            <Link key={href} href={href} className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-lago-50">{label}</Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl p-4">{children}</main>
    </div>
  );
}
