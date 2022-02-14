/** @type {import('snowpack').SnowpackUserConfig} */
module.exports = {
  mount: {
    public: { url: '/', static: true },
    'src/renderer': { url: '/dist' }
  },
  buildOptions: {
    "baseUrl": "./",
    out: "buildci/renderer"
  },
  plugins: [
    '@snowpack/plugin-postcss',
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-typescript',
    '@snowpack/plugin-dotenv'
  ],
  packageOptions: {
    knownEntrypoints: [
      'react-is'
    ]
  }
}
