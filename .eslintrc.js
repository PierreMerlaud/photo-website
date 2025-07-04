/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true, // Marque ce fichier comme étant la configuration racine, aucune config supérieure ne sera utilisée

  // Étend les configurations de base
  extends: [
    'next/core-web-vitals', // Config Next.js pour les meilleures pratiques
    'eslint:recommended', // Recommandations de base pour tous les projets JS
    'plugin:@typescript-eslint/recommended', // Recommandations de TypeScript
    'plugin:react/recommended', // Meilleures pratiques pour React
    'plugin:react-hooks/recommended', // Meilleures pratiques pour React Hooks
    'prettier', // Applique Prettier en dernier pour éviter les conflits de formatage
  ],

  // Configuration des plugins
  plugins: [
    '@typescript-eslint', // Plugin TypeScript
    'react', // Plugin React
    'react-hooks', // Plugin pour React Hooks
    'prettier', // Plugin Prettier
  ],

  // Parser pour TypeScript
  parser: '@typescript-eslint/parser',

  parserOptions: {
    project: './tsconfig.json', // TypeScript utilise ton tsconfig pour déterminer les types
    tsconfigRootDir: __dirname,
    ecmaVersion: 2021, // Version ECMAScript
    sourceType: 'module', // Utilise les modules ES
  },

  // Règles personnalisées
  rules: {
    'react/react-in-jsx-scope': 'off', // Next.js gère automatiquement l'import de React
    'react/jsx-uses-react': 'off', // Pas besoin de cette règle car Next.js gère aussi ça
    'react/jsx-uses-vars': 'error', // Pour éviter les variables non utilisées dans JSX
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Ignore les arguments inutilisés commençant par "_"
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Désactive l'obligation de typer toutes les fonctions (souvent redondant en TS)
    'prettier/prettier': [
      'error',
      {
        // Configuration de Prettier
        semi: true,
        singleQuote: true,
        trailingComma: 'all',
        printWidth: 100,
        tabWidth: 2,
      },
    ],
  },

  // Règles de fichiers à ignorer
  ignorePatterns: [
    'node_modules/', // Ignorer node_modules
    '.next/', // Ignorer les fichiers Next.js générés
    'out/', // Ignorer les fichiers générés par Next.js (export)
    'dist/', // Ignorer le dossier de distribution
    'build/', // Ignorer le dossier de build
  ],
};
