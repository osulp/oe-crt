import {join} from 'path';
import {SeedConfig, normalizeDependencies} from './seed.config';

export class ProjectConfig extends SeedConfig {
    PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

    constructor() {
        super();
        this.APP_BASE = this.ENV === 'prod' ? '/rural/crt_ng2_test/' : this.APP_BASE;
        this.APP_TITLE = 'Communities Reporter Tool';
        this.PROD_DEST = `${this.DIST_DIR}/prod`;
        this.BOOTSTRAP_MODULE = this.ENABLE_HOT_LOADING ?
            (this.ENV !== 'dev' ? 'hot_loader_main' : `${this.APP_BASE}hot_loader_main`)
            : (this.ENV !== 'dev' ? 'main' : `${this.APP_BASE}main`);
        let additional_deps: any[] = [
            // {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
            // {src: 'lodash/lodash.min.js', inject: 'libs'},
            // JQuery and HighCharts
            { src: 'jquery/dist/jquery', inject: 'libs' },
            //{ src: 'highcharts/highcharts', inject: 'libs' },
            //{ src: 'highcharts/highmaps', inject: 'libs' },
            //{ src: 'highcharts/modules/map', inject: 'libs' },
            //{ src: 'highcharts/modules/data', inject: 'libs' }
        ];
        this.DEV_NPM_DEPENDENCIES = this.DEV_DEPENDENCIES.concat(normalizeDependencies(additional_deps));
        this.PROD_NPM_DEPENDENCIES = this.PROD_NPM_DEPENDENCIES.concat(normalizeDependencies(additional_deps));
        // Declare local files that needs to be injected
        this.APP_ASSETS = [
            { src: `${this.ASSETS_SRC}/css/bootstrapmap.css`, inject: true },
            { src: `${this.ASSETS_SRC}/css/esri.3.15.css`, inject: true },
            { src: `${this.ASSETS_SRC}/main.css`, inject: true },
            { src: `${this.ASSETS_SRC}/scripts/ags.3.15.init.js`, inject: true },
            { src: `${this.ASSETS_SRC}/scripts/oe.js`, inject: true }
        ];

        this.DEV_APP_ASSETS = [
            { src: `${this.ASSETS_SRC}/css/bootstrapmap.css`, inject: true },
            { src: `${this.ASSETS_SRC}/css/esri.3.15.css`, inject: true },
            { src: `${this.ASSETS_SRC}/fonts/font-awesome-4.5.0/css/font-awesome.min.css`, inject: true },
            { src: `${this.ASSETS_SRC}/main.css`, inject: true },
            { src: `${this.ASSETS_SRC}/scripts/ags.3.15.init.js`, inject: true },
            { src: `${this.ASSETS_SRC}/scripts/oe.js`, inject: true }
        ];
        this.PROD_APP_ASSETS = [
            { src: `${this.ASSETS_SRC}/css/oe.css`, inject: true },
            { src: `${this.ASSETS_SRC}/css/bootstrapmap.css`, inject: true },
            { src: `${this.ASSETS_SRC}/css/esri.3.15.css`, inject: true },
            { src: `${this.ASSETS_SRC}/main.css`, inject: true },
            { src: `${this.ASSETS_SRC}/scripts/ags.3.15.init.js`, inject: true },
            { src: `${this.ASSETS_SRC}/scripts/oe.js`, inject: true }
        ];


        this.DEV_DEPENDENCIES = this.DEV_NPM_DEPENDENCIES.concat(this.DEV_APP_ASSETS);
        this.PROD_DEPENDENCIES = this.PROD_NPM_DEPENDENCIES.concat(this.PROD_APP_ASSETS);
    }
}


