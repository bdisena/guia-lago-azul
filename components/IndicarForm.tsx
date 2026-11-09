"use client";
import { useState } from "react";
import type { Categoria } from "@/lib/types";
import { useCondo } from "./CondoProvider";
import { Field } from "./OrcamentoForm";
import { publicRpc } from "@/lib/rpc";

export function IndicarForm({ categorias }: { categorias: Categoria[] }) {
  const { condominios, atual } = useCondo();
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "erro">("idle");
  const [erro, setErro] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setEstado("enviando");
    try {
      const cat = f.get("categoria") ? Number(f.get("categoria")) : null;
      await publicRpc("enviar_indicacao", {
        p_nome_prestador: f.get("nome_prestador"), p_telefone: f.get("telefone"), p_categoria: cat,
        p_categoria_texto: f.get("categoria_texto") || null, p_comentario: f.get("comentario") || null,
        p_morador: f.get("morador") || null, p_condominio: f.get("condominio") || null,
      });
      form.reset();
      setEstado("ok");
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao enviar");
      setEstado("erro");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {estado === "ok" && (
        <p className="fade-up border-l-2 border-[var(--ink)] bg-white p-4 text-[14px] leading-relaxed">Obrigado! Sua indicação vai para a curadoria e aparece no guia após aprovação. Quer indicar mais alguém?</p>
      )}
      <Field label="Nome do prestador ou empresa">
        <input name="nome_prestador" required minLength={2} maxLength={120} className="input" />
      </Field>
      <Field label="Telefone / WhatsApp do prestador">
        <input name="telefone" required inputMode="tel" pattern="[\d\s()+\-]{10,20}" className="input" placeholder="(19) 99999-9999" />
      </Field>
      <Field label="Categoria">
        <select name="categoria" className="input" defaultValue="">
          <option value="">Outra (descreva abaixo)</option>
          {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
      </Field>
      <Field label="Se outra, qual serviço?">
        <input name="categoria_texto" maxLength={80} className="input" placeholder="Ex.: Pintura, Serralheria…" />
      </Field>
      <Field label="Por que você indica? (opcional)">
        <textarea name="comentario" maxLength={1000} rows={3} className="input" placeholder="Pontual, preço justo, deixou tudo limpo…" />
      </Field>
      <div className="grid grid-cols-2 gap-5">
        <Field label="Seu nome (opcional)"><input name="morador" maxLength={120} className="input" /></Field>
        <Field label="Condomínio">
          <select name="condominio" className="input" defaultValue={atual?.slug ?? ""} key={atual?.slug ?? "x"}>
            <option value="">—</option>
            {condominios.map((c) => <option key={c.slug} value={c.slug}>{c.nome}</option>)}
          </select>
        </Field>
      </div>
      <p className="muted text-xs">Seu nome não é exibido publicamente. Mostramos apenas “Indicado por moradores do [condomínio]”.</p>
      {estado === "erro" && <p className="border-l-2 border-red-700 bg-red-50 p-3 text-sm text-red-800">{erro}</p>}
      <button disabled={estado === "enviando"} className="btn btn-primary w-full !py-4 disabled:opacity-60">
        {estado === "enviando" ? "Enviando…" : "Enviar indicação"}
      </button>
    </form>
  );
}
