import { Component } from '@angular/core';
//import {Subscription}   from 'rxjs/Subscription';
import { ROUTER_DIRECTIVES, Routes } from '@angular/router';
//import { RouteConfig, ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { HTTP_PROVIDERS} from '@angular/http';
import { AboutComponent } from './+about/index';
import { CollectionsComponent } from './+collections/index';
import { ExploreComponent } from './+explore/explore.component';
import { HomeComponent } from './+home/home.component';
//import { MyPinsComponent } from './+mypins/index';
import { HowToComponent} from './+howto/index';
import { ErrorComponent} from './+error/index';
import { SelectedPlacesService } from './shared/services/index';
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
        path: '/How To',
        component: HowToComponent
    },
    //{
    //    path: '/My Pins',
    //    component: MyPinsComponent
    //},
    {
        path: '/Error',
        component: ErrorComponent
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
export class AppComponent { }

