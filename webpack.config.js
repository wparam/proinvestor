const path = require('path');

const SRC_DIR = path.resolve(__dirname, 'public');
const BUILD_DIR = path.resolve(__dirname, 'public/dist');


module.exports = {
    entry: {
        index: path.join(SRC_DIR, 'index.js')
    },
    devtool: 'eval-source-map',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    module: {
        rules: [
            
        ]
    },
    plugins: [new HtmlWebpackPlugin({
        inject: true,
        template: './app/views/index.ejs'
    })]    
}