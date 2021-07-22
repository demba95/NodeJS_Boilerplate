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
                    '@apis': './src/controllers/api/v1',
                    '@iots': './src/controllers/api/v1',
                    '@iotDevices': './src/controllers/api/v1',
                    '@users': './src/controllers/api/v1',
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
