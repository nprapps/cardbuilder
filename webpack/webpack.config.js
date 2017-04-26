//require our dependencies
var path = require('path')
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

module.exports = {
    context: __dirname,
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        '../assets/js/app',
    ],
    output: {
        path: path.resolve('../assets/bundles/'), 
        filename: '[name]-[hash].js', 
        publicPath: 'http://localhost:3000/assets/bundles/'
    },
    
    plugins: [
    ],
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader", options: {
                        sourceMap: true
                    }
                }, {
                    loader: "less-loader", options: {
                        sourceMap: true
                    }
                }]
            }
        ]
    },
    
    resolve: {
        modules: ['../node_modules'],
        extensions: ['.js', '.jsx'] 
    }   
}