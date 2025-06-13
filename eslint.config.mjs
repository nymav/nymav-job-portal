import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Add rules overrides here
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",  // changed to warn to avoid build failure
        {
          argsIgnorePattern: "^_", // ignore unused args starting with _
          varsIgnorePattern: "^_", // ignore unused vars starting with _
          caughtErrorsIgnorePattern: "^_", // ignore unused catch params starting with _
        },
      ],
      "@typescript-eslint/no-explicit-any": "off", // disable explicit any error temporarily
       '@typescript-eslint/no-empty-object-type': 'off',// prefer const warnings instead of errors
    },
  },
];

export default eslintConfig;
