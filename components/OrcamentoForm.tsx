"use client";
import { useState } from "react";
import Link from "next/link";
import type { Categoria } from "@/lib/types";
import { useCondo } from "./CondoProvider";
import { publicRpc } from "@/lib/rpc";

export function OrcamentoForm({ categorias, categoriaInicial }: { categorias: Categoria[]; categoriaInicial?: number }) {
  const { condominios, atual, escolher } = useCondo();
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "erro">("idle");
  const [erro, setErro] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setEstado("enviando");
    const cond = String(f.get("condominio"));
    try {
      await publicRpc("enviar_orcamento", {
        p_nome: f.get("nome"), p_whatsapp: f.get("whatsapp"), p_condominio: cond,
        p_categoria: f.get("categoria") ? Number(f.get("categoria")) : null, p_descricao: f.get("descricao"),
      });
      if (!atual) escolher(cond);
      setEstado("ok");
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao enviar");
      setEstado("erro");
    }
  }

  if (estado === "ok")
    return (
      <div className="card p-6 text-center">
        <p className="text-4xl">✅</p>
        <h2 className="mt-2 text-xl font-bold">Pedido recebido!</h2>
        <p className="muted mt-1">Vamos enviar sua demanda para até 3 parceiros credenciados. Eles chamam você no WhatsApp, normalmente no mesmo dia.</p>
        <Link href="/" className="btn btn-primary mt-4">Voltar ao início</Link>
      </div>
    );

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Que tipo de serviço?">
        <select name="categoria" className="input" defaultValue={categoriaInicial ?? ""}>
          <option value="">Não sei / outro</option>
          {categorias.map((c) => <option key={c.id} value={c.id}>{c.icone} {c.nome}</option>)}
        </select>
      </Field>
      <Field label="O que você precisa?">
        <textarea name="descricao" required minLength={5} maxLength={2000} rows={4} className="input"
          placeholder="Ex.: pintura externa da casa, ~200 m². Ou: instalação de boiler de 400 L." />
      </Field>
      <Field label="Seu nome">
        <input name="nome" required minLength={2} maxLength={120} className="input" autoComplete="given-name" />
      </Field>
      <Field label="Seu WhatsApp (com DDD)">
        <input name="whatsapp" required inputMode="tel" pattern="[\d\s()+\-]{10,20}" className="input" placeholder="(19) 99999-9999" autoComplete="tel" />
      </Field>
      <Field label="Condomínio">
        <select name="condominio" required className="input" defaultValue={atual?.slug ?? ""} key={atual?.slug ?? "x"}>
          <option value="" disabled>Selecione…</option>
          {condominios.map((c) => <option key={c.slug} value={c.slug}>{c.nome}</option>)}
        </select>
      </Field>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" required className="mt-1 h-4 w-4 accent-lago-600" />
        <span className="muted">Autorizo o envio do meu nome, condomínio e WhatsApp para até 3 prestadores parceiros entrarem em contato sobre este pedido.</span>
      </label>
      {estado === "erro" && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{erro}</p>}
      <button disabled={estado === "enviando"} className="btn btn-primary w-full py-3.5 text-lg disabled:opacity-60">
        {estado === "enviando" ? "Enviando…" : "Enviar pedido"}
      </button>
    </form>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}
