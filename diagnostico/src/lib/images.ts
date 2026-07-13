import "server-only";
import sharp, { type Metadata } from "sharp";
import { createHash } from "crypto";
import { config } from "@/lib/config";

/**
 * Pipeline de imagem server-side:
 * magic bytes → limites → sharp (orientação + resize + SEM metadados/EXIF) → hash.
 * Nunca logar conteúdo da imagem.
 */

export const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export type AcceptedMime = (typeof ACCEPTED_MIME_TYPES)[number];

export const MIN_DIMENSION = 400;
export const ANALYSIS_MAX_DIMENSION = 1024;

export type ImageValidationError =
  | "invalid_type"
  | "too_large"
  | "too_small"
  | "corrupted";

export class ImageProcessingError extends Error {
  constructor(public readonly code: ImageValidationError) {
    super(code);
    this.name = "ImageProcessingError";
  }
}

/** Assinatura real do arquivo — extensão/mime declarado não são confiáveis. */
export function sniffMime(buffer: Buffer): AcceptedMime | null {
  if (buffer.length < 12) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
  if (
    buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47
  )
    return "image/png";
  if (
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  )
    return "image/webp";
  return null;
}

export type ProcessedImage = {
  /** JPEG otimizado, orientação corrigida, sem EXIF. */
  buffer: Buffer;
  width: number;
  height: number;
  sizeBytes: number;
  hashSha256: string;
  mimeType: "image/jpeg";
};

export async function processUpload(input: Buffer): Promise<ProcessedImage> {
  const maxBytes = config.MAX_IMAGE_SIZE_MB * 1024 * 1024;
  if (input.length > maxBytes) throw new ImageProcessingError("too_large");

  if (!sniffMime(input)) throw new ImageProcessingError("invalid_type");

  let meta: Metadata;
  try {
    meta = await sharp(input).metadata();
  } catch {
    throw new ImageProcessingError("corrupted");
  }

  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  if (w < MIN_DIMENSION || h < MIN_DIMENSION) throw new ImageProcessingError("too_small");

  // rotate() aplica orientação EXIF; sem withMetadata() o sharp descarta EXIF.
  let buffer: Buffer;
  try {
    buffer = await sharp(input)
      .rotate()
      .resize(ANALYSIS_MAX_DIMENSION, ANALYSIS_MAX_DIMENSION, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85 })
      .toBuffer();
  } catch {
    throw new ImageProcessingError("corrupted");
  }

  const outMeta = await sharp(buffer).metadata();
  return {
    buffer,
    width: outMeta.width ?? 0,
    height: outMeta.height ?? 0,
    sizeBytes: buffer.length,
    hashSha256: createHash("sha256").update(buffer).digest("hex"),
    mimeType: "image/jpeg",
  };
}
