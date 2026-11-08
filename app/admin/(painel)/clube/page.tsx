import { requireAdmin } from "@/lib/admin";
import { salvarVantagem } from "../../actions";
import { Lista } from "@/components/admin/Lista";

export default async function ClubeAdmin() {
  const { sb } = await requireAdmin();
  const { data } = await sb.from("clube_vantagens").select("*").order("parceiro");
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Clube de Vantagens</h1>
      <form action={salvarVantagem} className="card grid gap-3 p-4 sm:grid-cols-2">
        <input name="parceiro" required placeholder="Parceiro (ex.: Lava-Rápido Central)" className="input" />
        <input name="segmento" placeholder="Segmento (restaurante, pet shop…)" className="input" />
        <input name="oferta" required placeholder="Oferta (ex.: 15% off para moradores)" className="input sm:col-span-2" />
        <input name="whatsapp" placeholder="WhatsApp do parceiro" className="input" />
        <input name="link" placeholder="ou link (site/Instagram)" className="input" />
        <button className="btn btn-primary sm:col-span-2">Adicionar vantagem</button>
      </form>
      <Lista itens={data ?? []} tabela="clube" render={(v) => <><b>{v.parceiro}</b> · {v.oferta}</>} />
    </div>
  );
}
