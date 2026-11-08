import { NextResponse, type NextRequest } from "next/server";
import { serverClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const dias = Number(req.nextUrl.searchParams.get("dias")) || 30;
  const sb = await serverClient();
  const { data: ok } = await sb.rpc("is_admin");
  if (!ok) return new NextResponse("Não autorizado", { status: 401 });
  const { data, error } = await sb.rpc("metricas_prestadores", { p_dias: dias });
  if (error) return new NextResponse(error.message, { status: 500 });
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = [["prestador", "plano", "visualizacoes", "cliques_whatsapp", "leads"].join(";")].concat(
    (data as { nome: string; plano: string; views: number; cliques: number; leads: number }[]).map((r) =>
      [esc(r.nome), r.plano, r.views, r.cliques, r.leads].join(";")),
  );
  return new NextResponse("﻿" + rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="metricas-${dias}d-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
