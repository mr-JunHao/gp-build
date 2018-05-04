# gp-build

## 目录结构
 - dist
 - src
   - css
   - img
   - js
   - include
   - index.html

**dist**
打包文件

**src**
开发文件
##### css：支持scss转css。(less、postcss需要可以另加)
##### js：支持es6转es5。(暂时不支持一些promise、Object.assign转换，后续研究gulp添加babel-polyfill实现支持)
##### include：支持html模板化（https://www.npmjs.com/package/gulp-file-include）。

## 使用
下载然后安装所有依赖包
```js
npm install
```
打开本地服务
```js
npm run dev
```
默认本服务：http://127.0.0.1:3000
支持设为本机ip，局域网内远程访问。
支持反向代理设置
source:请求的路径
target: 映射到的路径
```js
webServer({
  proxies: {
    source: '/abc',//请求
    target: 'http://localhost:8080/abc',
    options: {
      headers: {
        'ABC_HEADER': 'abc'
      }
    }
  }
})
```

打包
```js
npm run build
```
打包会对html、css、js、img进行压缩处理。

## 后续优化
~~- js、css文件合并~~
- img雪碧图合并
- img对小图片进行base64转换
~~- 配置本地服务反向代理~~




