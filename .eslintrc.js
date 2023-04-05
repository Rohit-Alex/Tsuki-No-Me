module.exports = {
  env: {
    browser: true,
    es2021: true,
    "jest/globals": true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: [
    "react",
    "@typescript-eslint",
    "jest"
  ],
  rules: {
    "react/react-in-jsx-scope": [
      "off"
    ],
    "react/prop-types": [
      "off",
      {
        ignore: null,
        customValidators: null,
        skipUndeclared: null
      }
    ],
    "no-empty-function": [
      "off",
      {
        allow: [
          "arrowFunctions"
        ]
      }
    ],
    "@typescript-eslint/no-empty-function": [
      "off",
      {
        allow: [
          "arrowFunctions"
        ]
      }
    ]
  }
};