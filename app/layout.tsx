import type { Metadata, Viewport } from "next";
import { Inter, EB_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const display = EB_Garamond({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Guia dos Condomínios", template: "%s · Guia dos Condomínios" },
  description:
    "Prestadores de serviço indicados pelos vizinhos do Lago Azul, Lagoa Bonita, Portal do Lago, Recanto dos Pássaros e Jacarandá.",
  appleWebApp: { capable: true, title: "Guia", statusBarStyle: "black" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = { themeColor: "#0d0d0e", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${display.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
