import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginNode from 'eslint-plugin-node';
import pluginMongo from 'eslint-plugin-mongodb';
import pluginPrettier from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...globals.mongo },
      sourceType: 'module',
    },
    plugins: {
      prettier: pluginPrettier,
      node: pluginNode,
      mongodb: pluginMongo,
      react: pluginReact,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'warn',
      'node/no-extraneous-require': 'error',
      'node/no-missing-require': 'error',
      'react/react-in-jsx-scope': 'off', // вимкнути правило, яке вимагало React імпорту в новіших версіях
    },
  },
  // Якщо є специфічні файли для MongoDB чи Node.js:
  {
    files: ['**/*.js'],
    plugins: {
      node: pluginNode,
    },
    rules: {
      'node/no-unpublished-require': 'off',
    },
  },
  // Якщо є специфічні файли для JSX:
  {
    files: ['**/*.jsx'],
    plugins: {
      react: pluginReact,
    },
    rules: {
      'react/prop-types': 'off', // вимкнути перевірку типів для компонентів React
    },
  },
];
