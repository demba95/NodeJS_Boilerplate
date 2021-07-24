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
        '@telegram/(.*)': '<rootDir>/src/controllers/telegram/shared/$1',
        '@apis': '<rootDir>/src/controllers/api/v1/apis.ts',
        '@devices': '<rootDir>/src/controllers/api/v1/devices.ts',
        '@iotDevices': '<rootDir>/src/controllers/api/v1/iot-devices.ts',
        '@users': '<rootDir>/src/controllers/api/v1/users.ts',
        '@middlewares/(.*)': '<rootDir>/src/middlewares/$1',
        '@auth': '<rootDir>/src/middlewares/auth.ts',
        '@models/(.*)': '<rootDir>/src/models/$1',
        '@routes/(.*)': '<rootDir>/src/routes/$1',
        '@utils/(.*)': '<rootDir>/src/utils/$1',
        '@cTypes': '<rootDir>/src/utils/@types/types.ts',
        '@helpers/(.*)': '<rootDir>/src/utils/helpers/$1',
        '@cFunctions': '<rootDir>/src/utils/helpers/functions/functions.ts',
        '@validator': '<rootDir>/src/utils/helpers/validator/validator.ts',
    },
    preset: 'ts-jest',
    rootDir: root,
    testMatch: ['<rootDir>/src/**/*.test.ts'],
};
