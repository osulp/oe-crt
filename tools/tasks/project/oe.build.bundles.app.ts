import {join} from 'path';
import * as Builder from 'systemjs-builder';
import {
    BOOTSTRAP_MODULE,
    JS_PROD_APP_BUNDLE,
    JS_DEST,
    //SYSTEM_BUILDER_CONFIG,   
    //SYSTEM_CONFIG_PROD,
    //APP_BASE,
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
  format: 'cjs',
  minify: true,
  mangle: false
};

export = (done: any) => {
    console.log('Temp Dir =' + TMP_DIR);
    console.log('BOOTSTRAP_MODULE =' + BOOTSTRAP_MODULE);
    console.log('JS_DEST =' + join(JS_DEST, JS_PROD_APP_BUNDLE));
    var config = {
        defaultJSExtensions: true,
        paths: {
            [`${this.TMP_DIR}/*`]: `${this.TMP_DIR}/*`,
            'esri-system-js': 'node_modules/esri-system-js/dist/esriSystem.js',
            '/*': '/node_modules/*'
        }
    };
    let builder = new Builder(config);
    builder
        .bundle(join(TMP_DIR, BOOTSTRAP_MODULE),
        join(JS_DEST, JS_PROD_APP_BUNDLE),
        BUNDLER_OPTIONS)
        .then(() => {
            console.log('Bundle built....');
            done();
        })
        .catch((err: any) => {
            console.log('Build bundle error');
            console.log(err);
        });
};
