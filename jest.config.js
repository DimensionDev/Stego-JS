module.exports = {
  transform: {
    '^.+\\.[jt]sx?$': 'ts-jest',
  },
  testRegex: '/__tests__/(?!.*/utils.[jt]sx?$).*.[jt]sx?$', // exclude utils module for test file
  globals: {
    "ts-jest": {
      isolatedModules: true
    }
  },
  testTimeout: 60000,
}


