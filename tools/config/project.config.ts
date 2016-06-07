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
      this.APP_BASE = this.ENV === 'prod' ? '/rural/crt_ng2_test/' : '/';
      let additional_deps: InjectableDependency[] = [
          { src: `bootstrap/dist/css/bootstrap.${this.getInjectableStyleExtension()}`, inject: true, env: 'dev' },
          //{ src: 'jquery-ui/themes/smoothness/jquery-ui.css', inject: true },
          //{ src: 'jquery/dist/jquery.min.js', inject: 'libs' },
          //{ src: 'jquery-ui/jquery-ui.js', inject: 'libs' }
          // {src: 'lodash/lodash.min.js', inject: 'libs'},
      ];

      const seedDependencies = this.NPM_DEPENDENCIES;

      this.NPM_DEPENDENCIES = seedDependencies.concat(additional_deps);

      let additional_app_assets: InjectableDependency[] = [
          { src: `${this.CSS_SRC}/oe.less.import.${this.getInjectableStyleExtension()}`, inject: true, vendor: false, env: 'prod' },
          { src: `${this.CSS_SRC}/bootstrapmap.${this.getInjectableStyleExtension()}`, inject: true, vendor: false },          
          { src: `${this.CSS_SRC}/leaflet.${this.getInjectableStyleExtension()}`, vendor: false, inject: true },
          //{ src: `${this.ASSETS_SRC}/css/esri.3.15.css`, inject: true },
          { src: `${this.CSS_SRC}/fonts/font-awesome-4.5.0/css/font-awesome.min.${this.getInjectableStyleExtension()}`, inject: true, vendor: false, env: 'dev' },    
          //{ src: `${this.ASSETS_SRC}/scripts/ags.3.16.init.js`, inject: true },
          {src: `${this.ASSETS_SRC}/scripts/jquery-ui-labeledslider.js`, vendor: false, inject: true},
          { src: `${this.ASSETS_SRC}/scripts/leaflet-1.0.0-beta.2.js`, vendor: false, inject: true },          
          { src: `${this.ASSETS_SRC}/scripts/esri-leaflet-2.0.0-beta.8.js`, vendor: false, inject: true },
          { src: `${this.ASSETS_SRC}/scripts/oe.js`, vendor: false, inject: true }
      ];
      const appAssets = this.APP_ASSETS;
      this.APP_ASSETS = appAssets.concat(additional_app_assets);
      //this.mergeObject(this.SYSTEM_CONFIG['map'], {
      //    'anangular2-highcharts': `${this.APP_BASE}node_modules/angular2-highcharts/`
      //});
      //this.mergeObject(this.SYSTEM_CONFIG['map'], {
      //    'highcharts/highstock.src': `${this.APP_BASE}node_modules/highcharts/highstock.src.js`
      //});
      //this.mergeObject(this.SYSTEM_CONFIG['map'], {
      //    'highcharts/modules/map': `${this.APP_BASE}node_modules/highcharts/modules/map.js`
      //});
      this.SYSTEM_CONFIG.map['angular2-highcharts'] = `${this.APP_BASE}node_modules/angular2-highcharts/`;
      this.SYSTEM_CONFIG.map['highcharts/highstock.src'] = `${this.APP_BASE}node_modules/highcharts/highstock.src.js`;
      this.SYSTEM_CONFIG.map['highcharts/modules/map'] = `${this.APP_BASE}node_modules/highcharts/modules/map.js`;
      /* Add to or override NPM module configurations: */
      //this.mergeObject(this.SYSTEM_CONFIG['map'], { leaflet: `${this.APP_ASSETS}/scripts/leaflet-1.0.0-beta.2.js}` });      
      //this.mergeObject( this.PLUGIN_CONFIGS['browser-sync'], { ghostMode: false } );
  }
}
