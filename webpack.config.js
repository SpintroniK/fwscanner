const path = require("path")
const glob = require('glob')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')

const dev = process.env.NODE_ENV === 'dev'

 
const PATHS = {
    src: path.join(__dirname, 'dist')
  }

const appConfig = {
    mode: dev? "development" : "production",
    context: path.resolve(__dirname, "."),
    entry: "./js/index.js",
    output: 
    {
        path: path.resolve(__dirname, "dist"),
        filename: "app.js"
    },
    // This is necessary due to the fact that emscripten puts both Node and web
    // code into one file. The node part uses Node’s `fs` module to load the wasm
    // file.
    // Issue: https://github.com/kripken/emscripten/issues/6542.
    node: 
    {
        "fs": "empty"
    },
    target: 'web',
    module: 
    {
        rules: 
        [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.s(a|c)ss$/,
                exclude: /\.module.(s(a|c)ss)$/,
                use: 
                [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.css$/,
                use: 
                [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /barcode_worker\.js$/,
                loader: "worker-loader"
            },
            // Emscripten JS files define a global. With `exports-loader` we can 
            // load these files correctly (provided the global’s name is the same
            // as the file name).
            {
                test: /scan\.js$/,
                loader: "exports-loader"
            },
            // wasm files should not be processed but just be emitted and we want
            // to have their public URL.
            {
                test: /scan\.wasm$/,
                type: "javascript/auto",
                loader: "file-loader"
            }
        ]
    },
    plugins: 
    [
        new CleanWebpackPlugin(),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin( { template: 'index.html' } ),
        new MiniCssExtractPlugin(),
        new WorkboxPlugin.GenerateSW({clientsClaim: true, skipWaiting: true})
    ]
}

if(!dev)
{
    appConfig.plugins.push(new TerserPlugin({
        parallel: true,
        sourceMap: false,
        terserOptions: 
        {
            ecma: 6,
        }
    }))

    appConfig.plugins.push(new PurgecssPlugin({ paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }) }))

    appConfig.plugins.push(new CopyPlugin({
        patterns: [{ from: path.join(__dirname, 'manifest.json'), to: path.join(__dirname, 'dist', 'manifest.json') },
                   { from: path.join(__dirname, 'images'), to: path.join(__dirname, 'dist', 'images')}],
        options: {
          concurrency: 100,
        }
      }))

    appConfig.optimization =  { minimizer: [new OptimizeCSSAssetsPlugin({})] }
}

module.exports = [appConfig];
