"use client";
import { useState } from "react";
import Link from "next/link";
import type { Categoria } from "@/lib/types";
import { useCondo } from "./CondoProvider";
import { publicRpc } from "@/lib/rpc";
import { IconCheck } from "./Icons";

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
      <div className="fade-up border border-[var(--ink)] p-7">
        <div className="grid h-12 w-12 place-items-center bg-[var(--ink)] text-white"><IconCheck /></div>
        <h2 className="mt-5 font-display text-[30px] leading-tight">Pedido recebido.</h2>
        <p className="muted mt-2 text-[14.5px] leading-relaxed">Sua solicitação será encaminhada a até três parceiros selecionados. O contato acontece pelo WhatsApp, normalmente no mesmo dia.</p>
        <Link href="/" className="btn btn-primary mt-6 w-full">Voltar ao Guia</Link>
      </div>
    );

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Field label="Que tipo de serviço?">
        <select name="categoria" className="input" defaultValue={categoriaInicial ?? ""}>
          <option value="">Não sei / outro</option>
          {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
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
      <label className="flex items-start gap-3 text-[13px] leading-relaxed">
        <input type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-black" />
        <span className="muted">Autorizo o envio do meu nome, condomínio e WhatsApp para até 3 prestadores parceiros entrarem em contato sobre este pedido.</span>
      </label>
      {estado === "erro" && <p className="border-l-2 border-red-700 bg-red-50 p-3 text-sm text-red-800">{erro}</p>}
      <button disabled={estado === "enviando"} className="btn btn-primary w-full !py-4 disabled:opacity-60">
        {estado === "enviando" ? "Enviando…" : "Enviar pedido"}
      </button>
    </form>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow block">{label}</span>
      {children}
    </label>
  );
}
