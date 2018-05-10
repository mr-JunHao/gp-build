const gulp = require('gulp')

//base
const sass = require('gulp-sass'); //sass预处理器
const autoprefixer = require('gulp-autoprefixer'); //css添加前缀
const babel = require('gulp-babel'); //es6 转 es5
const fileinclude = require('gulp-file-include'); //html模块引入

//dev
const webServer = require('gulp-webserver'); //本地服务
const livereload = require('gulp-livereload'); //实时更新
const changed = require('gulp-changed'); // 只操作有过修改的文件

//prod
const cssmin = require('gulp-cssmin'); //css压缩
const uglify = require("gulp-uglify"); //js压缩
const htmlminify = require('gulp-html-minify'); //html压缩
const imagemin = require('gulp-imagemin'); //图片压缩
const runSequence = require('run-sequence'); //同步处理插件
const useref = require('gulp-useref'); //合并文件
const RevAll = require('gulp-rev-all');
const filter = require('gulp-filter');


let config = {
  dev: {
    css: function () {
      return gulp.src('./src/**/*.css')
        .pipe(autoprefixer({
          browsers: ["> 1%", "last 2 versions", "not ie <= 8"]
        }))
        .pipe(gulp.dest('./dist'))
    },
    sass: function () {
      return gulp.src('./src/**/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer({
          browsers: ["> 1%", "last 2 versions", "not ie <= 8"]
        }))
        .pipe(gulp.dest('./dist'))
    },
    html: function () {
      return gulp.src('./src/**/*.html')
        .pipe(fileinclude({
          prefix: '@@',
          basepath: './src/include/'
        }))
        .pipe(changed('./dist'))
        .pipe(gulp.dest('./dist'))
    },
    jsbabel: function () {
      return gulp.src('./src/**/*.js')
        // .pipe(babel())
        .pipe(gulp.dest('./dist'))
    },
    watch: function () {
      //监听 sass
      gulp.watch('./src/**/*.scss', ['sass']);
      //箭头js
      gulp.watch('./src/**/*.js', ['jsbabel']);
      // 监听 html
      gulp.watch('./src/*.html', ['html']);
    },
    webserver: function () {
      gulp.src('./dist/')
        .pipe(webServer({
          livereload: true,
          path: '/',
          port: 3000,
          host: '0.0.0.0',
          proxies: {
            source: '/abc',
            target: 'http://localhost:8080/abc',
            options: {
              headers: {
                'ABC_HEADER': 'abc'
              }
            }
          }
        }))
    }
  },
  prod: {
    img: function(){
      gulp
          .src('./src/**/*.{jpg,png,gif,ico}')
          .pipe(imagemin())
          .pipe(gulp.dest('dist'));
    },
    taskAll: function(){
      let jsFilter = filter('**/*.js',{restore: true}),
          cssFilter = filter('**/*.css',{restore: true}),
          scssFilter = filter('**/*.scss',{restore: true}),
          htmlFilter = filter(['**/*.html'],{restore: true});

    return gulp.src(['./src/**/*','!./src/**/*.{jpg,png,gif,ico}','./src/**/*.html'])
          .pipe(scssFilter)
          .pipe(sass.sync().on('error', sass.logError))
          .pipe(gulp.dest('./src'))
          .pipe(scssFilter.restore)
          .pipe(useref())
          .pipe(jsFilter)
          .pipe(babel())
          .pipe(uglify())
          .pipe(jsFilter.restore)
          .pipe(cssFilter)
          .pipe(autoprefixer({
            browsers: ["> 2%", "last 2 versions", "not ie <= 8"]
          }))
          .pipe(cssmin())
          .pipe(cssFilter.restore)
          .pipe(RevAll.revision({                 // 生成版本号
            dontRenameFile: ['.html','.jpg','.png','.gif','.ico'],          // 不给 html 文件添加版本号
            dontUpdateReference: ['.html','.jpg','.png','.gif','.ico']      // 不给文件里链接的html加版本号
          }))
          .pipe(htmlFilter)
          .pipe(fileinclude({
            prefix: '@@',
            basepath: './src/include/'
          }))
          .pipe(htmlminify())
          .pipe(htmlFilter.restore)
          .pipe(gulp.dest('dist'))

    }
  }
};

const mode = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';

config = config[mode];


let tasks = Object.keys(config);
tasks.map((taskName, index) => {
  gulp.task(taskName, config[taskName]);
})
gulp.task(mode, tasks);
// if (mode === 'prod') {
//   //打包同步处理任务
//   gulp.task(mode, function () {
//     runSequence(...tasks);
//   });
// } else {
//   //开发异步（默认）处理
  
// }
