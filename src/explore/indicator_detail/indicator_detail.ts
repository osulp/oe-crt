import {Component, Input, OnInit} from 'angular2/core';
import {JSONP_PROVIDERS}  from 'angular2/http';
import {DataTileCmp} from '../../shared/components/data_tile/data-tile';
import {IndicatorDescService} from '../../shared/services/indicators/indicator.desc.service';
import {SearchResult} from '../../shared/data_models/search-result';
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
    urlPlaces: SearchResult[] = [];

    constructor(private _indicatorDescService: IndicatorDescService) { }

    ngOnInit() {
        this.showMap = true;
        this.showGraph = true;
        this.showTable = false;
        this.inputIndicator = decodeURI(this.inputIndicator).replace(/\%28/g, '(').replace(/\%29/g, ')');
        this._indicatorDescService.getIndicator(this.inputIndicator).subscribe(
            data => {
                this.indicatorDesc = data;// IndicatorDescSer    
                console.log(data);
            });
        var urlQueryString = document.location.search;
        var keyRegex = new RegExp('([\?&])places([^&]*|[^,]*)');
        // If param exists already, update it
        if (urlQueryString.match(keyRegex) !== null) {
            let temp = urlQueryString.match(keyRegex)[0];
            let tempPlaces: string[] = temp.replace(new RegExp('([\?&])places='), '').split(',');
            for (var x = 0; x < tempPlaces.length; x++) {
                let place: SearchResult = JSON.parse(decodeURIComponent(tempPlaces[x]));
                this.urlPlaces.push(place);
            }
        }
    }
}


