/** @type {import('snowpack').SnowpackUserConfig} */
module.exports = {
  // extends: 'electron-snowpack/config/snowpack.js',
  mount: {
    public: { url: '/', static: true },
    'src/renderer': { url: '/dist' }
  },
  buildOptions: {
    "baseUrl": "./"
  },
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
