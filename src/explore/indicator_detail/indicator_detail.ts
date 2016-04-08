import {Component, Input, OnInit} from 'angular2/core';
import {JSONP_PROVIDERS}  from 'angular2/http';
import {IndicatorDescService} from '../../shared/services/indicators/indicator.desc.service';
import { MapComponent } from '../../shared/components/map/map.component';

@Component({
    selector: 'indicator-detail',
    templateUrl: './explore/indicator_detail/indicator_detail.html',
    styleUrls: ['./explore/indicator_detail/indicator_detail.css'],
    providers: [JSONP_PROVIDERS, IndicatorDescService],
    directives: [MapComponent]
})

export class DetailCmp implements OnInit {
    @Input() inputIndicator: any;
    indicatorDesc: any = [];
    // map config
    //empty object uses defaults;
    public mapOptions:any = null;

    // search config
    public searchOptions = {
        enableButtonMode: true, //this enables the search widget to display as a single button
        enableLabel: false,
        enableInfoWindow: true,
        showInfoWindowOnSelect: false,
    };

    constructor(private _indicatorDescService: IndicatorDescService) { }
    // once the map loads
    onMapLoad(response: any) {
        //const map = response.map;
        // bind the search dijit to the map
        //this.searchComponent.setMap(map);
        // initialize the leged dijit with map and layer infos
        //this.legendComponent.init(map, response.layerInfos);
        // set the selected basemap
        //this.basemapSelect.selectedBasemap = response.basemapName;
        // bind the map title
        //this.title = response.itemInfo.item.title;
    }

    // set map's basemap in response to user changes
    onBasemapSelected(basemapName: any) {
        //this.mapComponent.setBasemap(basemapName);
    }
    ngOnInit() {
        this._indicatorDescService.getIndicator(this.inputIndicator).subscribe(
            data => {
                this.indicatorDesc = data;// IndicatorDescSer    
                console.log(data);
            });
    }
}
