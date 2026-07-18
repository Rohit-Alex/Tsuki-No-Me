module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": ["eslint:recommended", 'plugin:react/recommended', 'plugin:react/jsx-runtime', "plugin:react-hooks/recommended", "@typescript-eslint"],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
        "arrow-body-style": ["error", "as-needed"],
        "react/self-closing-comp": ["error", { "component": true, "html": true }],
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
        "react-hooks/exhaustive-deps": "error"
    }
}