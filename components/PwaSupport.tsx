"use client";
import { useEffect, useState } from "react";

interface BIPEvent extends Event { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }

/** Registra o service worker e mostra o convite "Adicionar à tela de início". */
export function PwaSupport() {
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") navigator.serviceWorker.register("/sw.js").catch(() => {});
    let dismissed = false;
    try { dismissed = !!localStorage.getItem("guia:install-dismissed"); } catch {}
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone;
    if (dismissed || standalone) return;
    const onBIP = (e: Event) => { e.preventDefault(); setEvt(e as BIPEvent); setHidden(false); };
    window.addEventListener("beforeinstallprompt", onBIP);
    if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
      const t = setTimeout(() => { setIos(true); setHidden(false); }, 15000);
      return () => { clearTimeout(t); window.removeEventListener("beforeinstallprompt", onBIP); };
    }
    return () => window.removeEventListener("beforeinstallprompt", onBIP);
  }, []);

  if (hidden) return null;
  const close = () => { setHidden(true); try { localStorage.setItem("guia:install-dismissed", "1"); } catch {} };
  return (
    <div className="fixed inset-x-3 bottom-20 z-40 mx-auto max-w-md">
      <div className="card flex items-center gap-3 p-3 shadow-lg">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lago-600 text-lg text-white">📲</div>
        <p className="flex-1 text-sm">
          {ios ? <>Toque em <b>Compartilhar</b> e depois <b>Adicionar à Tela de Início</b>.</> : <>Instale o Guia no seu celular, como um app.</>}
        </p>
        {!ios && evt && (
          <button className="btn btn-primary text-sm" onClick={async () => { await evt.prompt(); close(); }}>Instalar</button>
        )}
        <button aria-label="Fechar" className="muted px-1 text-xl" onClick={close}>×</button>
      </div>
    </div>
  );
}
