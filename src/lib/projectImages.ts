import type { ImageMetadata } from "astro";

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/img/*.{png,jpg,jpeg,webp,avif,gif}",
  { eager: true },
);

const imageByFilename = Object.fromEntries(
  Object.entries(images).map(([path, module]) => [
    path.slice(path.lastIndexOf("/") + 1),
    module.default,
  ]),
) as Record<string, ImageMetadata>;

const FALLBACK_IMAGE = "img-error.png";

export function resolveProjectImage(
  filename: string | null | undefined,
): ImageMetadata {
  return (
    (filename && imageByFilename[filename]) ||
    imageByFilename[FALLBACK_IMAGE]
  );
}