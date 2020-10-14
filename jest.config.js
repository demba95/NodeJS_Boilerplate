const { resolve } = require('path');
const root = resolve(__dirname);

module.exports = {
    rootDir: root,
    displayName: 'TEST',
    testMatch: ['<rootDir>/src/**/*.test.ts'],
    testEnvironment: 'node',
    clearMocks: true,
    preset: 'ts-jest',
    moduleNameMapper: {
        '~/(.*)': '<rootDir>/src/$1',
        '@custom_types/(.*)': '<rootDir>/src/@types/$1',
        '@config/(.*)': '<rootDir>/src/config/$1',
        '@controllers/(.*)': '<rootDir>/src/controllers/$1',
        '@middlewares/(.*)': '<rootDir>/src/middlewares/$1',
        '@models/(.*)': '<rootDir>/src/models/$1',
        '@routes/(.*)': '<rootDir>/src/routes/$1',
        '@utils/(.*)': '<rootDir>/src/utils/$1',
    },
};
