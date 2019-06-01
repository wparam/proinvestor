const path = require('path');
const webpack = require('webpack');
const SRC_DIR = path.resolve(__dirname, 'public/src');
const BUILD_DIR = path.resolve(__dirname, 'public/dist');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const extractSCSS = new MiniCssExtractPlugin(process.env.NODE_ENV === 'development' ? '[name].styles.css' : '[name].[contenthash].styles.css');

var LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = {
    mode: process.env.NODE_ENV,
    entry: {
        index: path.join(SRC_DIR, 'index.js')
    },
    devtool: process.env.NODE_ENV === 'development' ? 'cheap-module-eval-source-map' : 'source-map',
    target: 'web',
    output: {
        path: BUILD_DIR,
        filename: `bundle.${new Date().getTime()}.js`,
        publicPath: 'dist/'
    },
    watch: false,
    resolve: {
        modules: [path.resolve(__dirname, 'public/src'), path.resolve(__dirname, 'public/resource'), 'node_modules'],
        extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx']
    },
    stats: {
        entrypoints: false,
        children: false
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
                test: /\.(s*)css$/, 
                use: [
                    {
                        loader: "sass-loader"
                    },
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../',
                            hmr: process.env.NODE_ENV === 'development'
                        }
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: ()=>{
                                return [
                                    require('precss'),
                                    require('autoprefixer')
                                ];
                            }
                        }
                    }
                ]
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
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        extractSCSS,
        new LodashModuleReplacementPlugin,
        new LiveReloadPlugin()
    ]    
};
