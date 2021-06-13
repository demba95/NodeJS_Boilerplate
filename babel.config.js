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
                    '@config': './src/config',
                    '@controllers': './src/controllers',
                    '@middlewares': './src/middlewares',
                    '@models': './src/models',
                    '@routes': './src/routes',
                    '@utils': './src/utils',
                    '@cTypes': './src/utils/@types',
                    '@helpers': './src/utils/helpers',
                },
            },
        ],
    ],
    ignore: ['**/*.test.ts', '**/*.spec.ts'],
};
