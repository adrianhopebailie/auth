const path = require('path');

module.exports = {
  entry: './auth-dialogue.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'auth-dialogue.js',
    library: 'AuthDialogue',
    path: path.resolve(__dirname)
  }
};