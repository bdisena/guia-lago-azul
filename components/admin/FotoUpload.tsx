"use client";
import { useState } from "react";
import { browserClient } from "@/lib/supabase/client";

/** Textarea de URLs + upload para o bucket público "midia". */
export function FotoUpload({ name, initial }: { name: string; initial: string }) {
  const [val, setVal] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [erro, setErro] = useState("");

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true); setErro("");
    const sb = browserClient();
    const urls: string[] = [];
    for (const f of Array.from(files)) {
      const path = `fotos/${crypto.randomUUID()}.${f.name.split(".").pop()?.toLowerCase() ?? "jpg"}`;
      const { error } = await sb.storage.from("midia").upload(path, f, { contentType: f.type });
      if (error) { setErro(error.message); continue; }
      urls.push(sb.storage.from("midia").getPublicUrl(path).data.publicUrl);
    }
    setVal((v) => [v.trim(), ...urls].filter(Boolean).join("\n"));
    setBusy(false);
  }

  return (
    <div className="space-y-2">
      <textarea name={name} rows={3} value={val} onChange={(e) => setVal(e.target.value)} className="input font-mono text-xs" />
      <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => onFiles(e.target.files)} disabled={busy} className="text-sm" />
      {busy && <p className="muted text-xs">Enviando…</p>}
      {erro && <p className="text-xs text-red-700">{erro}</p>}
    </div>
  );
}
