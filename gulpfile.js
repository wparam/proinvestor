var gulp = require('gulp'),
    path = require('path'),
    gulputil = require('gulp-util'),
    nodemon = require('gulp-nodemon'),
    eslint = require('gulp-eslint');

const webpack = require('webpack-stream');
const SRC_DIR = path.resolve(__dirname, 'public/src');
const WEBPACK_CONFIG = require('./webpack.config');
const clean = require('gulp-clean');
const mongoose = require('mongoose');
const models = require('./app/models')(mongoose);

const fixture = require('./fixtures')(mongoose, models);
// const ImportManager = require('data_importer');

const ImportManager = require('./modules/data_importer');
const logger = require('logger');

mongoose.Promise = global.Promise;

// ===========================
//
//          Settings
//
// ===========================
const watchFiles = {
        serverViews: ['app/views/**/*.*'],
        serverJS: ['gulpfile.js', 'app.js', 'config/**/*.js', 'app/**/*.js' ],
        clientViews: ['public/src/**/*.html'],
        clientJS: ['public/src/**/*.js','public/src/**/*.jsx', 'webpack.config.js']
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
    logger.error( chalk.red( '[gulp] ' ) + chalk.red( error ) );
}


// ===========================
//
//       app tasks
//
// ===========================
// #region app tasks
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
        .pipe(eslint.failAfterError());
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

//#endregion

//#region db related tasks
gulp.task('db:load', ()=>{
    return fixture.loadData((err, msg)=>{
        if(err){
            logger.error(err.stack);
            return;
        }
        logger.info(msg);
    });
});

gulp.task('db:data-import', /*['db:load'],*/ ()=>{
    let importerTasks = new ImportManager(mongoose);
    let importers = ImportManager.getImporters();
    importerTasks.openConnection().then( (msg) => {
        logger.info(msg);
        importerTasks.createTask('basket', new importers['basket'](models['basket']));
        // importerTasks.createTask('company', new importers['company']());
        return importerTasks.runTasks();
    }).catch((err) => {
        logger.error(err.stack);
    }).then(()=>{
        return importerTasks.closeConnection().then((msg)=>{logger.info(msg);});
    });
    
    
});
//#endregion