// pages/api/upload-image.ts
import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "@/app/lib/cloudinary";
import { IncomingForm } from "formidable";
import { UploadMetadataSchema, type UploadMetadata } from "@/app/lib/schemas/upload";

export const config = { api: { bodyParser: false } };

type ApiError = { error: { code: string; message: string } };
type ApiSuccess = {
  image: {
    secureUrl: string;
    publicId: string;
    width: number;
    height: number;
    format: string;
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiSuccess | ApiError>) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: { code: "METHOD_NOT_ALLOWED", message: "Méthode non autorisée" } });
  }

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Erreur parsing form", err);
      return res.status(500).json({ error: { code: "FORM_PARSE_ERROR", message: "Erreur traitement du fichier" } });
    }

    const file = Array.isArray(files.file) ? files.file[0] : (files.file as any);
    if (!file) {
      return res.status(400).json({ error: { code: "FILE_MISSING", message: "Fichier manquant" } });
    }

    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/avif"];
    if (file.mimetype && !allowed.includes(file.mimetype)) {
      return res.status(415).json({ error: { code: "UNSUPPORTED_MEDIA_TYPE", message: "Type de fichier non supporté" } });
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return res.status(413).json({ error: { code: "PAYLOAD_TOO_LARGE", message: "Fichier > 5 Mo" } });
    }

    // 🔸 Récupérer le JSON "metadata" (chanp unique)
    const rawMeta = Array.isArray(fields.metadata) ? fields.metadata[0] : (fields.metadata as string | undefined);
    if (!rawMeta) {
      return res.status(400).json({ error: { code: "METADATA_MISSING", message: "Champ 'metadata' manquant" } });
    }

    let metadata: UploadMetadata;
    try {
      const parsed = UploadMetadataSchema.parse(JSON.parse(rawMeta));
      metadata = parsed;
    } catch (e: any) {
      const message = e?.errors?.[0]?.message ?? "Métadonnées invalides";
      return res.status(400).json({ error: { code: "INVALID_METADATA", message } });
    }

    // Préfixage des tags par langue (décision côté serveur)
    const prefixedTags = [
      ...metadata.tags.fr.map((t) => `fr_${t}`),
      ...metadata.tags.en.map((t) => `en_${t}`),
    ];

    try {
      const uploadResponse = await cloudinary.uploader.upload(file.filepath, {
        resource_type: "image",
        tags: prefixedTags,
        context: {
          caption_fr: metadata.title.fr,
          caption_en: metadata.title.en,
          alt_fr: metadata.description.fr,
          alt_en: metadata.description.en,
          custom_fr: metadata.customData?.fr ?? "",
          custom_en: metadata.customData?.en ?? "",
        },
        // TODO (étape 2/3): folder/public_id/transformations
      });

      return res.status(200).json({
        image: {
          secureUrl: uploadResponse.secure_url,
          publicId: uploadResponse.public_id,
          width: uploadResponse.width,
          height: uploadResponse.height,
          format: uploadResponse.format,
        },
      });
    } catch (e) {
      console.error("Erreur Cloudinary upload:", e);
      return res.status(500).json({ error: { code: "CLOUDINARY_UPLOAD_ERROR", message: "Erreur lors de l'upload" } });
    }
  });
}
