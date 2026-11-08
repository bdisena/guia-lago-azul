"use client";
export type EventoTipo = "view_categoria" | "view_prestador" | "click_whatsapp" | "click_banner" | "click_clube";

/** Registra evento via RPC pública. keepalive garante envio mesmo ao sair da página. */
export function track(tipo: EventoTipo, ids: { prestador?: string; categoria?: number; banner?: string; clube?: string; condominio?: string | null } = {}) {
  try {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/registrar_evento`;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    fetch(url, {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json", apikey: key },
      body: JSON.stringify({
        p_tipo: tipo,
        p_prestador: ids.prestador ?? null,
        p_categoria: ids.categoria ?? null,
        p_banner: ids.banner ?? null,
        p_clube: ids.clube ?? null,
        p_condominio: ids.condominio ?? null,
      }),
    }).catch(() => {});
  } catch {
    /* métricas nunca devem quebrar a navegação */
  }
}
