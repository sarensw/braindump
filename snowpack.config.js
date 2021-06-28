/** @type {import('snowpack').SnowpackUserConfig} */
module.exports = {
  mount: {
    public: '/',
    src: '/dist'
  },
  devOptions: {
    port: 8090
  },
  buildOptions: {
    baseUrl: './'
  },
  plugins: [
    '@snowpack/plugin-postcss',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-react-refresh'
  ]
}
