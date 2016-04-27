import {join} from 'path';
import * as Builder from 'systemjs-builder';
import {
BOOTSTRAP_MODULE,
JS_PROD_APP_BUNDLE,
JS_DEST,
SYSTEM_BUILDER_CONFIG,
TMP_DIR
} from '../../config';

const BUNDLER_OPTIONS = {
    format: 'cjs',
    minify: true,
    mangle: false
};

export = (done: any) => {
    console.log('Temp Dir =' + TMP_DIR);
    console.log('BOOTSTRAP_MODULE =' + BOOTSTRAP_MODULE);
    console.log('JS_DEST =' + join(JS_DEST, JS_PROD_APP_BUNDLE));

    let builder = new Builder(SYSTEM_BUILDER_CONFIG);
    builder
        .bundle(join(TMP_DIR, BOOTSTRAP_MODULE),
        join(JS_DEST, JS_PROD_APP_BUNDLE),
        BUNDLER_OPTIONS)
        .then(() => done());
};
