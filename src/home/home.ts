import {Component} from 'angular2/core';
import {FindWrapperCmp} from './find/find-wrapper';
import {FeaturedCollectionsCmp} from './collections/featured-collections';
import {FeaturedDataCmp} from './data/featured-data';
import {SponsorsCmp} from './sponsors/sponsors';

@Component({
    selector: 'home',
    templateUrl: './home/home.html',
    styleUrls: ['./home/home.css'],
    directives: [FindWrapperCmp, FeaturedCollectionsCmp, FeaturedDataCmp, SponsorsCmp]
})

export class HomeCmp {
    //@HostBinding('[class.row]') true;
}

