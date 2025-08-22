"use client";

import { useMemo, useState } from "react";
import { UploadMetadataSchema, type UploadMetadata, LIMITS } from "@/app/lib/schemas/upload";

const UploadImage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Saisie "rapide" (FR | EN). On convertira avant envoi.
  const [titleRaw, setTitleRaw] = useState("");
  const [descriptionRaw, setDescriptionRaw] = useState("");
  const [tagsRaw, setTagsRaw] = useState(""); // "tag1, tag2 | tagA, tagB"
  const [customRaw, setCustomRaw] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImage(e.target.files[0]);
  };

  // Helpers de conversion UI -> modèle canonique
  const splitBi = (value: string) => {
    const [fr = "", en = ""] = value.split("|");
    return { fr: fr.trim(), en: en.trim() };
  };

  const parseTags = (value: string) => {
    const { fr, en } = splitBi(value);
    const toArray = (s: string) =>
      s
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

    return { fr: toArray(fr), en: toArray(en) };
  };

  // Construire l'objet metadata (non validé)
  const metadataDraft: UploadMetadata = useMemo(
    () => ({
      title: splitBi(titleRaw),
      description: splitBi(descriptionRaw),
      tags: parseTags(tagsRaw),
      customData: splitBi(customRaw),
    }),
    [titleRaw, descriptionRaw, tagsRaw, customRaw]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!image) {
      setErrorMsg("Veuillez sélectionner une image.");
      return;
    }

    // ✅ Validation Zod côté client (feedback immédiat)
    const parsed = UploadMetadataSchema.safeParse(metadataDraft);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      setErrorMsg(firstError?.message ?? "Données invalides");
      return;
    }
    const metadata = parsed.data;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("metadata", JSON.stringify(metadata)); // ✅ payload unique

      const res = await fetch("/api/upload-image", { method: "POST", body: formData });
      const data = await res.json();
      setIsUploading(false);

      if (!res.ok) {
        setErrorMsg(data?.error?.message ?? "Erreur lors de l'upload");
        return;
      }

      setUploadedImageUrl(data?.image?.secureUrl ?? null);
    } catch {
      setIsUploading(false);
      setErrorMsg("Erreur de connexion");
    }
  };

  return (
    <div>
      <h2>Upload une image vers Cloudinary</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="file" onChange={handleFileChange} accept="image/*" required />
        <br />

        <input
          type="text"
          placeholder="Titre FR | Title EN"
          value={titleRaw}
          onChange={(e) => setTitleRaw(e.target.value)}
          maxLength={LIMITS.titleMax * 2 + 3}
        />
        <br />

        <input
          type="text"
          placeholder="Description FR | Description EN"
          value={descriptionRaw}
          onChange={(e) => setDescriptionRaw(e.target.value)}
          maxLength={LIMITS.descriptionMax * 2 + 3}
        />
        <br />

        <input
          type="text"
          placeholder="tag1, tag2 | tagA, tagB"
          value={tagsRaw}
          onChange={(e) => setTagsRaw(e.target.value)}
        />
        <br />

        <input
          type="text"
          placeholder="Données perso FR | Custom data EN"
          value={customRaw}
          onChange={(e) => setCustomRaw(e.target.value)}
          maxLength={LIMITS.customDataMax * 2 + 3}
        />
        <br />

        {errorMsg && <p style={{ color: "crimson" }}>{errorMsg}</p>}

        <button type="submit" disabled={isUploading}>
          {isUploading ? "Téléchargement en cours..." : "Uploader l'image"}
        </button>
      </form>

      {uploadedImageUrl && (
        <div>
          <h3>Image uploadée avec succès !</h3>
          <img src={uploadedImageUrl} alt="Uploaded Image" width={300} />
        </div>
      )}
    </div>
  );
};

export default UploadImage;
