"use client";

import { useState } from 'react';

const UploadImage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  // Gérer la sélection de l'image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  // Envoyer l'image à l'API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      alert("Veuillez sélectionner une image.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", image);

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
        <input type="file" onChange={handleFileChange} accept="image/*" />
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
