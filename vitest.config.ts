import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Rend les APIs de test (describe, it, expect...) globales, pas besoin de les importer
    globals: true,
    // Simule le DOM pour les tests de composants
    environment: 'jsdom',
    // Fichier à exécuter avant chaque test pour la configuration
    setupFiles: './vitest.setup.ts',
  },
  // Ajoute un alias '@' pour pointer vers le dossier 'src' (très pratique !)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});