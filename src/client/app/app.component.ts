import { Component } from '@angular/core';
//import {Subscription}   from 'rxjs/Subscription';
import { ROUTER_DIRECTIVES, Routes, Router} from '@angular/router';
//import { RouteConfig, ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { HTTP_PROVIDERS} from '@angular/http';
import { AboutComponent } from './+about/index';
import { CollectionsComponent,TopCollectionComponent } from './+collections/index';
import { ExploreComponent } from './+explore/explore.component';
import { HomeComponent } from './+home/home.component';
//import { MyPinsComponent } from './+mypins/index';
import { HowToComponent} from './+howto/index';
import { ErrorComponent} from './+error/index';
import { SelectedPlacesService } from './shared/services/index';
import { EmbedsComponent} from './+embeds/index';
//import { d } from './shared/index';

declare var ga: Function;
//declare var crt_globals: any;
/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */
@Component({
    moduleId: module.id,
    selector: 'sd-app',
    viewProviders: [HTTP_PROVIDERS],
    templateUrl: 'app.component.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [SelectedPlacesService]
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
        path: '/HowTo',
        component: HowToComponent
    },
    {
        path: '/Error',
        component: ErrorComponent
    },
    {
        path: '/TopIndicators',
        component: TopCollectionComponent
    },{
        path:'/Embeds',
        component: EmbedsComponent
    }
])
//@RouteConfig([
//    { path: '/', component: HomeComponent, name: 'Home' },
//{ path: '/home', component: HomeComponent, name:'Home1' },
//{ path: '/about', component: AboutComponent, name: 'About' },
//{ path: '/explore', component: ExploreComponent, name: 'Explore' },
//{ path: '/collections', component: CollectionsComponent, name: 'Collections' },
//{ path: '/my_pins', component: MyPinsComponent, name: 'My Pins' }
//])
export class AppComponent {
    constructor(public router: Router) {
        this.router.changes.subscribe(() => {
            console.log('router info', window.location.href);
            if ('<%= ENV %>' === 'prod') {
                if (ga) {
                    ga('send', 'pageview', window.location.href);
                }
            }
        });
    }
    //crt_globals = {};
}

