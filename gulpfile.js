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
const rev = require('gulp-rev'); //文件添加md5时间戳
const revCollector = require('gulp-rev-collector'); //根据gulp-rev生成的json替换html的文件
const runSequence = require('run-sequence'); //同步处理插件
const useref = require('gulp-useref');//合并文件

let config = {
  dev: {
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
          port: 3000
        }))
    }
  },
  prod: {
    img: function () {
      return gulp.src('./src/img/*.{jpg,png,gif,ico}')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img'))
    },
    sass: function () {
      return gulp.src('./src/**/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer({
          browsers: ["> 1%", "last 2 versions", "not ie <= 8"]
        }))
        .pipe(cssmin())
        .pipe(rev())
        .pipe(gulp.dest('./dist'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./src/rev/css'));
    },
    jsbabel: function () {
      return gulp.src('./src/**/*.js')
        .pipe(babel())
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('./dist'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./src/rev/js'));
    },
    html: function () {
      return gulp.src(['./src/rev/**/*.json', './src/**/*.html'])
        .pipe(useref())
        .pipe(fileinclude({
          prefix: '@@',
          basepath: './src/include/'
        }))
        .pipe(revCollector({
          replaceReved: true
        }))
        .pipe(htmlminify())
        .pipe(gulp.dest('./dist'))
    }
  }
};

const mode = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';

config = config[mode];


let tasks = Object.keys(config);
tasks.map((taskName, index) => {
  gulp.task(taskName, config[taskName]);
})
if (mode === 'prod') {
  //打包同步处理任务
  gulp.task(mode, function () {
    runSequence(...tasks);
  });
} else {
  //开发异步（默认）处理
  gulp.task(mode, tasks);
}
