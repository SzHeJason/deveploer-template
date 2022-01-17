module.exports = {
  '**/*.{js,ts,d.ts}': [
    'eslint . --ext .ts',
    'git add',
  ],
  './src/**/*.{ts,d.ts}': () =>
    'tsc --noEmit --pretty',
};
