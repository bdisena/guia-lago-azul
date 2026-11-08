import { requireAdmin } from "@/lib/admin";
import { salvarBanner } from "../../actions";
import { Lista } from "@/components/admin/Lista";

export default async function BannersAdmin() {
  const { sb } = await requireAdmin();
  const { data } = await sb.from("banners").select("*").order("created_at", { ascending: false });
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Banners patrocinados</h1>
      <form action={salvarBanner} className="card grid gap-3 p-4 sm:grid-cols-2">
        <input name="anunciante" required placeholder="Anunciante" className="input" />
        <input name="titulo" required placeholder="Título (ex.: 10% off em porcelanatos)" className="input" />
        <input name="subtitulo" placeholder="Subtítulo" className="input" />
        <input name="link" placeholder="Link (site ou https://wa.me/55…)" className="input" />
        <input name="imagem_url" placeholder="URL da imagem de fundo (opcional)" className="input" />
        <select name="posicao" className="input"><option value="topo">Topo da home</option><option value="entre_categorias">Entre categorias</option></select>
        <label className="text-sm">Início <input type="date" name="inicio" className="input" /></label>
        <label className="text-sm">Fim <input type="date" name="fim" className="input" /></label>
        <button className="btn btn-primary sm:col-span-2">Adicionar banner</button>
      </form>
      <Lista itens={data ?? []} tabela="banners" render={(b) => (
        <><b>{b.titulo}</b> · {b.anunciante} <span className="muted">({b.posicao === "topo" ? "topo" : "entre categorias"}{b.fim ? `, até ${new Date(b.fim + "T12:00").toLocaleDateString("pt-BR")}` : ""})</span></>
      )} />
    </div>
  );
}

