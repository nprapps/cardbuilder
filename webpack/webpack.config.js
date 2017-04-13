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
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(), // don't reload if there is an error
        new BundleTracker({filename: './webpack-stats.json'}), 
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