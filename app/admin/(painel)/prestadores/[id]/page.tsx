import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { excluirPrestador, salvarPrestador } from "../../../actions";
import { formatPhone } from "@/lib/phone";
import { FotoUpload } from "@/components/admin/FotoUpload";

export default async function EditarPrestador({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { sb } = await requireAdmin();
  const novo = id === "novo";
  const [{ data: categorias }, { data: condominios }, prest, nota] = await Promise.all([
    sb.from("categorias").select("id,nome,icone").order("nome"),
    sb.from("condominios").select("id,nome").order("id"),
    novo ? Promise.resolve({ data: null }) :
      sb.from("prestadores").select("*,prestador_categorias(categoria_id),prestador_condominios(condominio_id)").eq("id", id).maybeSingle(),
    novo ? Promise.resolve({ data: null }) : sb.from("prestador_notas").select("nota").eq("prestador_id", id).maybeSingle(),
  ]);
  const p = prest.data;
  if (!novo && !p) notFound();
  const cats = new Set<number>((p?.prestador_categorias ?? []).map((x: { categoria_id: number }) => x.categoria_id));
  const conds = new Set<number>((p?.prestador_condominios ?? []).map((x: { condominio_id: number }) => x.condominio_id));

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">{novo ? "Novo prestador" : p.nome}</h1>
      <form action={salvarPrestador} className="card space-y-4 p-5">
        {!novo && <input type="hidden" name="id" value={p.id} />}
        <L t="Nome"><input name="nome" required defaultValue={p?.nome} className="input" /></L>
        <div className="grid gap-4 sm:grid-cols-2">
          <L t="Telefones (um por linha)"><textarea name="telefones" rows={2} defaultValue={(p?.telefones ?? []).map(formatPhone).join("\n")} className="input" /></L>
          <L t="WhatsApp (vazio = 1º celular)"><input name="whatsapp" defaultValue={p?.whatsapp ? formatPhone(p.whatsapp) : ""} className="input" /></L>
        </div>
        <L t="Descrição (exibida no perfil)"><textarea name="descricao" rows={3} defaultValue={p?.descricao ?? ""} className="input" /></L>
        <L t="Serviços (separados por vírgula)"><input name="servicos" defaultValue={(p?.servicos ?? []).join(", ")} className="input" /></L>
        <fieldset>
          <legend className="mb-1.5 text-sm font-semibold">Categorias</legend>
          <div className="grid grid-cols-2 gap-1 text-sm sm:grid-cols-3">
            {categorias!.map((c) => (
              <label key={c.id} className="flex items-center gap-2"><input type="checkbox" name="categorias" value={c.id} defaultChecked={cats.has(c.id)} />{c.icone} {c.nome}</label>
            ))}
          </div>
        </fieldset>
        <fieldset className="space-y-1.5">
          <legend className="mb-1.5 text-sm font-semibold">Abrangência</legend>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="atende_todos" defaultChecked={p?.atende_todos ?? true} /> Atende todos os 5 condomínios</label>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="muted">Ou somente:</span>
            {condominios!.map((c) => (
              <label key={c.id} className="flex items-center gap-1.5"><input type="checkbox" name="condominios" value={c.id} defaultChecked={conds.has(c.id)} />{c.nome}</label>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-3">
          <L t="Plano">
            <select name="plano" defaultValue={p?.plano ?? "free"} className="input">
              <option value="free">Free</option><option value="destaque">Destaque</option><option value="suspenso">Suspenso</option>
            </select>
          </L>
          <L t="Indicado por moradores do">
            <select name="indicado_em" defaultValue={p?.indicado_em ?? ""} className="input">
              <option value="">—</option>
              {condominios!.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </L>
          <L t="Origem">
            <select name="origem" defaultValue={p?.origem ?? "cadastro"} className="input">
              <option value="recomendacao">Recomendação explícita</option><option value="pedido">Resposta a pedido</option>
              <option value="compartilhado">Compartilhado</option><option value="cadastro">Cadastro/curadoria</option>
            </select>
          </L>
        </div>
        <div className="flex flex-wrap gap-5 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" name="verificado" defaultChecked={p?.verificado} /> ✓ Verificado (homologado)</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="mais_recomendado" defaultChecked={p?.mais_recomendado} /> 👍 Mais recomendado</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="ativo" defaultChecked={p?.ativo ?? true} /> Ativo (visível)</label>
        </div>
        <L t="Fotos de serviços (URLs, uma por linha; exibidas só no plano Destaque)">
          <FotoUpload name="fotos" initial={(p?.fotos ?? []).join("\n")} />
        </L>
        <L t="Nota interna (não aparece no app)"><textarea name="nota" rows={2} defaultValue={nota.data?.nota ?? ""} className="input" /></L>
        <button className="btn btn-primary">Salvar</button>
      </form>
      {!novo && (
        <form action={excluirPrestador}>
          <input type="hidden" name="id" value={p.id} />
          <button className="text-sm text-red-700 underline">Excluir definitivamente (prefira desmarcar “Ativo”)</button>
        </form>
      )}
    </div>
  );
}

function L({ t, children }: { t: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-semibold">{t}</span>{children}</label>;
}
