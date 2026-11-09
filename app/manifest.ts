import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Guia dos Condomínios",
    short_name: "Guia",
    description: "Prestadores indicados pelos vizinhos dos 5 condomínios.",
    start_url: "/?source=pwa",
    display: "standalone",
    background_color: "#0d0d0e",
    theme_color: "#0d0d0e",
    lang: "pt-BR",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
