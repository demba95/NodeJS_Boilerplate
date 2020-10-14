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
                    '@custom_types': './src/@types',
                    '@config': './src/config',
                    '@controllers': './src/controllers',
                    '@middlewares': './src/middlewares',
                    '@models': './src/models',
                    '@routes': './src/routes',
                    '@utils': './src/utils',
                },
            },
        ],
    ],
    ignore: ['**/*.test.ts', '**/*.spec.ts'],
};
