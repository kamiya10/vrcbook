/* eslint-disable import-x/no-named-as-default-member */
import js from '@eslint/js';
import ts from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import tailwind from 'eslint-plugin-readable-tailwind';
import importX from 'eslint-plugin-import-x';

export default ts.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  js.configs.recommended,
  ...ts.configs.recommendedTypeChecked,
  stylistic.configs.customize({
    arrowParens: true,
    semi: true,
    jsx: true,
    flat: true,
  }),
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  {
    rules: {
      'import-x/no-named-as-default-member': ['off'],
      'import-x/order': [
        'warn',
        {
          'groups': [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'unknown',
            'type',
          ],
          'newlines-between': 'always',
        },
      ],
      'sort-imports': [
        'warn', 
        {
          allowSeparatedGroups: true,
        },
      ],
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'readable-tailwind': tailwind,
    },
    rules: {
      ...tailwind.configs.warning.rules,
      'readable-tailwind/multiline': [
        'warn',
        {
          group: 'newLine',
        },
      ],
    },
  },
);