import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './', // path ke root project Next.js kamu
})

const customJestConfig = {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
}

export default createJestConfig(customJestConfig)
