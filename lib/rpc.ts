/** Chama uma RPC pública do Supabase e devolve a mensagem de erro do banco de forma amigável. */
export async function publicRpc<T = unknown>(fn: string, args: Record<string, unknown>): Promise<T> {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: key },
    body: JSON.stringify(args),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message || "Não foi possível enviar. Tente novamente.");
  }
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}
