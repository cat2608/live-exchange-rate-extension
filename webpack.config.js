const path = require('path');

// webpack.config.js
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './popup.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new Dotenv()
  ]
};
