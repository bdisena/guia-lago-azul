"use client";
import { useState, useTransition } from "react";
import { registrarEnvioLead } from "@/app/admin/actions";

export function EnviarLeadButton({ orcamentoId, prestadorId, href, enviado, bloqueado }: {
  orcamentoId: string; prestadorId: string; href: string; enviado: boolean; bloqueado: boolean;
}) {
  const [pending, start] = useTransition();
  const [erro, setErro] = useState("");
  if (bloqueado) return <span className="muted text-xs">limite 3</span>;
  return (
    <>
      {erro && <span className="text-xs text-red-700">{erro}</span>}
      <button
        disabled={pending}
        className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${enviado ? "border border-zap text-zap" : "bg-zap text-white"}`}
        onClick={() => {
          // abre a janela já no clique (evita bloqueio de pop-up) e registra o lead em seguida
          const w = window.open(href, "_blank", "noopener");
          start(async () => {
            const r = await registrarEnvioLead(orcamentoId, prestadorId);
            if (!r.ok) { setErro(r.erro ?? "Erro"); w?.close(); }
          });
        }}
      >
        {enviado ? "Reenviar" : "Enviar via WhatsApp"}
      </button>
    </>
  );
}
