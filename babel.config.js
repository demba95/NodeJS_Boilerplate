module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current',
                },
            },
        ],
        '@babel/preset-typescript',
    ],
    plugins: [
        [
            'module-resolver',
            {
                alias: {
                    '~': './src',
                    '@api': './src/controllers/api',
                    '@config': './src/config',
                    '@controllers': './src/controllers',
                    '@middlewares': './src/middlewares',
                    '@models': './src/models',
                    '@routes': './src/routes',
                    '@utils': './src/utils',
                    '@cTypes': './src/utils/@types',
                    '@helpers': './src/utils/helpers',
                    '@fn': './src/utils/helpers/fn',
                    '@msg': './src/utils/helpers/msg',
                    '@validator': './src/utils/helpers/validator',
                },
            },
        ],
    ],
    ignore: ['**/*.test.ts', '**/*.spec.ts'],
};
