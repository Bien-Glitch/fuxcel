import typescript from '@rollup/plugin-typescript';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import {dts} from "rollup-plugin-dts";

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
				sourcemap: true
			},
			// Minified build
			{
				file: 'dist/js/fuxcel.min.js',
				format: 'iife',
				name: 'fuxcel',
				sourcemap: true,
				exports: 'named',
				plugins: [terser()]
			},
			// CommonJS Build
			{
				file: 'dist/js/fuxcel.cjs.js',
				format: 'cjs',
				exports: 'named',
				sourcemap: true,
			},
			// ES Module build
			{
				file: 'dist/js/fuxcel.esm.js',
				format: 'es',
				exports: 'named',
				sourcemap: true
			}
		],
		plugins: [
			nodeResolve(),
			typescript({
				tsconfig: './tsconfig.json',
				declaration: true,
				declarationDir: 'dist/js',  // Must be inside dist/
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
