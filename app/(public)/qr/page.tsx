import QRCode from "qrcode";
import { Header } from "@/components/Header";
import { getCatalogo } from "@/lib/data";
import { PrintButton } from "@/components/PrintButton";

export const metadata = { title: "QR Codes para portarias", robots: { index: false } };

export default async function QrPage() {
  const { condominios } = await getCatalogo();
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const qrs = await Promise.all(
    condominios.map(async (c) => {
      const url = `${base}/?c=${c.slug}&utm_source=qr`;
      return { c, url, svg: await QRCode.toString(url, { type: "svg", margin: 1, color: { dark: "#0d0d0e" } }) };
    }),
  );
  return (
    <>
      <div className="print:hidden"><Header back="/" title="Cartazes" /></div>
      <div className="space-y-6 px-4 pt-6">
        <div className="flex items-center justify-between gap-3 print:hidden">
          <p className="muted text-sm">Um cartaz por condomínio, para murais e portarias. O QR já seleciona o condomínio.</p>
          <PrintButton />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 print:block">
          {qrs.map(({ c, url, svg }) => (
            <section key={c.slug} className="break-after-page border border-[var(--ink)] bg-white p-8 text-center">
              <p className="eyebrow">Guia dos Condomínios · Private Concierge</p>
              <h2 className="mt-4 font-display text-[40px] leading-none">{c.nome}</h2>
              <p className="mt-3 font-display text-[17px] italic text-[var(--muted)]">Os profissionais em quem seus vizinhos confiam.</p>
              <div className="mx-auto my-7 w-56" dangerouslySetInnerHTML={{ __html: svg }} />
              <p className="eyebrow !text-[var(--ink)]">Aponte a câmera do celular</p>
              <p className="muted mt-2 break-all text-[10px]">{url}</p>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
