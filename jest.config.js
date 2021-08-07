const { resolve } = require('path');
const root = resolve(__dirname);

/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
    displayName: 'TEST',
    clearMocks: true,
    coveragePathIgnorePatterns: ['/node_modules/'],
    moduleNameMapper: {
        '~/(.*)': '<rootDir>/src/$1',
        '@config/(.*)': '<rootDir>/src/config/$1',
        '@controllers/(.*)': '<rootDir>/src/controllers/$1',
        '@telegram': '<rootDir>/src/controllers/telegram/0_telegram.ts',
        '@telegram-helper': '<rootDir>/src/controllers/telegram/shared/helper.ts',
        '@api': '<rootDir>/src/controllers/api/v1/api.ts',
        '@device': '<rootDir>/src/controllers/api/v1/device.ts',
        '@iot-device': '<rootDir>/src/controllers/api/v1/iot-device.ts',
        '@user': '<rootDir>/src/controllers/api/v1/user.ts',
        '@middlewares/(.*)': '<rootDir>/src/middlewares/$1',
        '@auth': '<rootDir>/src/middlewares/auth.ts',
        '@models/(.*)': '<rootDir>/src/models/$1',
        '@routes': '<rootDir>/src/routes/0_api.ts',
        '@utils/(.*)': '<rootDir>/src/utils/$1',
        '@cTypes': '<rootDir>/src/utils/@types/0_types.ts',
        '@helpers/(.*)': '<rootDir>/src/utils/helpers/$1',
        '@cFunctions': '<rootDir>/src/utils/helpers/functions/0_functions.ts',
        '@validator': '<rootDir>/src/utils/helpers/validator/0_validator.ts',
    },
    preset: 'ts-jest',
    rootDir: root,
    testMatch: ['<rootDir>/src/**/*.test.ts'],
};
