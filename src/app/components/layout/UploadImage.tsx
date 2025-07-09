"use client";

import { useState } from 'react';

const UploadImage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string>(''); // Champs pour le titre
  const [tags, setTags] = useState<string>(''); // Champs pour les tags
  const [description, setDescription] = useState<string>(''); // Champs pour la description
  const [customData, setCustomData] = useState<string>(''); // Champs pour les données personnalisées


 
  // Gérer la sélection de l'image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTags(e.target.value);
  };

  const handleCustomDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomData(e.target.value);
  }

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
    formData.append("tags", tags);  // Ajouter les tags
    formData.append("title", title);  // Ajouter le titre
    formData.append("description", description);  // Ajouter la description
    formData.append("customData", customData);  // Ajouter les données personnalisées

    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setIsUploading(false);

      if (data.imageUrl) {
        setUploadedImageUrl(data.imageUrl); // Affiche l'URL de l'image uploadée
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
        <input 
          type="text" 
          placeholder="Ajouter des tags (séparés par des virgules)" 
          value={tags}
          onChange={handleTagsChange} 
        />
        <br />
        <input 
          type="text" 
          placeholder='Ajouter un titre' 
          value={title} 
          onChange={handleTitleChange} 
        />
        <br />
        <input 
          type="text" 
          placeholder="Ajouter une description" 
          value={description}
          onChange={handleDescriptionChange} 
        />
        <br />
        <input 
          type="text" 
          placeholder="Ajouter des données personnalisées" 
          value={customData}
          onChange={handleCustomDataChange}
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
