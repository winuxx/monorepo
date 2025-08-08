export default {
    processors: [],
    plugins: [
        'stylelint-order', //
        'stylelint-prettier',
    ],
    extends: [
        'stylelint-config-standard',
        'stylelint-config-idiomatic-order',
        'stylelint-config-recommended-less',
        'stylelint-config-recommended-vue',
        'stylelint-prettier/recommended',
        // 'stylelint-config-prettier',
    ],
    rules: {
        'selector-class-pattern': [
            // 命名规范 -
            '^([a-z][a-z0-9]*)(-[a-z0-9_]+)*$',
            {
                message: 'Expected class selector to be kebab-case',
            },
        ],
        // 'string-quotes': 'single', // 单引号
        'at-rule-no-unknown': null,
        'no-descending-specificity': null, // 禁止在具有较高优先级的选择器后出现被其覆盖的较低优先级的选择器
        'selector-pseudo-element-no-unknown': [
            true,
            {
                ignorePseudoElements: ['v-deep'],
            },
        ],
        'selector-pseudo-class-no-unknown': [
            true,
            {
                ignorePseudoClasses: ['deep'],
            },
        ],
        // 'value-keyword-case': [/(p|P)x$/], //todo: not worked
    },
    // 不同格式的文件指定自定义语法
    // overrides: [
    //     {
    //         files: ['**/*.(less|css|vue|html)'],
    //         customSyntax: 'postcss-less',
    //     },
    //     {
    //         files: ['**/*.(html|vue)'],
    //         customSyntax: 'postcss-html',
    //     },
    // ],
    ignoreFiles: [
        '**/*.js',
        '**/*.jsx',
        '**/*.ts',
        '**/*.tsx',
        '**/*.json',
        '**/*.md',
        '**/*.yaml',
    ],
}
