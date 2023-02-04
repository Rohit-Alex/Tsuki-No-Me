module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": ["eslint:recommended", 'plugin:react/recommended', 'plugin:react/jsx-runtime', "plugin:react-hooks/recommended", "autofix", "@typescript-eslint"],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
        "arrow-body-style": ["error", "as-needed"],
        "react/self-closing-comp": ["error", { "component": true, "html": true }],
        "autofix/no-unused-vars": [
            "error",
            {
                "argsIgnorePattern": "^_",
                "ignoreRestSiblings": true,
                "destructuredArrayIgnorePattern": "^_"
            }
        ],

        "@typescript-eslint/consistent-type-imports": [
            "error",
            {
                "prefer": "type-imports",
            }
        ],
        "import/order": [
            "error",
            {
                "groups": [
                    "builtin",
                    "external",
                    "parent",
                    "sibling",
                    "index",
                    "object",
                    "type"
                ],
                "pathGroups": [
                    {
                        "pattern": "@/**/**",
                        "group": "parent",
                        "position": "before"
                    }
                ],
                "alphabetize": { "order": "asc" }
            }
        ],
        "no-restricted-imports": [
            "error",
            {
                "patterns": ["../"]
            }
        ],
        "react-hooks/exhaustive-deps": "error"
    }
}