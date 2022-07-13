module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  // testRegex: ".*\\.spec\\.ts$",
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  testPathIgnorePatterns: ['<rootDir>/node_modules'],
};
