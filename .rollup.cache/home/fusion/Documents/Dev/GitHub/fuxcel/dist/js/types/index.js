/**
 * fuxcel — Consolidated type declarations.
 *
 * This is the single source of truth for every type, interface, and global
 * augmentation in the library. It covers both usage contexts:
 *
 * ── ESM / module usage ───────────────────────────────────────────────────────
 * All types are exported as named exports and can be imported normally:
 *
 *   import type { FXRequestType, ValidatorConfigObject } from 'fuxcel';
 *
 * ── Script-tag / non-module usage ────────────────────────────────────────────
 * The `global {}` block augments `Window` and the global scope so IDEs surface
 * full intellisense for `fx`, `fuxcel`, `FuxcelValidator` etc. without any
 * import statement. Activate with one of:
 *
 *   /// <reference path="./node_modules/fuxcel/src/global.d.ts" />
 *
 *   // tsconfig.json
 *   { "include": ["node_modules/fuxcel/src/global.d.ts"] }
 */
export {};
//# sourceMappingURL=index.js.map