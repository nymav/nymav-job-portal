import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTypescript,
  { ignores: ["lib/generated/**", "node_modules/**", "dist/**", ".next/**", "out/**", "build/**", "coverage/**", "next-env.d.ts"] },
  { rules: { "@typescript-eslint/no-unused-vars": ["error", {argsIgnorePattern:"^_",varsIgnorePattern:"^_",caughtErrorsIgnorePattern:"^_"}], "@typescript-eslint/no-empty-object-type":"off", "@typescript-eslint/no-explicit-any":"error" } },
];

export default config;
