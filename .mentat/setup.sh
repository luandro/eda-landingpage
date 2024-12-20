echo '{
  "rules": {
    "@typescript-eslint/no-empty-object-type": "warn",
    "@typescript-eslint/no-require-imports": "warn"
  }
}' > .eslintrc.json
npm install
npm run build:dev