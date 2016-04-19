import * as gulp from 'gulp';
//import {clean} from '../../utils';
//import * as gulpLoadPlugins from 'gulp-load-plugins';
//import {join} from 'path';
//const plugins = <any>gulpLoadPlugins();
//import {APP_SRC, APP_DEST} from '../../config';

/**
 * Copies npm dependencies to prod/dist/lib folder
 *
 */
// copy dependencies
export = () => {

    console.log('copying files to prod');
    return gulp.src([
        'node_modules/systemjs/dist/system-polyfills.src.js',
        'node_modules/reflect-metadata/Reflect.js',
        'node_modules/zone.js/dist/zone.js',
        'node_modules/es6-shim/es6-shim.js',
        'node_modules/systemjs/dist/system.src.js'
    ])
        .pipe(gulp.dest('dist/prod/lib'));
}

