import {Component, OnInit, ElementRef} from '@angular/core';
import {MapLeafletComponent} from '../../../shared/components/index';
import {Router} from '@angular/router';

//import {MapComponent} from '../../../shared/components/map/map.component';
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'places',
    templateUrl: 'places.component.html',
    styleUrls: ['places.component.css'],
    directives: [MapLeafletComponent]
})

export class PlacesComponent implements OnInit {
    isMobile: boolean = false;
    // map config
    public mapOptions:any = null;
    // search config
    public searchOptions = {
        enableButtonMode: true, //this enables the search widget to display as a single button
        enableLabel: false,
        enableInfoWindow: true,
        showInfoWindowOnSelect: false,
    };
    constructor(private elementRef: ElementRef, private _router:Router) { }
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

    goToExplorePlaces() {
        this._router.navigateByUrl('/Explore;show=Places');
    }

    ngOnInit() {
        this.isMobile = $(window).width() < 550;
    }
}

