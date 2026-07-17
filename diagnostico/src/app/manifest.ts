import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Diagnóstico de Expressão",
    short_name: "Expressão",
    description:
      "Envie sua foto de perfil e descubra o que ela comunica sobre sua expressão, autoridade e posicionamento.",
    start_url: "/",
    display: "standalone",
    background_color: "#1B1B1B",
    theme_color: "#1B1B1B",
    icons: [
      { src: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
