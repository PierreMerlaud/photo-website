// src/lib/schemas/upload.ts
import { z } from "zod";

/** Limites centralisées pour rester cohérent partout */
export const LIMITS = {
  titleMax: 120,
  descriptionMax: 2000,
  customDataMax: 500,
  tagMaxLen: 50,
  tagMaxCount: 30,
};

/** Helper: string non vide après trim, avec message personnalisé */
const requiredTrimmed = (msg: string) => z.string().trim().min(1, msg);

/** Texte FR/EN avec longueurs spécifiques selon le champ */
export const LangTitleSchema = z.object({
  fr: requiredTrimmed("Titre (FR) requis").max(LIMITS.titleMax),
  en: requiredTrimmed("Title (EN) required").max(LIMITS.titleMax),
});

export const LangDescriptionSchema = z.object({
  fr: requiredTrimmed("Description (FR) requise").max(LIMITS.descriptionMax),
  en: requiredTrimmed("Description (EN) required").max(LIMITS.descriptionMax),
});

export const LangCustomSchema = z.object({
  fr: z.string().trim().max(LIMITS.customDataMax).optional().default(""),
  en: z.string().trim().max(LIMITS.customDataMax).optional().default(""),
});

/** tags par langue : tableaux de strings normalisés */
const TagSchema = z
  .string()
  .trim()
  .min(1, { message: "Tag vide interdit" })
  .max(LIMITS.tagMaxLen, { message: `Tag trop long (>${LIMITS.tagMaxLen})` });

export const LangTagsSchema = z
  .object({
    fr: z.array(TagSchema).max(LIMITS.tagMaxCount, {
      message: `Trop de tags FR (max ${LIMITS.tagMaxCount})`,
    }),
    en: z.array(TagSchema).max(LIMITS.tagMaxCount, {
      message: `Trop de tags EN (max ${LIMITS.tagMaxCount})`,
    }),
  })
  // Optionnel : empêcher les doublons insensibles à la casse
  .superRefine((val, ctx) => {
    const dedup = (arr: string[]) =>
      new Set(arr.map((t) => t.toLowerCase())).size === arr.length;
    if (!dedup(val.fr))
      ctx.addIssue({ code: "custom", path: ["fr"], message: "Tags FR en doublon" });
    if (!dedup(val.en))
      ctx.addIssue({ code: "custom", path: ["en"], message: "Tags EN en doublon" });
  });

/** Schéma canonique envoyé/attendu entre front et serveur */
export const UploadMetadataSchema = z.object({
  title: LangTitleSchema,
  description: LangDescriptionSchema,
  tags: LangTagsSchema,
  customData: LangCustomSchema.optional().default({ fr: "", en: "" }),
});

export type UploadMetadata = z.infer<typeof UploadMetadataSchema>;
