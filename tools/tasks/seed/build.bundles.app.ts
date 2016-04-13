import {join} from 'path';
import * as Builder from 'systemjs-builder';
import {
    BOOTSTRAP_MODULE,
    JS_PROD_APP_BUNDLE,
    JS_DEST,
    SYSTEM_BUILDER_CONFIG,
    TMP_DIR
} from '../../config';


//BOOTSTRAP_MODULE, = app base + /main - production sets this in project.config.ts /rural/crt_ng2_test/main
//JS_PROD_APP_BUNDLE = app.js
//JS_DEST = dist/prod/js
//SYSTEM_BUILDER_CONFIG, =
//      {
//        defaultJSExtensions: true,
//        paths: {
//            [`${this.TMP_DIR}/*`]: `${this.TMP_DIR}/*`,
//            '*': 'node_modules/*'
//        }
//    };
//TMP_DIR = dist/tmp

const BUNDLER_OPTIONS = {
  format: 'amd',
  minify: true,
  mangle: false
};

export = (done: any) => {
    let builder = new Builder(SYSTEM_BUILDER_CONFIG);
    builder
        .buildStatic(join(TMP_DIR, BOOTSTRAP_MODULE),
        join(JS_DEST, JS_PROD_APP_BUNDLE),
        BUNDLER_OPTIONS)
        .then(() => done());
};
