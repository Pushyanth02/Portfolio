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

      // Sandbox boilerplate (stock shadcn sidebar.tsx skeleton uses
      // Math.random in a useMemo; use-toast.ts has a type-only const).
      // Not portfolio source — relax rather than editing vendor code.
      "react-hooks/purity": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { varsIgnorePattern: "^actionTypes$" },
      ],
    },
  },
  {
    // Vendored Originkit components (Text Morph, Glass Icon) are wired in
    // exactly as the registry delivers them — byte-for-byte, not rewritten.
    // Their internals intentionally use hook-calling render fns with
    // underscore-prefixed names and ref-based effect deps; relax the rules
    // that flag those patterns rather than editing the vendor source.
    files: ["src/components/originkit/**"],
    rules: {
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "off",
      "@typescript-eslint/no-unused-vars": "off",
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
