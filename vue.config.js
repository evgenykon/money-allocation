module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    hot: true,
    overlay: true,
    host: '0.0.0.0',
    port: 8000,
    public: 'localhost:8000',
    overlay: {
      warnings: false,
      errors: true
    }
  }
}
