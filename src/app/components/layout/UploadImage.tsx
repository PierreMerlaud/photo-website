"use client";

import { useState } from 'react';

const UploadImage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  // Champs pour les métadonnées multilingues (saisie en un seul champ)
  const [title, setTitle] = useState<string>('');  // Saisie pour "Titre en français | Title in English"
  const [description, setDescription] = useState<string>('');  // Saisie pour "Description en français | Description in English"
  const [tags, setTags] = useState<string>('');  // Saisie pour "Tags en français | Tags in English"
  const [customData, setCustomData] = useState<string>('');  // Saisie pour "Données personnalisées en français | Custom data in English"

  // Gérer la sélection de l'image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  // Gérer les changements des champs
  const handleFieldChange = (field: 'title' | 'description' | 'tags' | 'customData') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (field === 'title') setTitle(value);
    if (field === 'description') setDescription(value);
    if (field === 'tags') setTags(value);
    if (field === 'customData') setCustomData(value);
  };

  // Fonction pour séparer les valeurs pour chaque langue
  const getTranslations = (fieldValue: string) => {
    const [fr, en] = fieldValue.split('|').map(str => str.trim());
    return { fr, en };
  };

  // Fonction pour séparer les tags et ajouter les préfixes _fr et _en
  const getTags = (tagsValue: string) => {
    const [frTags, enTags] = tagsValue.split('|').map(str => str.trim());
    return {
      fr: frTags.split(',').map(tag => `fr_${tag.trim()}`),  // Ajout du préfixe _fr
      en: enTags.split(',').map(tag => `en_${tag.trim()}`)   // Ajout du préfixe _en
    };
  };

  // Envoyer l'image et les métadonnées à l'API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      alert("Veuillez sélectionner une image.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", image);  // L'image

    // Séparer les traductions pour chaque métadonnée
    const titleTranslations = getTranslations(title);
    const descriptionTranslations = getTranslations(description);
    const tagsTranslations = getTags(tags);
    const customDataTranslations = getTranslations(customData);

    // Ajouter les métadonnées multilingues dans le FormData
    formData.append("title", JSON.stringify(titleTranslations));  // Envoie un objet avec les traductions
    formData.append("description", JSON.stringify(descriptionTranslations));
    formData.append("tags", JSON.stringify(tagsTranslations));
    formData.append("customData", JSON.stringify(customDataTranslations));

    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setIsUploading(false);

      if (data.imageUrl) {
        setUploadedImageUrl(data.imageUrl);  // Affiche l'URL de l'image uploadée
      } else {
        alert("Erreur lors de l'upload de l'image.");
      }
    } catch (error) {
      setIsUploading(false);
      alert("Erreur de connexion");
    }
  };

  return (
    <div>
      <h2>Upload une image vers Cloudinary</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" required />
        <br />

        {/* Champ pour le titre */}
        <input
          type="text"
          placeholder="Titre en français | Title in English"
          value={title}
          onChange={handleFieldChange('title')}
        />
        <br />

        {/* Champ pour la description */}
        <input
          type="text"
          placeholder="Description en français | Description in English"
          value={description}
          onChange={handleFieldChange('description')}
        />
        <br />

        {/* Champ pour les tags */}
        <input
          type="text"
          placeholder="Tags en français | Tags in English"
          value={tags}
          onChange={handleFieldChange('tags')}
        />
        <br />

        {/* Champ pour les données personnalisées */}
        <input
          type="text"
          placeholder="Données personnalisées en français | Custom data in English"
          value={customData}
          onChange={handleFieldChange('customData')}
        />
        <br />

        <button type="submit" disabled={isUploading}>
          {isUploading ? "Téléchargement en cours..." : "Uploader l'image"}
        </button>
      </form>

      {uploadedImageUrl && (
        <div>
          <h3>Image uploadée avec succès !</h3>
          <img src={uploadedImageUrl} alt="Uploaded Image" width="300" />
        </div>
      )}
    </div>
  );
};

export default UploadImage;
