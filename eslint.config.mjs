import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * ESLint flat config.
 *
 * Built on top of the Next.js core-web-vitals + TypeScript presets, with a
 * small set of project-specific relaxations. We keep the defaults that catch
 * real bugs (no-unused-vars, react-hooks rules, etc.) and only relax rules
 * that conflict with this codebase's deliberate patterns.
 */
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // This portfolio uses plain <img> everywhere (static export, no
      // next/image server). Silence the rule rather than litter disables.
      "@next/next/no-img-element": "off",

      // Apostrophes in prose ("let's", "I'm") are common here; the rule is
      // noisy for content-heavy components.
      "react/no-unescaped-entities": "off",

      // Allow `any` sparingly for DOM experiments / third-party shims.
      "@typescript-eslint/no-explicit-any": "off",

      // React 19 + Next 16 handle most hook deps automatically; the
      // exhaustive-deps rule is overly strict for effect cleanups here.
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "dev.log",
    ],
  },
];

export default eslintConfig;
