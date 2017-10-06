const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const StartServerPlugin = require('start-server-webpack-plugin')
const path = require('path')
const buildPath = path.resolve(__dirname, 'build')
const srcPath = path.resolve(__dirname, 'src')

module.exports = {
    context: srcPath,
    entry: [
        'webpack/hot/poll?1000',
        './server/index.ts'
    ],
    watch: true,
    target: 'node',
    output: {
        path: buildPath,
        filename: 'server.js'
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    node: {
        __dirname: false,
        __filename: false
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loaders: ['awesome-typescript-loader']
            },
            { test:  /\.json$/, loader: 'json-loader' }
        ]
    },
    externals: nodeExternals({
        whitelist: ['webpack/hot/poll?1000']
    }),
    devtool: 'source-map',
    plugins: [
        new StartServerPlugin('server.js'),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development'),
                'BUILD_TARGET': JSON.stringify('server'),
                'PROMOTION_LEVEL': JSON.stringify('LOCAL')
            }
        })
    ]
}
