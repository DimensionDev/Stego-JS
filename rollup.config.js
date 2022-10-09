import replace from '@rollup/plugin-replace'
import { swc, minify } from 'rollup-plugin-swc3'

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
    swc(),
    minify(),
    replace({
      'process.env.PLATFORM': JSON.stringify('dom'),
    }),
  ],
  treeshake: {
    moduleSideEffects: true,
  },
  external: ['@rgba-image/lanczos'],
}
