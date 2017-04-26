//require our dependencies
var path = require('path')
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

module.exports = {
    context: __dirname,
    entry: '../assets/js/app',
    output: {
        path: path.resolve('../assets/bundles/'), 
        filename: '[name]-[hash].js', 
    },
    
    plugins: [
    ],
    module: {
        rules: [
            {   
                test: /\.jsx?$/, 
                exclude: /node_modules/, 
                loader: 'babel-loader', 
            },
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