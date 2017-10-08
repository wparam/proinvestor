const path = require('path');
const webpack = require('webpack');
const SRC_DIR = path.resolve(__dirname, 'public/src');
const BUILD_DIR = path.resolve(__dirname, 'public/dist');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const extractCSS = new ExtractTextPlugin('[name].fonts.css');
const extractSCSS = new ExtractTextPlugin('[name].styles.css');

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
    watch: false,
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
                test: /\.(scss)$/,
                use: ['css-hot-loader'].concat(extractSCSS.extract({
                    fallback: 'style-loader',
                    use: [
                    {
                        loader: 'css-loader',
                        options: {alias: {'../img': '../public/img'}}
                    },
                    {
                        loader: 'sass-loader'
                    }
                    ]
                }))
            },
            {
                test: /\.css$/,
                use: extractCSS.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            }
        ]
    },
    plugins: [
        // new HtmlWebpackPlugin({
        //     inject: true,
        //     template: '!!raw-loader!app/views/index.ejs'
        //     // filename: path.join(BUILD_DIR, 'index.html.ejs')
        // }),
        new webpack.optimize.UglifyJsPlugin,
        new LodashModuleReplacementPlugin
    ]    
}