/** @type {import('snowpack').SnowpackUserConfig} */
module.exports = {
  mount: {
    public: '/',
    src: '/dist'
  },
  devOptions: {
    port: 8090
  },
  plugins: [
    '@snowpack/plugin-postcss',
    '@snowpack/plugin-react-refresh'
  ]
}
