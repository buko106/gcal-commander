export default {
  '*.{json,md}': [
    'prettier --write',
  ],
  '*.{ts,js}': [
    'eslint --fix',
    'prettier --write',
  ],
};