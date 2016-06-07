import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, Routes } from '@angular/router';
import { HTTP_PROVIDERS} from '@angular/http';

import { AboutComponent } from './+about/index';
import { CollectionsComponent } from './+collections/index';
import { ExploreComponent } from './+explore/index';
import { HomeComponent } from './+home/index';
import { MyPinsComponent } from './+mypins/index';
//import { d } from './shared/index';

/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */
@Component({
    moduleId: module.id,
    selector: 'sd-app',
    viewProviders: [HTTP_PROVIDERS],
    templateUrl: 'app.component.html',
    directives: [ROUTER_DIRECTIVES]
})
    @Routes([
        {
            path: '/',
            component: HomeComponent
        },
        {
            path: '/About',
            component: AboutComponent
        },
        {
            path: '/Explore',
            component: ExploreComponent
        },
        {
            path: '/Collections',
            component: CollectionsComponent
        },
        {
            path: '/My Pins',
            component: MyPinsComponent
        }
])
export class AppComponent { }

