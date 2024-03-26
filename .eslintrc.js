module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "standard-with-typescript",
        "plugin:react/recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "ignorePatterns": [".eslintrc.js", "*.config.js"],
    "rules": {
        "comma-dangle": "off",
        "@typescript-eslint/comma-dangle": "off",
        "semi": "off",
        "@typescript-eslint/semi": ["error", "always"],
        'object-curly-spacing': "never",
    }
}
