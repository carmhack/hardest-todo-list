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
  }
}
