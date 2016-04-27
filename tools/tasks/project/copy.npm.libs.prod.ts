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
        'node_modules/rxjs/bundles/Rx.js',
        'node_modules/angular2/bundles/angular2.js',
        'node_modules/angular2/bundles/router.js',
        'node_modules/angular2/bundles/http.js',
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/angular2-highcharts/dist/index.js',
        'node_modules/esri-system-js/dist/esriSystem.js',
        'src/assets/scripts/ags.3.16.init.js'
    ])
        .pipe(gulp.dest('dist/prod/js/lib'));
}

