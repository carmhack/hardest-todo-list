module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "src/scss/_variables.scss";
          @import "src/scss/_general.scss";
        `
      }
    }
  },
  chainWebpack: (config) => {

    /* 
       Disable (or customize) prefetch, see:
       https://cli.vuejs.org/guide/html-and-static-assets.html#prefetch
    */
    config.plugins.delete('prefetch')

    /* 
       Configure preload to load all chunks
       NOTE: use `allChunks` instead of `all` (deprecated)
    */
    config.plugin('preload').tap((options) => {
      options[0].include = 'allChunks'
      return options
    })
  },
}
