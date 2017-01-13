import 'babel-polyfill';

import BUILD_CONFIG from './config/buildConfig';

import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';

import del from 'del';
import { Instrumenter } from 'isparta';

/*******************************************************************************
 * Contants
 ******************************************************************************/

// Tasks (prefixes and types)
const BUILD = 'build:';
const CLEAN = 'clean:';
const INSTRUMENT = 'instrument:';
const LINT = 'lint:';
const RUN = 'run:';
const TEST = 'test:';

const ALL = 'all';
const GULPFILE = 'gulpfile';
const SCRIPTS = 'scripts';

// Gulp + Plugins, etc.
const $ = loadPlugins();
const envCheck = process.env.NODE_ENV === 'production';

/*******************************************************************************
 * Lint method(s)
 ******************************************************************************/
function lintJS(src, cacheKey) {
    return gulp.src(src)
        .pipe($.cached(cacheKey))
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.if(envCheck, $.eslint.failOnError()))
        .pipe($.remember(cacheKey));
}

/*******************************************************************************
 * Test method(s)
 ******************************************************************************/
function instrumentScripts() {
    return gulp.src(BUILD_CONFIG.SRC_SCRIPTS)
        .pipe($.istanbul({
          ...BUILD_CONFIG.ISTANBUL.INIT,
          instrumenter: Instrumenter
        }))
        .pipe($.istanbul.hookRequire());
}

function testScripts() {
    return gulp.src(BUILD_CONFIG.TST_UNIT)
        .pipe($.babel())
        .pipe($.mocha(BUILD_CONFIG.MOCHA))
        .pipe($.istanbul.writeReports(BUILD_CONFIG.ISTANBUL.WRITE))
        .on('error', () => $.util.log('unit tests failed...'));
}

/*******************************************************************************
 * Build method(s)
 ******************************************************************************/
function buildScripts() {
    return gulp.src(BUILD_CONFIG.SRC_SCRIPTS)
        .pipe($.changed(BUILD_CONFIG.OUTPUT_SCRIPTS))
        .pipe($.if(!envCheck, $.sourcemaps.init()))
        .pipe($.babel(BUILD_CONFIG.BABEL))
        .pipe($.uglify())
        .pipe($.if(!envCheck, $.sourcemaps.write('maps')))
        .pipe(gulp.dest(BUILD_CONFIG.OUTPUT_SCRIPTS));
}

/*******************************************************************************
 * Runner(s)
 ******************************************************************************/
function runClean() {
    return del(BUILD_CONFIG.OUTPUT_DEL);
}

function runWatch() {
    gulp.watch(BUILD_CONFIG.SRC_GULPFILE, [`${LINT}${GULPFILE}`]);
    gulp.watch(BUILD_CONFIG.SRC_SCRIPTS, [`${RUN}${SCRIPTS}`]);
    gulp.watch(BUILD_CONFIG.TST_UNIT, [`${TEST}${SCRIPTS}`]);
}

/*******************************************************************************
 * Tasks
 ******************************************************************************/

// main task runners
gulp.task('default', [
    `${LINT}${GULPFILE}`,
    `${RUN}${SCRIPTS}`
], runWatch);

// main task runners
gulp.task(`${RUN}${CLEAN}${ALL}`, runClean);
gulp.task(`${RUN}${SCRIPTS}`, [
    `${LINT}${SCRIPTS}`,
    `${INSTRUMENT}${SCRIPTS}`,
    `${TEST}${SCRIPTS}`,
    `${BUILD}${SCRIPTS}`
]);

// lint-specific tasks
gulp.task(`${LINT}${GULPFILE}`, lintJS.bind(null, BUILD_CONFIG.SRC_GULPFILE, GULPFILE));
gulp.task(`${LINT}${SCRIPTS}`, lintJS.bind(null, BUILD_CONFIG.SRC_SCRIPTS, SCRIPTS));

// test-specific tasks
gulp.task(`${INSTRUMENT}${SCRIPTS}`, [`${LINT}${SCRIPTS}`], instrumentScripts);
gulp.task(`${TEST}${SCRIPTS}`, [`${INSTRUMENT}${SCRIPTS}`], testScripts);

// build-specific tasks
gulp.task(`${BUILD}${SCRIPTS}`, [`${TEST}${SCRIPTS}`], buildScripts);
