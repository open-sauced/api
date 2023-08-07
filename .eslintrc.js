module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  plugins: [
    "@typescript-eslint/eslint-plugin",
    "no-loops",
    "no-use-extend-native",
    "promise",
    "@darraghor/nestjs-typed",
  ],
  extends: [
    "eslint:recommended",
    "plugin:no-use-extend-native/recommended",
    "plugin:promise/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:node/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
    "plugin:@darraghor/nestjs-typed/recommended",
    "plugin:prettier/recommended",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
    es2021: true,
  },
  ignorePatterns: ["test", "dist", "public", "/**/node_modules/*", ".eslintrc.js", "coverage"],
  overrides: [
    {
      env: {
        jest: true,
      },
      files: ["**/__tests__/**/*.[jt]s", "**/?(*.)+(spec|test).[jt]s"],
      extends: ["plugin:jest/recommended"],
    },
  ],
  rules: {
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "object",
          "type",
          "index",
          "parent",
          "sibling"
        ]
      }
    ],
    // eslint:recommended
    "arrow-body-style": ["error", "as-needed"],
    "capitalized-comments": [
      "error",
      "never",
      {
        ignorePattern: "pragma|ignored",
        ignoreInlineComments: true,
      },
    ],
    curly: ["error", "all"],
    "dot-notation": "error",
    eqeqeq: ["error", "always"],
    "multiline-comment-style": ["error", "starred-block"],
    "no-confusing-arrow": "error",
    "no-div-regex": "error",
    "no-else-return": [
      "error",
      {
        allowElseIf: false,
      },
    ],
    "no-extra-bind": "error",
    "no-extra-boolean-cast": [
      "error",
      {
        enforceForLogicalOperands: true,
      },
    ],
    "no-extra-label": "error",
    "no-floating-decimal": "error",
    "no-implicit-coercion": [
      "error",
      {
        allow: ["!!"],
      },
    ],
    "no-lonely-if": "error",
    "no-undef-init": "error",
    "no-unneeded-ternary": "error",
    "no-useless-computed-key": [
      "error",
      {
        enforceForClassMembers: true,
      },
    ],
    "no-useless-rename": "error",
    "no-useless-return": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "one-var": ["error", "never"],
    "one-var-declaration-per-line": ["error", "always"],
    "operator-assignment": ["error", "always"],
    "prefer-arrow-callback": "error",
    "prefer-const": "error",
    "prefer-destructuring": [
      "error",
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: true,
          object: true,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    "prefer-exponentiation-operator": "error",
    "prefer-object-has-own": "error",
    "prefer-object-spread": "error",
    "prefer-template": "error",
    "quote-props": ["error", "as-needed"],
    "sort-vars": "error",
    "spaced-comment": ["error", "always"],
    strict: ["error", "never"],
    yoda: [
      "error",
      "never",
      {
        onlyEquality: true,
      },
    ],
    "array-bracket-newline": ["error", "consistent"],
    "array-bracket-spacing": [
      "error",
      "never",
      {
        arraysInArrays: true,
      },
    ],
    "array-element-newline": ["error", "consistent"],
    "arrow-spacing": "error",
    "block-spacing": ["error", "always"],
    "brace-style": ["error", "1tbs"],
    "comma-spacing": [
      "error",
      {
        before: false,
        after: true,
      },
    ],
    "comma-style": ["error", "last"],
    "computed-property-spacing": ["error", "never"],
    "dot-location": ["error", "property"],
    "eol-last": ["error", "always"],
    "func-call-spacing": ["error", "never"],
    "function-call-argument-newline": ["error", "consistent"],
    "jsx-quotes": ["error", "prefer-double"],
    "key-spacing": [
      "error",
      {
        beforeColon: false,
        afterColon: true,
      },
    ],
    "keyword-spacing": [
      "error",
      {
        before: true,
        after: true,
      },
    ],
    "line-comment-position": [
      "error",
      {
        position: "above",
        ignorePattern: "pragma",
        applyDefaultIgnorePatterns: false,
      },
    ],
    "linebreak-style": ["error", "unix"],
    "lines-between-class-members": [
      "error",
      "always",
      {
        exceptAfterSingleLine: true,
      },
    ],
    "multiline-ternary": ["error", "always-multiline"],
    "newline-per-chained-call": [
      "error",
      {
        ignoreChainWithDepth: 3,
      },
    ],
    "no-multi-spaces": "error",
    "no-multiple-empty-lines": "error",
    "no-trailing-spaces": "error",
    "no-whitespace-before-property": "error",
    "object-curly-spacing": [
      "error",
      "always",
      {
        arraysInObjects: true,
        objectsInObjects: true,
      },
    ],
    "object-property-newline": [
      "error",
      {
        allowAllPropertiesOnSameLine: true,
      },
    ],
    "operator-linebreak": [
      "error",
      "after",
      {
        overrides: {
          "?": "before",
          ":": "before",
        },
      },
    ],
    "padded-blocks": ["error", "never"],
    "padding-line-between-statements": [
      "error",
      {
        blankLine: "always",
        prev: ["const", "let", "var"],
        next: "*",
      },
      {
        blankLine: "any",
        prev: ["const", "let", "var"],
        next: ["const", "let", "var"],
      },
    ],
    "rest-spread-spacing": ["error", "never"],
    semi: [
      "error",
      "always",
      {
        omitLastInOneLineBlock: true,
      },
    ],
    "semi-spacing": [
      "error",
      {
        before: false,
        after: true,
      },
    ],
    "semi-style": ["error", "last"],
    "space-before-blocks": ["error", "always"],
    "space-infix-ops": [
      "error",
      {
        int32Hint: false,
      },
    ],
    "space-unary-ops": [
      "error",
      {
        words: true,
        nonwords: false,
      },
    ],
    "switch-colon-spacing": [
      "error",
      {
        after: true,
        before: false,
      },
    ],
    "template-curly-spacing": ["error", "never"],
    "template-tag-spacing": ["error", "always"],
    "unicode-bom": "error",
    "wrap-iife": [
      "error",
      "inside",
      {
        functionPrototypeMethods: true,
      },
    ],
    "wrap-regex": "error",

    // node/recommended
    "node/no-unsupported-features/es-syntax": "off",
    "node/no-process-exit": "error",
    "node/no-path-concat": "error",
    "node/no-new-require": "error",
    "node/no-callback-literal": "error",
    "node/handle-callback-err": "error",
    "node/no-sync": "error",
    "node/no-missing-import": "off",

    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/quotes": [
      "error",
      "double",
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    "object-curly-spacing": "off",
    "@typescript-eslint/object-curly-spacing": ["error", "always"],
    semi: "off",
    "@typescript-eslint/semi": "error",
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    "no-loops/no-loops": "error",
    "no-async-promise-executor": "error",
    "no-await-in-loop": "error",
    "no-promise-executor-return": "error",
    "require-atomic-updates": "error",
    "max-nested-callbacks": ["error", 3],
    "no-return-await": "error",
    "prefer-promise-reject-errors": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: false,
      },
    ],
    "@typescript-eslint/promise-function-async": "error",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-extraneous-class": "off",
  },
  settings: {
    node: {
      allowModules: ["express"],
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".ts"],
        paths: ["src"],
      },
    },
    "import/extensions": [".js", ".ts"],
    "import/parsers": {
      "@typescript-eslint/parser": [".js", ".ts"],
    },
  },
};
