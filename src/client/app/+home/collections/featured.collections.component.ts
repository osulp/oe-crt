import {Component, OnInit}  from '@angular/core';
import {JSONP_PROVIDERS}  from '@angular/http';
import {Observable}       from 'rxjs/Observable';
import {CollectionsService} from '../../shared/services/collections/collections.service';
import 'rxjs/add/operator/map';

@Component({
    moduleId:module.id,
    selector: 'featured-collections',
    templateUrl: 'featured.collections.component.html',
    styleUrls: ['featured.collections.component.css'],
    providers: [JSONP_PROVIDERS, CollectionsService]
})



export class FeaturedCollectionsCmp implements OnInit {
    constructor(private _collectionsService: CollectionsService) { }

    items: Observable<string[]>;

    search(term: string) {
        //this._topicService.search(term).then(items => this.items = items);        
        this.items = this._collectionsService.search(term);
    }

    ngOnInit() {
        this.search('');
    }
}

