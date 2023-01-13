import { trimTrailingSlash } from "./utils/formatters";

export default {
  env: {
    subgraphEndpoint: trimTrailingSlash(process.env.SUBGRAPH_ENDPOINT || 'https://graph.ipfs1.dev.infra.soramitsu.co.jp/subgraphs/name/klaytn-subgraph/exchange'),
    explorerEndpoint: trimTrailingSlash(process.env.EXPLORER_ENDPOINT || 'https://baobab.scope.klaytn.com'),
    exchangeEndpoint: trimTrailingSlash(process.env.EXCHANGE_ENDPOINT || 'https://web.dev.klaytn.tachi.soramitsu.co.jp')
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "klaytn",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    "~assets/scss/main.css",
    "~assets/scss/vars.scss",
    "~assets/scss/bulma.scss",
    "~assets/scss/element.scss",
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ["~/plugins/element.js", "~/plugins/echarts.js", "~/plugins/dayjs.js"],

  router: {
    mode: 'hash'
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ["@nuxtjs/svg", "@nuxtjs/composition-api/module"],

  // serverMiddleware: {
  //   "/api": "~/api",
  // },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ["@nuxtjs/i18n", "@nuxtjs/style-resources"],

  styleResources: {
    scss: ["./assets/scss/vars.scss"],
  },

  ssr: false, // Disable Server Side rendering

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    loaders: {
      scss: {
        sassOptions: {
          quietDeps: true
        }
      }
    }
  },
}
