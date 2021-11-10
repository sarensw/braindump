/** @type {import('snowpack').SnowpackUserConfig} */
module.exports = {
  extends: 'electron-snowpack/config/snowpack.js',
  plugins: [
    '@snowpack/plugin-postcss',
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-typescript'
  ],
  packageOptions: {
    knownEntrypoints: [
      'react-is'
    ]
  }
}
