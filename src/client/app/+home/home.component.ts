import { Component, OnInit } from '@angular/core';
import {FindWrapperComponent} from './find/find.wrapper.component';
import {FeaturedCollectionsComponent} from './collections/featured.collections.component';
import {FeaturedDataComponent} from './data/featured.data.component';
import {SponsorsComponent} from './sponsors/sponsors.component';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css'],
    directives: [FindWrapperComponent, FeaturedCollectionsComponent, FeaturedDataComponent, SponsorsComponent]
})

export class HomeComponent implements OnInit {
    ngOnInit() {
        console.log('pushState', window.location.href, window.history.state);
        window.history.pushState({}, 'CRT Home', window.location.href);
    }
}
