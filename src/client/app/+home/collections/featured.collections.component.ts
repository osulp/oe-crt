import {Component, OnInit}  from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {JSONP_PROVIDERS}  from '@angular/http';
import {Observable}       from 'rxjs/Observable';
import {CollectionsService} from '../../shared/services/collections/collections.service';
import 'rxjs/add/operator/map';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'featured-collections',
    templateUrl: 'featured.collections.component.html',
    styleUrls: ['featured.collections.component.css'],
    providers: [JSONP_PROVIDERS, CollectionsService],
    directives: [ROUTER_DIRECTIVES]
})



export class FeaturedCollectionsComponent implements OnInit {
    items: Observable<string[]>;
    isMobile: boolean = $(window).width() < 768;

    constructor(private _collectionsService: CollectionsService) { }

    search(term: string) {
        //this._topicService.search(term).then(items => this.items = items);
        this.items = this._collectionsService.get();
    }

    gotoCollection(collection: any) {
        window.location.href = './Explore;collection=' + collection;
    }

    ngOnInit() {
        this.search('');
    }
}

