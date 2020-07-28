const webpack = require("webpack")
const path = require("path")
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const dev = process.env.NODE_ENV === 'dev'

module.exports = 
{
    mode: dev? "development" : "production",
    context: path.resolve(__dirname, "."),
    entry: "./index.js",
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
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin( { template: 'index.html' } ),
        new TerserPlugin
            ({
                parallel: true,
                sourceMap: false,
                terserOptions: 
                {
                    ecma: 6,
                }
            })
    ]
};
