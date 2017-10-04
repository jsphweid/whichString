const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const AssetsPlugin = require('assets-webpack-plugin')


module.exports = {
    devtool: 'eval',
    entry: {
        client: [
            'react-hot-loader/patch',
            'webpack-dev-server/client?http://localhost:3001',
            'webpack/hot/only-dev-server',
            './src/client/index.tsx',
            './src/client/wsassets/scss/styles.scss'
        ],
        vendor: ['react', 'react-dom']
    },
    target: 'web',
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].js',
        publicPath: 'http://localhost:3001/'
    },

    devServer: {
        host: 'localhost',
        port: 3001,
        historyApiFallback: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        hot: true
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json", ".css", ".scss"],
        modules: [
            path.resolve('./src/index'),
            'node_modules'
        ]
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loaders: ['awesome-typescript-loader']
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader",
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.(jpe?g|gif|png)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]-[hash:6].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: '10000',
                            mimetype: 'application/font-woff',
                            name: '[name]-[hash:6].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]-[hash:6].[ext]'
                        }
                    }
                ]
            }
        ]
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new AssetsPlugin({
            path: path.join(__dirname, 'build'),
            update: true
        }),
        new ExtractTextPlugin({ filename: "[name].[contenthash].css" }),
        new webpack.HotModuleReplacementPlugin()
    ]
}
