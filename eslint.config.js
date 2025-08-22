import path from 'path';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    root: true,  // Marque ce fichier comme étant la configuration racine

    // Étend les configurations de base
    extends: [
      'next/core-web-vitals',  // Config Next.js pour les meilleures pratiques
      'eslint:recommended',  // Recommandations de base pour tous les projets JS
      'plugin:@typescript-eslint/recommended',  // Recommandations pour TypeScript
      'plugin:react/recommended',  // Meilleures pratiques pour React
      'plugin:react-hooks/recommended',  // Meilleures pratiques pour React Hooks
      'prettier',  // Applique Prettier en dernier pour éviter les conflits de formatage
    ],

    // Plugins utilisés
    plugins: [
      '@typescript-eslint',  // Plugin TypeScript
      'react',  // Plugin React
      'react-hooks',  // Plugin React Hooks
      'next',
      'prettier',  // Plugin Prettier
    ],

    // Parser pour TypeScript
    parser: '@typescript-eslint/parser',

    // Options de parsing
    parserOptions: {
      ecmaVersion: 2021,  // Utiliser ECMAScript 2021
      sourceType: 'module',  // Utiliser les modules ES
      project: './tsconfig.json',  // Utilise ton tsconfig pour déterminer les types
      tsconfigRootDir: path.resolve(),  // Utilise le répertoire actuel comme base pour tsconfig
    },

    // Règles personnalisées
    rules: {
      'react/react-in-jsx-scope': 'off',  // Next.js gère l'import de React
      'react/jsx-uses-react': 'off',  // Next.js gère cette règle
      'react/jsx-uses-vars': 'error',  // Éviter les variables non utilisées dans JSX
      '@typescript-eslint/no-unused-vars': ['error'],  // Règle de variables inutilisées
    },

    // Ignorer certains fichiers/dossiers
    ignorePatterns: [
      'node_modules/',  // Ignorer node_modules
      '.next/',  // Ignorer les fichiers Next.js générés
      'out/',  // Ignorer les fichiers générés par Next.js (export)
      'dist/',  // Ignorer le dossier de distribution
      'build/',  // Ignorer le dossier de build
    ],
  },
]);