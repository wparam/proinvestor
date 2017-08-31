var gulp = require('gulp'),
    path = require('path'),
    gulputil = require('gulp-util'),
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint');


gulp.task('default', ['watch', 'appmon']);

gulp.task('jshint', function(){
    return gulp.src('app.js')
        .pipe(jshint({esversion: 6}))
        .pipe(jshint.reporter('jshint-stylish'));
        // .pipe(jshint.reporter('fail'));
});
 
gulp.task('watch', function(){
    gulp.watch('app.js', ['jshint']);
}); 

gulp.task('appmon', function () {
    nodemon({
        script: 'app.js', 
        env: { 'NODE_ENV': 'development' }
    })
})