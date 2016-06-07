import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins'; import {join} from 'path';
import {CSS_SRC} from '../../config';
const plugins = <any>gulpLoadPlugins();

export = () => {
    let src = [
        join(CSS_SRC, 'oe.less')
    ];
    return gulp.src(src)
        .pipe(plugins.less({
            compress: process.env.NODE_ENV === 'development' ? false : true
        }))
        .pipe(gulp.dest(join(CSS_SRC, '')));
};

