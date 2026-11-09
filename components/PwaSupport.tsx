"use client";
import { useEffect, useState } from "react";
import { IconClose } from "./Icons";

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
    <div className="fixed inset-x-3 bottom-[84px] z-40 mx-auto max-w-md">
      <div className="fade-up flex items-center gap-3 border border-white/10 bg-[var(--ink)] p-4 text-white shadow-2xl">
        <div className="grid h-10 w-10 shrink-0 place-items-center border border-white/30 font-display text-xl">G</div>
        <p className="flex-1 text-[13px] leading-snug text-white/80">
          {ios ? <>Toque em <b className="text-white">Compartilhar</b> e em <b className="text-white">Adicionar à Tela de Início</b>.</> : <>Tenha o Guia na tela inicial do seu celular.</>}
        </p>
        {!ios && evt && (
          <button className="btn btn-light !px-3 !py-2" onClick={async () => { await evt.prompt(); close(); }}>Instalar</button>
        )}
        <button aria-label="Fechar" className="px-1 text-white/50 hover:text-white" onClick={close}><IconClose className="h-4 w-4" /></button>
      </div>
    </div>
  );
}
