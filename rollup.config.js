import replace from 'rollup-plugin-replace'
import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/dom.ts',
  output: {
    file: 'umd/dom.js',
    format: 'umd',
    name: 'stego',
    globals: {
      '@rgba-image/lanczos': 'lanczos',
    },
  },
  plugins: [
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          target: 'ES6',
          module: 'ESNext',
          declaration: true,
          declarationMap: false,
          sourceMap: false,
        },
      },
    }),
    replace({
      'process.env.PLATFORM': JSON.stringify('dom'),
    }),
  ],
  treeshake: {
    moduleSideEffects: true,
  },
  external: ['@rgba-image/lanczos'],
}
