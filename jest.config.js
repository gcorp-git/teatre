/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.ts'],
  experimentalDecorators: true,
  globals: {
    'ts-jest': {
      tsConfig: 'test/tsconfig.json'
    }
  }
};