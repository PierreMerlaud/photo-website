import cloudinary from '@/app/lib/cloudinary';

// Récupérer les images de Cloudinary côté serveur
const fetchImages = async () => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'image',
      max_results: 30,
    });
    return result.resources.map((resource: any) => resource.secure_url);
  } catch (error) {
    console.error('Erreur lors de la récupération des images:', error);
    return [];
  }
};

const PublicPage = async () => {
  const images = await fetchImages();

  return (
    <div>
      <h2>Galerie d'Images</h2>
      <div className="image-gallery">
        {images.length > 0 ? (
          images.map((url: string) => (
            <div key={url} className="image-item">
              <img src={url} alt="Cloudinary Image" width="300" />
            </div>
          ))
        ) : (
          <p>Aucune image trouvée</p>
        )}
      </div>
    </div>
  );
};

export default PublicPage;
