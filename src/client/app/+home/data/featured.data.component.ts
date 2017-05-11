import {Component, OnInit} from '@angular/core';
import {FeaturedIndicatorsService, CollectionsService} from '../../shared/services/index';
import {DataTileComponent} from '../../shared/components/data_tile/index';
import {JSONP_PROVIDERS}  from '@angular/http';

@Component({
    moduleId: module.id,
    selector: 'featured-data',
    templateUrl: 'featured.data.component.html',
    styleUrls: ['featured.data.component.css'],
    providers: [FeaturedIndicatorsService, CollectionsService, JSONP_PROVIDERS],
    directives: [DataTileComponent]
})
export class FeaturedDataComponent implements OnInit {
    featuredIndicators: any[] = [];
    collections: any;
    constructor(
        private _featuredIndicatorService: FeaturedIndicatorsService,
        private _collectionService:CollectionsService
    ) { }

    ngOnInit() {
        this._featuredIndicatorService.getFeaturedIndicators().subscribe((featInd: any[]) => {
            console.log('featuredIndicators', featInd);
            this.featuredIndicators = featInd;
        });
        this._collectionService.get().subscribe((c:any) => this.collections = c);
    }
}
