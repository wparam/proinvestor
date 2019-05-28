var gulp = require('gulp'),
    path = require('path'),
    gulputil = require('gulp-util'),
    nodemon = require('gulp-nodemon'),
    eslint = require('gulp-eslint'),
    livereload = require('gulp-livereload');

const webpack = require('webpack-stream');
const SRC_DIR = path.resolve(__dirname, 'public/src');
const WEBPACK_CONFIG = require('./webpack.config');
const mongoose = require('mongoose');
const gulpclean = require('gulp-clean');
const models = require('./app/models')(mongoose);


const fixture = require('./fixtures')(mongoose, models);
// const ImportManager = require('data_importer');

const ImportManager = require('./modules/data_importer');
const logger = require('logger');
const loadManager = require('loadbalancer');

mongoose.Promise = global.Promise;

livereload();

// ===========================
//
//          Settings
//
// ===========================
const watchFiles = {
    serverViews: ['app/views/**/*.*'],
    serverJS: ['gulpfile.js', 'app.js', 'server.js', 'config/**/*.js', 'app/**/*.js'],
    clientViews: ['public/src/**/*.html'],
    clientJS: ['public/src/**/*.js', 'public/src/**/*.jsx', 'webpack.config.js']
};


// ===========================
//
//       Error Handler
//
// ===========================
function errorHandler(error) {
    if (typeof error === 'object' && error.message) {
        error = error.message;
    }
    logger.error(chalk.red('[gulp] ') + chalk.red(error));
}


// ===========================
//
//       app tasks
//
// ===========================

function hintServer() {
    return gulp.src(watchFiles.serverJS)
        .pipe(eslint({ quiet: true }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};

function clean() {
    return gulp.src('public/dist/*', { read: false })
        .pipe(gulpclean());
};

const compileAlone = gulp.series(clean, function compile(done) {
    try {
        const s = gulp.src(path.join(SRC_DIR, 'index.js'))
            .pipe(webpack(WEBPACK_CONFIG))
            .pipe(gulp.dest('public/dist/'))
            .pipe(livereload({ port: 32052 }));
        s.on('end', () => {
            logger.info('Compile process finished');
            done();
            process.exit(0);
        });
    } catch (error) {
        logger.error('Compile process failed!');
        process.exit(1);
    }
});

const compile = gulp.series(function compile(done) {
    const s = gulp.src(path.join(SRC_DIR, 'index.js'))
        .pipe(webpack(WEBPACK_CONFIG))
        .pipe(gulp.dest('public/dist/'))
        .pipe(livereload({ port: 32052 }));
    s.on('end', () => {
        logger.info('Compile process finished');
        done();
    });
});


function watchServerJs() {
    gulp.watch(watchFiles.serverJS, { ignoreInitial: true }, hintServer);
}

function watchClientJs() {
    livereload.listen({ basePath: 'public/dist' });
    gulp.watch(watchFiles.clientJS, { ignoreInitial: true }, compile);
}

function appmon() {
    return nodemon({
        script: 'server.js',
        watch: watchFiles.serverJS,
        env: { 'NODE_ENV': 'development' }
    });
};

gulp.task('db:data-import', /*['db:load'],*/() => {
    let importerTasks = new ImportManager(mongoose, models);
    // importerTasks.setForceMode = true;
    //TODO: task run paral mode would need more work on task allocation, 1st tier, 2nd tier...
    importerTasks.openConnection().then((msg) => {
        logger.info(msg);
        importerTasks.createTask('basket');
        importerTasks.createTask('m_basket_company', ['basket']);
        importerTasks.createTask('company', ['m_basket_company']);
        // importerTasks.createTask('chart', ['company']);
        return importerTasks.runTasks();
    }).catch((err) => {
        logger.error(err.stack);
    }).then(() => {
        return importerTasks.closeConnection().then((msg) => { logger.info(msg); });
    });
});

//recrate database
function dbLoad(done) {
    return fixture.loadData((err, msg) => {
        if (err) {
            logger.error(err.stack);
            process.exit(1);
            return;
        }
        logger.info(msg);
        done();
        process.exit(0);
    });
};

exports.default = gulp.parallel(watchServerJs, watchClientJs, gulp.series(clean, compile, appmon));
exports.debug = gulp.series(compile, appmon);
exports.dbload = dbLoad;
exports.startup = appmon;
exports.compile = compileAlone;


//#endregion