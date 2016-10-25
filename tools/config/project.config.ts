import { join } from 'path';

import { SeedConfig } from './seed.config';
import { InjectableDependency } from './seed.config.interfaces';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

    PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

    constructor() {
        super();
        this.PORT = '5556';
        this.APP_TITLE = 'Community Reporter Tool';
        this.APP_BASE = this.ENV === 'prod' ? '/rural/crt_dev/' : '/';
        let additional_deps: InjectableDependency[] = [
            { src: `bootstrap/dist/css/bootstrap.${this.getInjectableStyleExtension()}`, inject: true, env: 'dev' }
            ,{ src: `bootstrap/dist/js/bootstrap.js`, inject: true  }
        ];

        const seedDependencies = this.NPM_DEPENDENCIES;

        this.NPM_DEPENDENCIES = seedDependencies.concat(additional_deps);

        let additional_app_assets: InjectableDependency[] = [
            { src: `${this.CSS_SRC}/oe.less.import.${this.getInjectableStyleExtension()}`, inject: true, vendor: false, env: 'prod' },
            { src: `${this.CSS_SRC}/bootstrapmap.${this.getInjectableStyleExtension()}`, inject: true, vendor: false },
            //{ src: `${this.CSS_SRC}/leaflet_1.0.0rc.2.${this.getInjectableStyleExtension()}`, inject: true, vendor: false },
            //{ src: `${this.CSS_SRC}/leaflet.${this.getInjectableStyleExtension()}`, inject: true, vendor: false },
            //{ src: `${this.ASSETS_SRC}/css/esri.3.15.css`, inject: true },
            { src: `${this.CSS_SRC}/fonts/font-awesome-4.5.0/css/font-awesome.min.${this.getInjectableStyleExtension()}`, inject: true, vendor: false, env: 'dev' },
            //{ src: `${this.ASSETS_SRC}/scripts/ags.3.16.init.js`, inject: true },
            { src: `${this.ASSETS_SRC}/scripts/jquery-ui-labeledslider.js`, vendor: false, inject: true },
            //{ src: `${this.ASSETS_SRC}/scripts/leaflet-1.0.0-rc.2.js`, vendor: false, inject: true },
            //{ src: `${this.ASSETS_SRC}/scripts/esri-leaflet-2.0.1.js`, vendor: false, inject: true },
            //{ src: `${this.ASSETS_SRC}/scripts/leaflet-1.0.0-beta.2.js`, vendor: false, inject: true },
            //{ src: `${this.ASSETS_SRC}/scripts/esri-leaflet-2.0.0-beta.8.js`, vendor: false, inject: true },
            { src: `${this.CSS_SRC}/toast.${this.getInjectableStyleExtension()}`, inject: true, vendor: false },
            { src: `${this.ASSETS_SRC}/scripts/oe.js`, vendor: false, inject: true },
            { src: `${this.ASSETS_SRC}/scripts/toast.js`, vendor: false, inject: true }
        ];
        const appAssets = this.APP_ASSETS;
        //this.APP_ASSETS = appAssets.concat(additional_app_assets);
        this.APP_ASSETS = additional_app_assets.concat(appAssets);
        this.SYSTEM_CONFIG.map['angular2-highcharts'] = `${this.APP_BASE}node_modules/angular2-highcharts/`;
        this.SYSTEM_CONFIG.map['highcharts/highstock.src'] = `${this.APP_BASE}node_modules/highcharts/highstock.src.js`;
        this.SYSTEM_CONFIG.map['highcharts/modules/map'] = `${this.APP_BASE}node_modules/highcharts/modules/map.js`;
        this.SYSTEM_CONFIG.map['angular2-infinite-scroll'] = `${this.APP_BASE}node_modules/angular2-infinite-scroll/angular2-infinite-scroll.js`;
        this.SYSTEM_CONFIG.map['ng2-dragula/ng2-dragula'] = `${this.APP_BASE}node_modules/ng2-dragula/ng2-dragula.js`;

        // Development
        this.SYSTEM_CONFIG.paths['dragula'] = `${this.APP_BASE}node_modules/dragula/dist/dragula.min`;

        // Production
        this.SYSTEM_BUILDER_CONFIG.paths['dragula'] = `node_modules/dragula/dist/dragula.min.js`;
        /* Add to or override NPM module configurations: */
        //this.mergeObject(this.SYSTEM_CONFIG['map'], { leaflet: `${this.APP_ASSETS}/scripts/leaflet-1.0.0-beta.2.js}` });
        //this.mergeObject( this.PLUGIN_CONFIGS['browser-sync'], { ghostMode: false } );
    }
}
