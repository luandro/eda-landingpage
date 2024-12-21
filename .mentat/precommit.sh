npx prettier --write "**/*.{ts,tsx,js,jsx,json,css,md}"
npm run lint -- --fix --max-warnings 9999 --no-error-on-unmatched-pattern || true
npm run test