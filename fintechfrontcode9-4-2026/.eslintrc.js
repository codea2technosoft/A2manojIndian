module.exports = {
    env: {
        node: true,
    },
    extends: ['eslint:recommended', 'react-app', 'react-app/jest'],
    root: true,
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        // 'prettier/prettier': 'warn',
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'no-unused-vars': 'warn',
        'no-async-promise-executor': 'off',
        'jsx-a11y/anchor-is-valid': 'off',
        'react-hooks/exhaustive-deps': 'off',
        'no-prototype-builtins': 'off',
        'jsx-a11y/alt-text': 'off'
    },
};
