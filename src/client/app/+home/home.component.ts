import { Component } from '@angular/core';
import {FindWrapperCmp} from './find/find.wrapper.component';
import {FeaturedCollectionsCmp} from './collections/featured.collections.component';
import {FeaturedDataCmp} from './data/featured.data.component';
import {SponsorsCmp} from './sponsors/sponsors.component';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css'],
    directives: [FindWrapperCmp, FeaturedCollectionsCmp,FeaturedDataCmp,SponsorsCmp]
})

export class HomeComponent { }
