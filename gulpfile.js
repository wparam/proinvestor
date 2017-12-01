var gulp = require('gulp'),
    path = require('path'),
    gulputil = require('gulp-util'),
    nodemon = require('gulp-nodemon'),
    eslint = require('gulp-eslint');

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

gulp.task('hint:server', function(p){
    return gulp.src(watchFiles.serverJS)
        .pipe(eslint({quiet:true}))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('hint:client', () => {
    return gulp.src(watchFiles.clientJS)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.result(function(result) {
            console.log(result);
            // Fail on the first file containing errors or warnings.
            if (result.warningCount > 0 || result.errorCount > 0) {
                // While anything can be thrown to fail the stream,
                // the following properties will influence the resulting Gulp message.
                throw {
                    plugin: 'CustomPluginName',
                    name: 'CustomErrorType',
                    fileName: result.filePath,
                    message: error.message,
                    lineNumber: error.line,
                    showStack: false
                };
            }
        }));
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
    gulp.watch(watchFiles.serverJS, ['hint:server']);
    gulp.watch(watchFiles.clientJS, ['hint:client', 'compile']);
}); 

gulp.task('appmon', function () {
    nodemon({
        script: 'app.js', 
        watch: watchFiles.serverJS,
        env: { 'NODE_ENV': 'development' }
    });
});