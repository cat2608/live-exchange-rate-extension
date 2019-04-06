const path = require('path');

module.exports = {
  devtool: 'cheap-module-source-map',

  entry: './popup.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  watch: true,
};
