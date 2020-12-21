# data-etl-frontend

> create vue project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

PS:
    1.全局先安装NODE.JS环境,访问中文网下载对应应用:http://nodejs.cn/download/,并配置环境变量
    2.全局安装淘宝镜像:npm install -g cnpm –registry=https://registry.npm.taobao.org,
        如果公司有自己搭建的仓库就可以注册自己公司的
    3.全局安装vue-cli:npm install --global vue-cli
    4.需要先本地下载创建一个vue项目:vue init webpack vue-project
        按照提示操作就可以
    5.安裝依赖:npm install
    6.安装Vue: npm i element-ui -S
    7.导入依赖: main.js文件中 
      import ElementUI from 'element-ui' //element-ui的全部组件
      import 'element-ui/lib/theme-chalk/index.css'
      Vue.use(ElementUI) //使用elementUI
    8.本地环境启动:npm run dev
      生产环境启动:npm run build
        本地启动会遇到一些依赖没有安装的报错,执行npm install --save xxx就可以
        
