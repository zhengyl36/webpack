/**
 * Created by karl.zheng on 2017/11/13.
 */
var path = require('path');

var SpritesmithPlugin = require('webpack-spritesmith');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractCSS = new ExtractTextPlugin('[name].css');

module.exports = {
    entry: {
        index: './sprite.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist/')
    },
    module: {
        loaders:
            [{
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
                    use: "css-loader"
                })
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'file-loader?name=img/[name].[ext]'
            }]
    },
    plugins: [
        new SpritesmithPlugin({
            src: {
                cwd: path.resolve(__dirname, './spr/icons'),
                glob: '*.{png,gif,jpg}'
            },
            target: {
                image: path.resolve(__dirname, './spr/sprite-icons.png'),
                css: [
                    [
                        path.resolve(__dirname, './spr/sprite-icons.css'),
                        {
                            format: 'function_sprite-icon'
                        }
                    ]
                ]
            },
            apiOptions: {
                cssImageRef: "./sprite-icons.png"
            },
            spritesmithOptions:{
                padding: 20
            },
            customTemplates: {
                'function_sprite-icon': function (data) {
                    return data.sprites.map(function (sprite) {
                        return `.N { width: Wpx; height: Hpx; background-image: url(I); background-position: Xpx Ypx; background-size: T_Wpx, T_Hpx; background-repeat: no-repeat;}`
                            .replace('I', sprite.image)
                            .replace('N', sprite.name)
                            .replace('W', sprite.width)
                            .replace('H', sprite.height)
                            .replace('X', sprite.offset_x)
                            .replace('Y', sprite.offset_y)
                            .replace('T_W', sprite.total_width)
                            .replace('T_H', sprite.total_height);
                    }).join('\n');
                }
            },
        }),
        extractCSS
    ]
};