module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'taro/react',
  ],
  plugins: ['@typescript-eslint/eslint-plugin'],
  env: {
    node: true,
    jest: true,
  },
  globals: {},
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-empty-interface': 'off',

    'jsx-quotes': ['error', 'prefer-double'],
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',

    'import/no-commonjs': 'off',
  },
};
