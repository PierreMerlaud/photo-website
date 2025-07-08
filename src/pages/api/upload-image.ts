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

      try {
        const uploadResponse = await cloudinary.uploader.upload(file.filepath, {
          resource_type: 'auto',
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
