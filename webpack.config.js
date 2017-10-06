const path = require('path');
const webpack = require('webpack');
const SRC_DIR = path.resolve(__dirname, 'public');
const BUILD_DIR = path.resolve(__dirname, 'public/dist');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
    entry: {
        index: path.join(SRC_DIR, 'index.js')
    },
    devtool: 'eval-source-map',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js',
        publicPath: '/public/dist/'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        'plugins': ['lodash'],
                        cacheDirectory: true,
                        presets: ['react', 'env']
                    }
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: '!!raw-loader!app/views/index.ejs'
            // filename: path.join(BUILD_DIR, 'index.html.ejs')
        }),
        new webpack.optimize.UglifyJsPlugin,
        new LodashModuleReplacementPlugin
    ]    
}