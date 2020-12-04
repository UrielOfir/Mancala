const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
     "mode": "development",
     "entry": "./src/mancala.js",
     "output": {
       "path": __dirname + '/dist',
       "filename": "bundle.js"
     },
    devServer: {
        contentBase: __dirname + '/dist',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html'
        })
    ],
     "module": {
      "rules": [
        {
          "test": /\.css$/,
          "use": [
            "style-loader",
            "css-loader"
          ]
        },
        {
          "test": /\.js$/,
          "exclude": /node_modules/,
          "use": {
            "loader": "babel-loader",
            "options": {
              "presets": [
                "@babel/preset-env",
              ]
            }
          }
        },
      ]
    }
}