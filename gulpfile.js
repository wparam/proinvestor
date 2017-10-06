var gulp = require('gulp'),
    path = require('path'),
    gulputil = require('gulp-util'),
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint');

const webpack = require('webpack-stream');
const SRC_DIR = path.resolve(__dirname, 'public');
const WEBPACK_CONFIG = require('./webpack.config');


gulp.task('default', ['webpack', 'watch', 'appmon']);

gulp.task('jshint', function(){
    return gulp.src('app.js')
        .pipe(jshint({esversion: 6}))
        .pipe(jshint.reporter('jshint-stylish'));
        // .pipe(jshint.reporter('fail'));
});

gulp.task('webpack', function(){
    return gulp.src(path.join(SRC_DIR, 'index.js'))
        .pipe(webpack(WEBPACK_CONFIG))
        .pipe(gulp.dest('public/dist/'));
});

gulp.task('clean', function() {
    return gulp.src('public/dist/*').pipe(rm());
});
 
gulp.task('watch', function(){
    gulp.watch('app.js', ['jshint', 'webpack']);
}); 

gulp.task('appmon', function () {
    nodemon({
        script: 'app.js', 
        env: { 'NODE_ENV': 'development' }
    })
});