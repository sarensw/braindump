/** @type {import('snowpack').SnowpackUserConfig} */
module.exports = {
  extends: 'electron-snowpack/config/snowpack.js',
  plugins: [
    '@snowpack/plugin-postcss',
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-typescript'
  ],
  mount: {
    './node_modules/monaco-editor/min/vs': {
      url: '/monaco-editor',
      static: true,
      resolve: false
    },
    './node_modules/monaco-editor/min-maps': {
      url: '/min-maps',
      static: true,
      resolve: false
    }
  }
}
