module.exports = {
  parser: '@typescript-eslint/parser', // Understand TypeScript
  ignorePatterns: ['dist/', 'node_modules/'],
  parserOptions: {
    ecmaVersion: 2020, // modern JS features
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint', // TypeScript-specific linting
    'xss',                // security checks against XSS
    'security',           // general security best practices
    'sort-keys-fix',      // optional: auto-sorts object keys if needed
  ],
  extends: [
    'eslint:recommended',               // basic ESLint rules
    'plugin:@typescript-eslint/recommended', // TS best practices
    'plugin:security/recommended',      // security rules
    'prettier',                         // avoid conflicts with Prettier
    'plugin:prettier/recommended',      // shows prettier errors in ESLint
  ],
  env: {
    node: true,   // Node.js global variables
    es6: true,    // ES6 features
  },
  rules: {
    // TypeScript rules
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',

    // Node.js / backend preferences
    'no-console': 'warn',        // warn for console logs
    'no-debugger': 'error',      // prevent debugger in production
    'prefer-const': 'error',     // encourage const
    'prefer-template': 'error',  // template strings over string concat

    // Security rules
    'xss/no-location-href-assign': 'error',
    'xss/no-mixed-html': 'off',

    // Optional code style
    'sort-keys-fix/sort-keys-fix': 'off', // enable if you want object keys auto-sorted

    semi: ['error', 'always'],  // throws an error if a statement misses a semicolon
    'no-console': 'warn',       // optional
    '@typescript-eslint/no-unused-vars': ['warn']
  },
};
