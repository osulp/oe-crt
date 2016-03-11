import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins'; import {join} from 'path';
import {APP_SRC} from '../../config';
const plugins = <any>gulpLoadPlugins();

export = () => {
    let src = [
        join(APP_SRC, 'assets/css/oe.less')
    ];
    return gulp.src(src)
        .pipe(plugins.less({
            compress: process.env.NODE_ENV === 'development' ? false : true
        }))
        .pipe(gulp.dest(join(APP_SRC, 'assets/css')));
}

