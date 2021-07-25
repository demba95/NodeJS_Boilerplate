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
                    '@telegram-helper': './src/controllers/telegram/shared',
                    '@api': './src/controllers/api/v1',
                    '@device': './src/controllers/api/v1',
                    '@iot-device': './src/controllers/api/v1',
                    '@user': './src/controllers/api/v1',
                    '@middlewares': './src/middlewares',
                    '@auth': './src/middlewares',
                    '@models': './src/models',
                    '@routes': './src/routes',
                    '@utils': './src/utils',
                    '@cTypes': './src/utils/@types/types.ts',
                    '@helpers': './src/utils/helpers',
                    '@cFunctions': './src/utils/helpers/functions',
                    '@validator': './src/utils/helpers/validator',
                },
            },
        ],
    ],
    ignore: ['**/*.test.ts', '**/*.spec.ts'],
};
