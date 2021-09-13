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
                    '@app': './src',
                    '@config': './src/config',
                    '@controllers': './src/controllers',
                    '@telegram': './src/controllers/telegram',
                    '@tHelpers': './src/controllers/telegram/helpers',
                    '@api': './src/controllers/api/v1',
                    '@device': './src/controllers/api/v1',
                    '@iot-device': './src/controllers/api/v1',
                    '@user': './src/controllers/api/v1',
                    '@middlewares': './src/middlewares',
                    '@auth': './src/middlewares',
                    '@models': './src/models',
                    '@routes': './src/routes',
                    '@temp': './src/tmp',
                    '@utils': './src/utils',
                    '@cTypes': './src/utils/@types',
                    '@helpers': './src/utils/helpers',
                    '@cFunctions': './src/utils/helpers',
                    '@validators': './src/utils/helpers',
                },
            },
        ],
    ],
    ignore: ['**/*.test.ts', '**/*.spec.ts'],
};
