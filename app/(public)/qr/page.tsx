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
      return { c, url, svg: await QRCode.toString(url, { type: "svg", margin: 1, color: { dark: "#0a3340" } }) };
    }),
  );
  return (
    <>
      <div className="print:hidden"><Header back="/" title="QR Codes" /></div>
      <div className="space-y-4 px-4 pt-4">
        <div className="flex items-center justify-between gap-3 print:hidden">
          <p className="muted text-sm">Um cartaz por condomínio, para murais e portarias. O QR já seleciona o condomínio.</p>
          <PrintButton />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 print:block">
          {qrs.map(({ c, url, svg }) => (
            <section key={c.slug} className="card break-after-page p-6 text-center print:border-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-lago-600">Guia dos Condomínios</p>
              <h2 className="mt-1 text-2xl font-extrabold">{c.nome}</h2>
              <p className="muted text-sm">Prestadores indicados pelos seus vizinhos</p>
              <div className="mx-auto my-4 w-56" dangerouslySetInnerHTML={{ __html: svg }} />
              <p className="font-semibold">Aponte a câmera do celular</p>
              <p className="muted break-all text-[11px]">{url}</p>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
