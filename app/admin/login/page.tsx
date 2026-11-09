"use client";
import { useState } from "react";
import { browserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "erro">("idle");
  const [msg, setMsg] = useState("");

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEstado("enviando");
    const { error } = await browserClient().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin` },
    });
    if (error) { setMsg(error.message); setEstado("erro"); } else setEstado("ok");
  }

  return (
    <main className="grid min-h-screen place-items-center p-4">
      <form onSubmit={enviar} className="card w-full max-w-sm space-y-4 p-6">
        <div>
          <p className="eyebrow">Guia dos Condomínios</p>
          <h1 className="mt-2 font-display text-3xl">Painel</h1>
        </div>
        {estado === "ok" ? (
          <p className="rounded-lg bg-green-50 p-3 text-sm text-green-800">Enviamos um link de acesso para <b>{email}</b>. Abra-o neste dispositivo.</p>
        ) : (
          <>
            <label className="block">
              <span className="eyebrow block">E-mail</span>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" autoComplete="email" />
            </label>
            {estado === "erro" && <p className="text-sm text-red-700">{msg}</p>}
            <button className="btn btn-primary w-full" disabled={estado === "enviando"}>{estado === "enviando" ? "Enviando…" : "Receber link de acesso"}</button>
          </>
        )}
      </form>
    </main>
  );
}
