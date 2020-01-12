// @flow
import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import LoadablePlugin from '@loadable/webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import css from './css';

const PORT = 8062;
const DEV = process.env.NODE_ENV !== 'production';
const context = path.resolve(__dirname, '..');

const config = {
  mode: DEV ? 'development' : 'production',
  devtool: DEV ? 'inline-source-map' : '#source-map',
  context,
  optimization: {
    minimize: !DEV,
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
        terserOptions: {
          ecma: undefined,
          warnings: false,
          parse: {},
          compress: {
            // collapse_vars: false,
            // drop_console: true,
          },
          mangle: true, // Note `mangle.properties` is `false` by default.
          module: false,
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: true,
        },
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  entry: path.resolve(__dirname, '../src/microFrontEnd'),
  output: {
    filename: 'microFrontEnd.js',
    chunkFilename: 'microFrontEnd[name].js',
    path: path.join(__dirname, '../dist'),
    publicPath: '/mf/spendai/dist/',
    libraryTarget: 'amd',
  },
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.jsx', '.json'],
    alias: {
      react: path.resolve('./node_modules/react'),
      'ag-grid-community': path.resolve('./node_modules/ag-grid-community'),
    },
  },
  plugins: [
    new LoadablePlugin(),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new webpack.DefinePlugin({
      'process.env.BACKEND_SERVICE_URL': JSON.stringify(process.env.BACKEND_SERVICE_URL),
      'process.env.TABLEAU_AUTH_URL': JSON.stringify(process.env.TABLEAU_AUTH_URL),
      'process.env.TABLEAU_BASE_URL': JSON.stringify(process.env.TABLEAU_BASE_URL),
      'process.env.TABLEAU_PROJECT': JSON.stringify(process.env.TABLEAU_PROJECT),
      'process.env.TABLEAU_WORKBOOK': JSON.stringify(process.env.TABLEAU_WORKBOOK),
      'process.env.MICRO_FRONTEND': JSON.stringify(true),
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
  ],
  module: {
    rules: [{
      parser: {
        system: false,
      },
    }, {
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    }, {
      test: /\.(js|jsx)$/,
      use: [{
        loader: 'babel-loader',
      }, /* {
        loader: 'eslint-loader',
      } */],
    }, {
      test: /\.txt$/i,
      exclude: /node_modules/,
      use: [{
        loader: 'file-loader',
      }],
    }, {
      test: /\.xml$/,
      exclude: /node_modules/,
      use: [{
        loader: 'xml-loader',
      }],
    }, {
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      use: [{
        loader: 'graphql-tag/loader',
      }],
    }, {
      test: /\.(woff|woff2?|ttf|eot)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      }],
    }, {
      test: /\.(gif|png|jpe?g|svg)$/i,
      use: ['url-loader', {
        loader: 'image-webpack-loader',
        query: {
          mozjpeg: {
            progressive: true,
          },
          gifsicle: {
            interlaced: false,
          },
          optipng: {
            optimizationLevel: 4,
          },
          pngquant: {
            quality: [0.75, 0.9],
            speed: 3,
          },
          svgo: {
            enabled: false,
          },
        },
      }],
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }, {
      test: /\.(sa|sc)ss$/,
      exclude: /node_modules/,
      use: [{
        loader: 'style-loader',
      }, {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          modules: {
            localIdentName: css.generateScopedName,
          },
          importLoaders: 1,
        },
      }, {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          plugins: [
            autoprefixer(),
          ],
        },
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
          sassOptions: {
            includePaths: [path.resolve(__dirname, '../node_modules')],
          },
        },
      }],
    }],
  },
};

if (DEV) {
  config.devServer = {
    open: false,
    openPage: 'spendai',
    contentBase: config.output.output,
    historyApiFallback: true,
    host: '0.0.0.0',
    disableHostCheck: true,
    public: `http://localhost:${PORT}`,
    port: PORT,
    headers: { 'Access-Control-Allow-Origin': '*' },
    /*
    historyApiFallback: {
      rewrites: [
        { from: /^\//, to: '/dist/index.html' },
      ],
    },
    */
  };

  config.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    ...config.plugins,
    /*
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html')
    }),
    */
  ];
} else {
  config.plugins = [
    ...config.plugins,
  ];
}

export default config;
