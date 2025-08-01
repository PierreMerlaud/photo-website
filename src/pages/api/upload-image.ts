import { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from '@/app/lib/cloudinary';
import { IncomingForm } from 'formidable';

// Désactive le body parser de Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Crée une instance de formidable pour traiter le formulaire
    const form = new IncomingForm();

    // Utilise `form.parse()` pour analyser la requête et récupérer les fichiers
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Erreur lors du parsing du formulaire', err);
        return res.status(500).json({ error: 'Erreur lors du traitement du fichier' });
      }

      const file = files.file ? files.file[0] : null;

      if (!file) {
        return res.status(400).json({ error: 'Fichier manquant' });
      }

      // Vérification du type du fichier
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; // Types autorisés
      if (file.mimetype && !allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ error: 'Le fichier doit être une image (JPEG, PNG, GIF)' });
      }

      // Vérification de la taille du fichier (ici 5 Mo max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        return res.status(400).json({ error: 'Le fichier ne doit pas dépasser 5 Mo' });
      }

      console.log('fields', fields);

      // Fonction utilitaire pour garantir une valeur de chaîne ou tableau
      const getStringField = (field: undefined | string | string[]) => {
        if (!field) return '';
        if (Array.isArray(field)) return field.join(', ') || '';
        return field;
      };

      const parseMultilingualField = (raw: string) => {
        try {
          const parsed = JSON.parse(raw);
          return { fr: parsed.fr || '', en: parsed.en || '' }; // Retourner un objet avec les données pour chaque langue
        } catch (e) {
          return { fr: '', en: '' }; // Si le parsing échoue, on retourne un objet par défaut
        }
      };

      // Appliquer `getStringField` et `parseMultilingualField` aux données
      const titleRaw = getStringField(fields.title);
      const descriptionRaw = getStringField(fields.description);
      const tagsRaw = getStringField(fields.tags);
      const customDataRaw = getStringField(fields.customData);

      // Parsing des champs multilingues
      const title = parseMultilingualField(titleRaw);
      const description = parseMultilingualField(descriptionRaw);
      const tags = parseMultilingualField(tagsRaw);  // Tags traités comme un champ multilingue
      const customData = parseMultilingualField(customDataRaw); 

      // Utilisation des données (c'est ici qu'on manipule les valeurs)
      const titleFr = title.fr;
      const titleEn = title.en;
      const descriptionFr = description.fr;
      const descriptionEn = description.en;
      const tagsFr = Array.isArray(tags.fr) ? tags.fr : [];
      const tagsEn = Array.isArray(tags.en) ? tags.en : [];
      const customDataFr = customData.fr;
      const customDataEn = customData.en;

      try {
        // Upload l'image vers Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(file.filepath, {
          resource_type: 'auto',
          tags: [...tagsFr, ...tagsEn],  // Combinaison des tags en français et anglais
          context: {
            caption: `${titleFr} | ${titleEn}`,  // Utiliser le titre en français et anglais
            alt: `${descriptionFr} | ${descriptionEn}`, // Utiliser la description en français et anglais
            custom_metadata: `${customDataFr} | ${customDataEn}`, // Utiliser les données personnalisées en français et anglais
          },
        });

        res.status(200).json({ imageUrl: uploadResponse.secure_url });
      } catch (error) {
        console.error('Erreur lors de l\'upload de l\'image:', error);
        res.status(500).json({ error: 'Erreur lors de l\'upload de l\'image' });
      }
    });
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}
