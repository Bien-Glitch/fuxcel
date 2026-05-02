import typescript from '@rollup/plugin-typescript';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import {dts} from "rollup-plugin-dts";
import MagicString from "magic-string";

function restoreNames() {
	return {
		name: 'restore-names',
		renderChunk(code, chunk, options) {
			const s = new MagicString(code);
			const regex = /\bfx\$\d+\b/g;
			let match;
			while ((match = regex.exec(code)) !== null) {
				s.overwrite(match.index, match.index + match[0].length, 'fx');
			}
			return {
				code: s.toString(),
				map: s.generateMap({hires: true})
			};
		}
	};
}

const restoreNamesPlugin = [restoreNames()];

export default [
	{
		input: 'src/ts/index.ts',
		output: [
			// Development build
			{
				file: 'dist/js/fuxcel.js',
				format: 'iife',
				name: 'fuxcel',
				exports: 'named',
				sourcemap: true,
				plugins: restoreNamesPlugin
			},
			// Minified build
			{
				file: 'dist/js/fuxcel.min.js',
				format: 'iife',
				name: 'fuxcel',
				sourcemap: true,
				exports: 'named',
				plugins: [restoreNames(), terser()]
			},
			// CommonJS Build
			{
				file: 'dist/js/fuxcel.cjs.js',
				format: 'cjs',
				exports: 'named',
				sourcemap: true,
				plugins: restoreNamesPlugin
			},
			// ES Module build
			{
				file: 'dist/js/fuxcel.esm.js',
				format: 'es',
				exports: 'named',
				sourcemap: true,
				plugins: restoreNamesPlugin
			}
		],
		plugins: [
			nodeResolve(),
			typescript({
				tsconfig: './tsconfig.json',
				// declaration: true,
				// declarationDir: 'dist/js',  // Must be inside dist/
				outDir: 'dist/js'
			})
		]
	},
	// ─── TYPE BUNDLE (.d.ts) ────────────────────────────────────
	{
		input: 'src/ts/types/index.ts',
		output: {
			file: 'dist/js/fuxcel.d.ts',
			format: 'es'
		},
		plugins: [dts()]
	}
];
