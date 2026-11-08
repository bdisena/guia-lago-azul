import "server-only";
import { redirect } from "next/navigation";
import { serverClient } from "./supabase/server";

/** Garante usuário admin; devolve o client autenticado. */
export async function requireAdmin() {
  const sb = await serverClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: ok } = await sb.rpc("is_admin");
  if (!ok) redirect("/admin/login?erro=sem-permissao");
  return { sb, user };
}
