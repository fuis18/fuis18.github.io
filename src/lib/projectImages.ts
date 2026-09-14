import type { ImageMetadata } from "astro";

import imgPortafolio from "@/assets/img/img-portafolio.png";
import imgSoftware from "@/assets/img/img-software.png";
import imgCcna from "@/assets/img/img-ccna.png";
import imgDotfiles from "@/assets/img/img-dotfiles.png";
import imgSpotify from "@/assets/img/img-spotify.png";
import imgPos from "@/assets/img/img-pos.png";
import imgYanaira from "@/assets/img/img-yanaira.png";
import imgHealthy from "@/assets/img/img-healthy.png";
import imgProjects from "@/assets/img/img-projects.png";

export const projectImages: Record<string, ImageMetadata> = {
  "/img/img-portafolio.png": imgPortafolio,
  "/img/img-software.png": imgSoftware,
  "/img/img-ccna.png": imgCcna,
  "/img/img-dotfiles.png": imgDotfiles,
  "/img/img-spotify.png": imgSpotify,
  "/img/img-pos.png": imgPos,
  "/img/img-yanaira.png": imgYanaira,
  "/img/img-healthy.png": imgHealthy,
  "/img/img-projects.png": imgProjects,
};

export function resolveProjectImage(path: string): ImageMetadata | undefined {
  return projectImages[path];
}