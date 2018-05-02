const gulp = require('gulp')
const sass = require('gulp-sass');
//base
const autoprefixer = require('gulp-autoprefixer');//css添加前缀
const babel = require('gulp-babel');//es6 转 es5
const fileinclude = require('gulp-file-include');//html模块引入

//dev
const webServer = require('gulp-webserver');//本地服务
const livereload = require('gulp-livereload');//实时更新
const changed = require('gulp-changed');// 只操作有过修改的文件

//prod
const cssmin = require('gulp-cssmin');//css压缩
const rename = require('gulp-rename');//重命名
const uglify = require("gulp-uglify");//js压缩
const htmlminify = require('gulp-html-minify');//html压缩
const imagemin = require('gulp-imagemin');//图片压缩




/*
剩余处理：
1.html引用重命名。
2.特定文件夹合并文件

*/

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
                .pipe(babel())
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
            gulp.src('./src/img/*.{jpg,png,gif,ico}')
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
                .pipe(rename({ suffix: '.min' }))
                .pipe(gulp.dest('./dist'));
        },
        html: function () {
            return gulp.src('./src/**/*.html')
                .pipe(fileinclude({
                    prefix: '@@',
                    basepath: './src/include/'
                }))
                .pipe(htmlminify())
                .pipe(gulp.dest('./dist'))
        },
        jsbabel: function () {
            return gulp.src('./src/**/*.js')
                .pipe(babel())
                .pipe(uglify())
                .pipe(rename({ suffix: '.min' }))
                .pipe(gulp.dest('./dist'))
        }
    }
};

const mode = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';

config = config[mode];


let tasks = Object.keys(config);
for (let taskName of tasks) {
    gulp.task(taskName, config[taskName]);
}

gulp.task(mode, tasks);

gulp.task('del', function () {
    del('./dist');
});

//gulp.task('default', ['dev']);
