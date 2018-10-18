const path = require('path');
const webpack = require('webpack');
const SRC_DIR = path.resolve(__dirname, 'public/src');
const BUILD_DIR = path.resolve(__dirname, 'public/dist');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const extractCSS = new ExtractTextPlugin('[name].font.css');
const extractSCSS = new ExtractTextPlugin('[name].styles.css');

var LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = {
    entry: {
        index: path.join(SRC_DIR, 'index.js')
    },
    devtool: process.env.NODE_ENV === 'development' ? 'cheap-module-eval-source-map' : 'source-map',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js',
        publicPath: 'dist/'
    },
    watch: false,
    resolve: {
        modules: [path.resolve(__dirname, 'public/src'), path.resolve(__dirname, 'public/resource'), 'node_modules'],
        extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        'plugins': ['lodash', 'transform-class-properties'],
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
                        loader: 'css-loader'
                        // options: {alias: {'../img': '../public/resource/img'}}
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
                test: /\.(png|jpg|jpeg|gif|ico)$/,
                use: [
                    {
                        // loader: 'url-loader'
                        loader: 'file-loader',
                        options: {
                            name: './img/[name].[hash].[ext]'
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader'
                // options: {
                //     name: './fonts/[name].[hash].[ext]'
                // }
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        extractCSS,
        extractSCSS,
        new LodashModuleReplacementPlugin,
        new LiveReloadPlugin()
        // new CopyWebpackPlugin([
        //   {from: './public/resource/img', to: 'img'}
        // ],
        // {copyUnmodified: false}
    //   )
    ]    
};
