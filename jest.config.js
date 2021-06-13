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
        '@middlewares/(.*)': '<rootDir>/src/middlewares/$1',
        '@models/(.*)': '<rootDir>/src/models/$1',
        '@routes/(.*)': '<rootDir>/src/routes/$1',
        '@utils/(.*)': '<rootDir>/src/utils/$1',
        '@cTypes/(.*)': '<rootDir>/src/utils/@types/$1',
        '@helpers/(.*)': '<rootDir>/src/utils/helpers/$1',
    },
    preset: 'ts-jest',
    rootDir: root,
    testMatch: ['<rootDir>/src/**/*.test.ts'],
};
