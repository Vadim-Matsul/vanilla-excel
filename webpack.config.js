const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

const filename = (ext) => isProd ? `bundle.[hash].${ext}` : `bundle.${ext}`;

const jsLoaders = () => {
    const out = [
        {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env'],
            },
        },
    ];

    if (isDev) out.push('eslint-loader');

    return out;
};

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: './index.js',
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            minify: {
                removeComments: isProd,
                collapseWhitespace: isProd,
            },
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './excel.ico',
                    to: path.resolve(__dirname, 'dist'),
                },
            ],
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: filename('css'),
        }),
    ],
    module: {
        rules: [
            {
                test: /.s[a|c]ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /.js$/,
                exclude: /node_modules/,
                use: jsLoaders(),
            },
        ],
    },
    devtool: isDev ? 'source-map' : false,
    devServer: {
        port: 3000,
        hot: isDev,
    },
};
