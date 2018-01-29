# webpack
单个活动页开发webpack框架，含px转rem及雪碧图生成

首先下载demo，打开目录到demo目录中
 
```js
  npm install 安装配置环境
```
 
 其中,
 
 `html-webpack-plugin` 插件用于生成新的html，生成的css和js链接会自动添加到html头部和尾部
 
 `html-withimg-loader` 插件主要作用于html中的img链接，避免出现找不到图片的问题
 
 `autoprefixer`及`postcss-loader` 用于自动补全css前缀（需添加postcss.config.js文件）
 
 例如：
 
```js
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
```

`extract-text-webpack-plugin` 插件用于压缩提取css，将css合并为一个css文件

`webpack-spritesmith` 插件用于生成雪碧图

`px2rem-loader` 用于将css转为rem

#### 雪碧图

通常，我习惯于将小图片放到目录spr/icons中，然后配置webpack.spr.config.js的配置，
```js
//图片来源
 src: {
                cwd: path.resolve(__dirname, './spr/icons'),
                glob: '*.{png,gif,jpg}'
       },
//生成配置
target: {
            image: path.resolve(__dirname, './spr/sprite-icons.png'), //生成图片名字及位置
            css: [
                [
                    path.resolve(__dirname, './spr/sprite-icons.css'),//生成css文件名字及位置
                    {
                        format: 'function_sprite-icon' //对应配置函数
                    }
                ]
            ]
        },
//css中图片的引用路径
 apiOptions: {
                cssImageRef: "./sprite-icons.png"
            },

//图片间的距离
spritesmithOptions:{
                   padding: 20
               },
//配置函数
customTemplates: {
                'function_sprite-icon': function (data) {
                    return data.sprites.map(function (sprite) {
                        return `.N { width: Wpx; height: Hpx; background-image: url(I); 
                        background-position: Xpx Ypx; 
                        background-size: T_Wpx, T_Hpx; background-repeat: no-repeat;}`
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
````


指令 `webpack --config webpack.spr.config.js` 生雪碧图

或将指令配置到`package.json`中，指令`npm run spr` 生成雪碧图

雪碧图可以减少页面请求次数，记得生成的雪碧图仍然要再放到压缩软件中压缩

#### px转rem

只需要在`extract-text-webpack-plugin`提取css时配置好

     `px2rem-loader?remUnit=100&remPrecision=8&base=50&scale=2&minSize=1&ignore=border|margin|padding`
    
即可

#### 自动补全 `postcss-loader`
   
   同样需要配置 `postcss-loader` 同时添加postcss.config.js文件
   
 ```js
   module.exports = {
    plugins: {
        'autoprefixer': {browsers: 'last 5 version'}  //满足最新的五个版本
   }
  }
 ```

webpack中配置plugins

 ```js   
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
```



