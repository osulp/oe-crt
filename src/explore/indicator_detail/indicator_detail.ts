import {Component, Input, OnInit} from 'angular2/core';
import {JSONP_PROVIDERS}  from 'angular2/http';
import {DataTileCmp} from '../../shared/components/data_tile/data-tile';
import {IndicatorDescService} from '../../shared/services/indicators/indicator.desc.service';
import { PlacesMapSelect } from '../../shared/components/places/places-map-select';

@Component({
    selector: 'indicator-detail',
    templateUrl: './explore/indicator_detail/indicator_detail.html',
    styleUrls: ['./explore/indicator_detail/indicator_detail.css'],
    providers: [JSONP_PROVIDERS, IndicatorDescService],
    directives: [PlacesMapSelect, DataTileCmp]
})

export class DetailCmp implements OnInit {
    @Input() inputIndicator: any;
    indicatorDesc: any = [];
    showMap: boolean;
    showGraph: boolean;
    showTable: boolean;
    selectedPlaceType: any = 'Oregon';

    constructor(private _indicatorDescService: IndicatorDescService) { }

    ngOnInit() {
        this.showMap = true;
        this.showGraph = true;
        this.showTable = false;
        this.inputIndicator = decodeURI(this.inputIndicator);
        this._indicatorDescService.getIndicator(this.inputIndicator).subscribe(
            data => {
                this.indicatorDesc = data;// IndicatorDescSer    
                console.log(data);
            });
    }
}
