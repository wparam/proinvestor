var gulp = require('gulp'),
    path = require('path'),
    gulputil = require('gulp-util'),
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint');

const webpack = require('webpack-stream');
const SRC_DIR = path.resolve(__dirname, 'public/src');
const WEBPACK_CONFIG = require('./webpack.config');
const clean = require('gulp-clean');

// ===========================
//
//          Settings
//
// ===========================
const watchFiles = {
        serverViews: ['app/views/**/*.*'],
        serverJS: ['gulpfile.js', 'app.js', 'config/**/*.js', 'app/**/*.js' ],
        clientViews: ['public/src/**/*.html'],
        clientJS: ['public/src/**/*.js', 'webpack.config.js']
    };


// ===========================
//
//       Error Handler
//
// ===========================
function errorHandler( error ) {
    if( typeof error === 'object' && error.message ) {
        error = error.message;
    }
    console.error( chalk.red( '[gulp] ' ) + chalk.red( error ) );
}

// ===========================
//
//       tasks
//
// ===========================

gulp.task('default',  ['compile', 'watch', 'appmon']);

gulp.task('jshint:server', function(p){
    return gulp.src(watchFiles.serverJS)
        .pipe(jshint({esversion: 6}))
        .pipe(jshint.reporter('jshint-stylish'));
        // .pipe(jshint.reporter('fail'));
});

gulp.task('jshint:client', function(p){
    return gulp.src(watchFiles.clientJS)
        .pipe(jshint({esversion: 6}))
        .pipe(jshint.reporter('jshint-stylish'));
        // .pipe(jshint.reporter('fail'));
});

gulp.task('compile',['clean'], function(){
    return gulp.src(path.join(SRC_DIR, 'index.js'))
        .pipe(webpack(WEBPACK_CONFIG))
        .pipe(gulp.dest('public/dist/'));
});

gulp.task('clean', function() {
    return gulp.src('public/dist/*', {read: false})
		.pipe(clean());
});
 
gulp.task('watch', function(){ 
    gulp.watch(watchFiles.serverJS, ['jshint:server']);
    gulp.watch(watchFiles.clientJS, ['jshint:client', 'compile']);
}); 

gulp.task('appmon', function () {
    nodemon({
        script: 'app.js', 
        watch: watchFiles.serverJS,
        env: { 'NODE_ENV': 'development' }
    });
});