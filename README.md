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
##### js: 支持es6转es5。(暂时不支持一些promise、Object.assign转换，后续研究gulp添加babel-polyfill实现支持)
##### include: 支持html模板化（https://www.npmjs.com/package/gulp-file-include）。

## 使用
下载然后安装所有依赖包
```js
npm install
```
打开本地服务
```js
npm run dev
```

打包
```js
npm run build
```
打包会对html、css、js、img进行压缩处理。

## 后续优化
- js、css文件合并
- img雪碧图合并
- img对小图片进行base64转换
- 配置本地服务反向代理




