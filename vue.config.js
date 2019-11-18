const path = require('path');

module.exports = {
    baseUrl: process.env.NODE_ENV === "production" ? "./" : "/",
    outputDir: "dist",
    assetsDir: "assets",
    runtimeCompiler: true,
    lintOnSave: false,
    productionSourceMap: false,
    filenameHashing: false,
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
            config.mode = 'production';
        } else {
            // 为开发环境修改配置...
            config.mode = 'development';
        }

        Object.assign(config, {
            // 开发生产共同配置
            resolve: {
                alias: {
                    '@': path.resolve(__dirname, './src'),
                    '@c': path.resolve(__dirname, './src/components')
                }
            }
        });
    },
    runtimeCompiler: false,
    productionSourceMap: true,
    crossorigin:undefined,
    css:{
        modules:false,
        extract:true,
        sourceMap:false,
        loaderOptions:{
            css: {
            // options here will be passed to css-loader
            },
            postcss: {
            // options here will be passed to postcss-loader
            }
        }
    },
    devServer: {
        host: "localhost",
        port: 8080, // 端口号
        https: false, // https:{type:Boolean}
        open: false, //配置自动启动浏览器
        //proxy: 'url' // 配置跨域处理,只有一个代理
     
        // 配置多个代理
        proxy: {
            "/": {
                // target: "http://134.175.150.60:9527",//目标主机
                 target: "http://127.0.0.1:9527",//目标主机 
                ws: false,//代理的WebSockets  
                changeOrigin: true,//需要虚拟主机站点 
                pathRewrite: {
                    '^/': '/' 
                }
            }
            // "/api": {
            //     target: "http://192.168.103.160:9527",//目标主机 
            //     ws: false,//代理的WebSockets  
            //     changeOrigin: true,//需要虚拟主机站点 
            //     pathRewrite: {
            //         '^/api': '/' 
            //     }
            // }
        }
    }
}






