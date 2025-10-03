// src/app/api/upload-image/route.ts
import { NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinary";
import { UploadMetadataSchema, type UploadMetadata } from "@/app/lib/schemas/upload";

// Désactiver le body parser de Next.js pour gérer le fichier via formData
export const config = { api: { bodyParser: false } };

export async function POST(req: Request) {
  try {
    // Lire les données envoyées en formData (fichier + métadonnées)
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const metadata = formData.get("metadata") as string;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier n'a été téléchargé" }, { status: 400 });
    }

    // ✅ Validation des métadonnées avec Zod (validation côté serveur)
    let parsedMetadata: UploadMetadata;
    try {
      parsedMetadata = UploadMetadataSchema.parse(JSON.parse(metadata));
    } catch (error) {
      return NextResponse.json({ error: "Métadonnées invalides" }, { status: 400 });
    }

    // 🔸 Validation des formats de fichier autorisés
    const allowedFormats = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/avif"];
    if (!allowedFormats.includes(file.type)) {
      return NextResponse.json({ error: "Format de fichier non supporté" }, { status: 415 });
    }

    // 🔸 Validation de la taille du fichier (max 5 Mo)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "Le fichier dépasse la taille maximale de 5 Mo" }, { status: 413 });
    }

    // Préfixage des tags par langue (côté serveur)
    const prefixedTags = [
      ...parsedMetadata.tags.fr.map((t) => `fr_${t}`),
      ...parsedMetadata.tags.en.map((t) => `en_${t}`),
    ];

    // Convertir le fichier en Buffer pour Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload de l'image vers Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(
      `data:${file.type};base64,${buffer.toString("base64")}`,
      {
        resource_type: "image",  // Assure que c'est une image
        tags: prefixedTags,      // Tags pour Cloudinary
        context: {
          caption_fr: parsedMetadata.title.fr,
          caption_en: parsedMetadata.title.en,
          alt_fr: parsedMetadata.description.fr,
          alt_en: parsedMetadata.description.en,
          custom_fr: parsedMetadata.customData?.fr ?? "",
          custom_en: parsedMetadata.customData?.en ?? "",
        },
      }
    );

    // Retourner la réponse avec les détails de l'image
    return NextResponse.json({
      image: {
        secureUrl: uploadResponse.secure_url,
        publicId: uploadResponse.public_id,
        width: uploadResponse.width,
        height: uploadResponse.height,
        format: uploadResponse.format,
      },
    });

  } catch (error) {
    console.error("Erreur lors du traitement de l'upload :", error);
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 });
  }
}
