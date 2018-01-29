/**
 * Created by karl.zheng on 2018/1/16.
 */
var path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractCSS = new ExtractTextPlugin('[name].[contenthash:8].css');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports =
    {
        entry: {
            index:'./entry.js',
        },
        output: {
            filename: '[name].[hash:8].js',
            path: path.resolve(__dirname, './dist/'),
            // publicPath: 'http://绝对地址/'
        },
        module: {
            loaders: [
                {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: [{
                        loader: 'babel-loader'
                     }]
                },
                {
                    test: /\.css$/,
                    loader: extractCSS.extract({
                        fallback: "style-loader",
                        use: [
                            {
                                loader: "css-loader",
                                options:{
                                    minimize: true, //css压缩
                                }
                            },
                            'px2rem-loader?remUnit=100&remPrecision=8&base=50&scale=2&minSize=1&ignore=border|margin|padding',
                            'postcss-loader'
                        ]
                    }),
                },
                {
                    test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                    loader: 'file-loader?name=img/[name].[hash:8].[ext]'
                }
            ]
        },
        externals: {
            jquery: 'window.$'
        },
        plugins: [
            extractCSS,

            new HtmlWebpackPlugin({
                template: 'html-withimg-loader!./index.html',
                filename: 'index.html'
            }),

            new webpack.optimize.UglifyJsPlugin({ // js、css都会压缩
                mangle: {
                    except: ['$super', '$', 'exports', 'require', 'module', '_', '*.swf']
                },
                compress: {
                    warnings: false
                },
                output: {
                    comments: false
                }
            }),
            new webpack.LoaderOptionsPlugin({
                options: {
                    postcss: function(){
                        return [
                            require("autoprefixer")({
                                browsers: ['ie>=8','>1% in CN']
                            })
                        ]
                    }
                }
            })
        ]
    }
