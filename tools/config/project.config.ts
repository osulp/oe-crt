import {join} from 'path';
import {SeedConfig} from './seed.config';
import {InjectableDependency} from './seed.config.interfaces';

export class ProjectConfig extends SeedConfig {
    PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

    constructor() {
        super();
        //this.APP_BASE = this.ENV === 'prod' ? '/rural/crt_ng2_test/' : this.APP_BASE;
        this.APP_BASE = '/rural/crt_ng2_test/';
        this.APP_TITLE = 'Communities Reporter Tool';
        this.PROD_DEST = `${this.DIST_DIR}/prod`;
        //this.BOOTSTRAP_MODULE = this.ENABLE_HOT_LOADING ?
        //    (this.ENV !== 'dev' ? 'hot_loader_main' : `${this.APP_BASE}hot_loader_main`)
        //    : (this.ENV !== 'dev' ? 'main' : `${this.APP_BASE}main`);
        //this.ENABLE_HOT_LOADING ? 'hot_loader_main' : 'main';
        //FOR NPM MODULES DEPENDENCIES
        let additional_deps: InjectableDependency[] = [
            { src: 'bootstrap/dist/css/bootstrap.css', inject: true },
            { src: 'jquery/dist/jquery.min.js', inject: 'libs' },
            { src: 'esri-system-js/dist/esriSystem.js', inject: 'libs', env: 'dev' }
        ];

        const seedDependencies = this.NPM_DEPENDENCIES;

        this.NPM_DEPENDENCIES = seedDependencies.concat(additional_deps);
        //// Declare local files that needs to be injected
        this.APP_ASSETS = [
            { src: `${this.ASSETS_SRC}/css/oe.css`, inject: true, env: 'prod' },
            { src: `${this.ASSETS_SRC}/css/bootstrapmap.css`, inject: true, env: 'dev' },
            { src: `${this.ASSETS_SRC}/css/esri.3.15.css`, inject: true },
            { src: `${this.ASSETS_SRC}/fonts/font-awesome-4.5.0/css/font-awesome.min.css`, inject: true, env: 'dev' },
            { src: `${this.ASSETS_SRC}/main.css`, inject: true },
            { src: `${this.ASSETS_SRC}/scripts/ags.3.16.init.js`, inject: true },
            { src: `${this.ASSETS_SRC}/scripts/oe.js`, inject: true }
        ];

        /////For non-root based application need to reassert the locations based on updated APP_BASE
        this.SYSTEM_CONFIG.packageConfigPaths = [`${this.APP_BASE}node_modules/*/package.json`];
        this.SYSTEM_CONFIG.paths['angular2/*'] = `${this.APP_BASE}angular2/*`;
        this.SYSTEM_CONFIG.paths['rxjs/*'] = `${this.APP_BASE}rxjs/*`;
        this.SYSTEM_CONFIG.paths['esri*'] = `${this.APP_BASE}node_modules/esri-system-js/dist/esriSystem.js`;
        this.SYSTEM_CONFIG.paths['*'] = `${this.APP_BASE}node_modules/*`;
        //this.SYSTEM_CONFIG.map['text'] = `${this.APP_BASE}${this.APP_DEST}/assets/scripts/plugins/systemjsTextPlugin.js`;
        //this.SYSTEM_BUILDER_CONFIG.map['esriSystem'] = `node_modules/esri-system-js/dist/esriSystem.js`;
        //this.SYSTEM_BUILDER_CONFIG.paths['esri*'] = `node_modules/esri-system-js/dist/esriSystem.js`;
    }
}



