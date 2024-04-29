import { defineConfig } from 'vite'
import babel from '@rollup/plugin-babel'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig({
	base: '',
  root: './src',
	server: {
    port: 3000,
    hot: true,
    open: true,
  },
	build: {
    outDir: '../dist',
    rollupOptions: {
      plugins: [
        babel({
          babelHelpers: 'bundled',
          presets: ['@babel/preset-env'],
        }),
      ],
    },
  },
	plugins: [
		createHtmlPlugin({
      minify: true,
      template: 'index.html',
      inject: {
        data: {
          title: 'index',
          injectScript: `<script src="./inject.js"></script>`,
        },
      },
    }),
	]
})