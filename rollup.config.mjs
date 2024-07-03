import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import rollupPluginDts from 'rollup-plugin-dts'
import progress from 'rollup-plugin-progress'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        dir: 'dist/cjs',
        format: 'cjs',
        // sourcemap: true,
        name: 'sfc-bundler',
      },
      {
        dir: 'dist/esm',
        format: 'esm',
        // sourcemap: true,
      },
    ],
    external: ['esbuild'],
    plugins: [
      external(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      postcss(),
      terser(),
      progress({
        clearLine: false,
      }),
    ],
  },
  {
    input: ['src/index.ts'],
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [
      rollupPluginDts.default({
        compilerOptions: {
          preserveSymlinks: false,
        },
      }),
    ],
  },
]
