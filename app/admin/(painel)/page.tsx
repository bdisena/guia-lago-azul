import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

export default async function AdminHome() {
  const { sb } = await requireAdmin();
  const d7 = new Date(Date.now() - 7 * 864e5).toISOString();
  const [orc, ind, dest, cliques, total, susp] = await Promise.all([
    sb.from("orcamentos").select("*", { count: "exact", head: true }).eq("status", "novo"),
    sb.from("indicacoes").select("*", { count: "exact", head: true }).eq("status", "pendente"),
    sb.from("prestadores").select("*", { count: "exact", head: true }).eq("plano", "destaque"),
    sb.from("eventos").select("*", { count: "exact", head: true }).eq("tipo", "click_whatsapp").gte("created_at", d7),
    sb.from("prestadores").select("*", { count: "exact", head: true }),
    sb.from("prestadores").select("*", { count: "exact", head: true }).eq("plano", "suspenso"),
  ]);
  const cards = [
    { n: orc.count, l: "Orçamentos novos", href: "/admin/orcamentos", alert: (orc.count ?? 0) > 0 },
    { n: ind.count, l: "Indicações pendentes", href: "/admin/indicacoes", alert: (ind.count ?? 0) > 0 },
    { n: cliques.count, l: "Cliques no WhatsApp (7 dias)", href: "/admin/metricas" },
    { n: dest.count, l: "Assinantes Destaque", href: "/admin/prestadores?plano=destaque" },
    { n: total.count, l: "Prestadores cadastrados", href: "/admin/prestadores" },
    { n: susp.count, l: "Suspensos", href: "/admin/prestadores?plano=suspenso" },
  ];
  const mrrEstimado = (dest.count ?? 0) * 79;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Visão geral</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.l} href={c.href} className={`card p-4 ${c.alert ? "border-ouro-400 bg-ouro-50" : ""}`}>
            <p className="text-3xl font-extrabold">{c.n ?? 0}</p>
            <p className="muted text-sm">{c.l}</p>
          </Link>
        ))}
      </div>
      <div className="card p-4 text-sm">
        <p className="font-semibold">Receita recorrente estimada (Destaque): R$ {mrrEstimado.toLocaleString("pt-BR")}/mês</p>
        <p className="muted">Estimativa com ticket médio de R$ 79. Banners e leads são cobrados à parte e controlados manualmente nesta versão.</p>
      </div>
    </div>
  );
}
