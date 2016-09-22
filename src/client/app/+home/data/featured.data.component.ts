import {Component, OnInit} from '@angular/core';
import {FeaturedIndicatorsService} from '../../shared/services/indicators/index';
import {DataTileComponent} from '../../shared/components/data_tile/index';
import {JSONP_PROVIDERS}  from '@angular/http';

@Component({
    moduleId: module.id,
    selector: 'featured-data',
    templateUrl: 'featured.data.component.html',
    styleUrls: ['featured.data.component.css'],
    providers: [FeaturedIndicatorsService, JSONP_PROVIDERS],
    directives: [DataTileComponent]
})
export class FeaturedDataComponent implements OnInit {
    featuredIndicators: any[] =[];
    constructor(
        private _featuredIndicatorService: FeaturedIndicatorsService
    ) { }

    ngOnInit() {
        this._featuredIndicatorService.getFeaturedIndicators().subscribe((featInd: any[]) => {
            console.log('featuredIndicators', featInd);
            this.featuredIndicators = featInd;
        });
    }
}
