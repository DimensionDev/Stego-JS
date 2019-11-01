import replace from 'rollup-plugin-replace';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/dom.ts',
  output: {
    file: 'umd/dom.js',
    format: 'umd',
    name: 'stego',
  },
  plugins: [
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          target: 'es6',
        },
      },
    }),
    replace({
      'process.env.PLATFORM': JSON.stringify('dom'),
    }),
  ],
  treeshake: {
    pureExternalModules: true,
  },
};
