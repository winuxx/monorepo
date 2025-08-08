import { builtinModules } from 'node:module'

import js from '@eslint/js'
// import { defineConfig } from 'eslint-define-config'
// import tsParser from '@typescript-eslint/parser'
// import importPlugin from 'eslint-plugin-import'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import-x'
import oxlint from 'eslint-plugin-oxlint'
// import prettierPlugin from 'eslint-plugin-prettier'
import vuePlugin from 'eslint-plugin-vue'
import ts from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

const tsParser = ts.parser
const extraFileExtensions = ['.vue']
export default [
    js.configs.recommended,
    ...ts.configs.recommended,
    ...vuePlugin.configs['flat/recommended'],
    prettierConfig, // 关掉与Prettier产生冲突的ESlint格式相关配置
    // oxlint.configs['flat/recommended'], // 关掉oxlint已实现的
    {
        name: 'JJ-FE',
        files: [
            'components/*/*/src/**/*.vue',
            'components/*/*/src/**/*.js',
            'components/*/*/src/**/*.ts',
            'packages/*/src/**/*.vue',
            'packages/*/src/**/*.js',
            'packages/*/src/**/*.ts',
        ],
        ignores: ['node_modules', 'dist'],
        languageOptions: {
            sourceType: 'module',
            //     // ecmaVersion: 'latest',
            parser: vueParser, // tsParser,
            parserOptions: {
                parser: tsParser,
                // projectService: true,
                // project: ['./tsconfig.eslint.json', './packages/*/tsconfig.json'],
                // tsconfigRootDir: import.meta.dirname,
                extraFileExtensions,
            },
        },
        plugins: {
            // prettier: prettierPlugin,
        },
        rules: {
            // 'prettier/prettier': 'warn',
            // semi: ['error', 'never'], // 末尾分号
            // camelcase: 'off',
            // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
            // 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
            'no-empty': ['error', { allowEmptyCatch: true }],
            'no-shadow': 'off',
            'no-undef': 'off',
            eqeqeq: ['warn', 'always', { null: 'never' }],
            // 'prefer-const': 'off',
            'prefer-const': ['warn', { destructuring: 'all' }],
            // 'generator-star-spacing': 'off',
            'spaced-comment': ['error', 'always'],
            'no-unused-vars': 'off',
            'vue/no-unused-vars': 'off',
            'vue/multi-word-component-names': ['off'],
        },
        // overrides: [
        //     // {
        //     //     files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
        //     //     env: {
        //     //         mocha: true,
        //     //     },
        //     // },
        //     // {
        //     //     files: ['*.js'],
        //     //     rules: {
        //     //         '@typescript-eslint/explicit-module-boundary-types': 'off',
        //     //     },
        //     // },
        // ],
    },
    {
        name: 'TsEslint',
        // languageOptions: {
        //     sourceType: 'module',
        //     // ecmaVersion: 'latest',
        //     parser: tsParser,
        //     parserOptions: {
        //         parser: tsParser,
        //         // projectService: true,
        //         project: ['./tsconfig.eslint.json', './packages/*/tsconfig.json'],
        //         tsconfigRootDir: import.meta.dirname,
        //         // extraFileExtensions,
        //     },
        // },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off', // any类型警告
            '@typescript-eslint/no-unused-vars': 'off',
            // '@typescript-eslint/explicit-module-boundary-types': ['off'], // todo: 临时禁用
            // ts redeclare
            'no-redeclare': 'off', // Note: you must disable the base rule as it can report incorrect errors
            '@typescript-eslint/no-redeclare': [
                'error',
                {
                    // ignoreDeclarationMerge: true
                },
            ],
            // async-await
            // 'require-await': 'off', // Note: you must disable the base rule as it can report incorrect errors
            // '@typescript-eslint/require-await': 'error',
        },
    },
    {
        name: 'ImportX',
        files: [
            'components/*/*/src/**/*.vue',
            'components/*/*/src/**/*.js',
            'components/*/*/src/**/*.ts',
            'packages/*/src/**/*.vue',
            'packages/*/src/**/*.js',
            'packages/*/src/**/*.ts',
        ],
        // ignores: ['config/*.js', 'scripts/*.js'],
        plugins: {
            import: importPlugin,
        },
        rules: {
            // 'sort-imports': [
            //     'error',
            //     {
            //         ignoreCase: false,
            //         ignoreDeclarationSort: true,
            //         ignoreMemberSort: false,
            //         memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
            //         allowSeparatedGroups: false,
            //     },
            // ],
            'import/no-nodejs-modules': [
                'error',
                { allow: builtinModules.map((mod) => `node:${mod}`) },
            ],
            'import/no-extraneous-dependencies': 'off',
            'import/no-unresolved': 'off',
            'import/no-duplicates': 'warn',
            'import/order': [
                'error',
                {
                    // 'newlines-between': 'never',
                    'newlines-between': 'always',
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                        'object',
                        'type',
                        'unknown',
                    ],
                    pathGroups: [
                        {
                            pattern: '~/**',
                            group: 'internal',
                            position: 'before',
                        },
                        {
                            pattern: '@q/**',
                            group: 'internal',
                            position: 'before',
                        },
                        {
                            pattern: '@packages/**',
                            group: 'internal',
                            position: 'before',
                        },
                        {
                            pattern: '@/**',
                            group: 'internal',
                            position: 'after',
                        },
                    ],
                    pathGroupsExcludedImportTypes: ['builtin'],
                    distinctGroup: true,
                    alphabetize: {
                        order: 'asc',
                        // orderImportKind: 'asc',
                        caseInsensitive: true,
                    },
                },
            ],
            'import/newline-after-import': ['error', { count: 1 }],
        },
    },
    {
        name: 'Framework',
        files: ['config/*.js', 'scripts/*.js'],
        plugins: {
            import: importPlugin,
        },
        rules: {
            'import/no-nodejs-modules': 'off',
        },
    },
]
