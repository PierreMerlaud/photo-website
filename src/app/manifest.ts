import type { MetadataRoute } from "next";

//exemple
// mes icônes dans public
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "tripluch",
    short_name: "tripluch",
    description: "L'outil pour composter bien entouré",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon_192_192_tripluch.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon_512_512_tripluch.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}