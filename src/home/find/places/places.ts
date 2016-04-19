import {Component, OnInit, ElementRef} from 'angular2/core';
import {MapLeafletComponent} from '../../../shared/components/map/map.leaflet.component';
//import {MapComponent} from '../../../shared/components/map/map.component';


@Component({
    selector: 'places',
    templateUrl: './home/find/places/places.html',
    styleUrls: ['./home/find/places/places.css'],
    directives: [MapLeafletComponent]
})

export class PlacesCmp implements OnInit {

    // map config   
    public mapOptions:any = null;
    // search config
    public searchOptions = {
        enableButtonMode: true, //this enables the search widget to display as a single button
        enableLabel: false,
        enableInfoWindow: true,
        showInfoWindowOnSelect: false,
    };
    constructor(private elementRef: ElementRef) { }
    // once the map loads
    onMapLoad(response: any) {
        console.log('MAP LOADEDED!!!!!');
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
        console.log('loaded places explore component');
    }
}

