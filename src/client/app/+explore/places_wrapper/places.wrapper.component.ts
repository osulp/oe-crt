import {Component, ViewChild, Input, OnInit} from '@angular/core';
import {PlacesMapSelectComponent} from '../../shared/components/index';
import {SelectedPlacesService} from '../../shared/services/index';
import {SearchResult} from '../../shared/data_models/index';


@Component({
    moduleId: module.id,
    selector: 'places',
    templateUrl: 'places.wrapper.component.html',
    styleUrls: ['places.wrapper.component.css'],
    directives: [PlacesMapSelectComponent]
})

export class PlacesWrapperComponent implements OnInit {
    @Input() inputPlaces: any;
    @ViewChild(PlacesMapSelectComponent) placeMap: PlacesMapSelectComponent;
    selectedPlaceType: string;
    urlPlaces: SearchResult[] = [];

    constructor(private _selectedPlaceService: SelectedPlacesService) { }

    getClass() {
        return this.selectedPlaceType === 'CountiesCitiesTracts' ? 'glyphicon glyphicon-menu-up' : 'glyphicon glyphicon-menu-down';
    }

    toggleSelection(tab: any) {
        this.selectedPlaceType = tab;
        if (tab === 'CountiesCitiesTracts') {
            this.placeMap.leafletMap.refreshMap();
        }
    }

    ngOnInit() {
        //this._selectedPlaceService.selectionChanged$.subscribe(
        //    places => {
        //        console.log('gimme love', places);
        //        this.urlPlaces = places;
        //        let isOregon = false;
        //        let isCalifornia = false;
        //        let hasNoStatewide = false;
        //        console.log('url places:', this.urlPlaces);
        //        for (var x = 0; x < this.urlPlaces.length; x++) {
        //            let place: SearchResult = this.urlPlaces[x];
        //            console.log('processing place:', place);
        //            //this.urlPlaces.push(place);
        //            switch (place.ResID) {
        //                case '41':
        //                    isOregon = true;
        //                    break;
        //                case '06':
        //                    isCalifornia = true;
        //                    break;
        //                default:
        //                    hasNoStatewide = true;
        //                    break;
        //            }
        //        }
        //        console.log('state check', hasNoStatewide);
        //        this.selectedPlaceType = this.urlPlaces.length > 0 ? (hasNoStatewide ? 'CountiesCitiesTracts' : (isOregon ? 'Oregon' : 'California')) : 'Oregon';   
        //    }
        //);
        console.log('loaded explore places component', decodeURIComponent(this.inputPlaces));         
        this.urlPlaces = this.inputPlaces !== 'undefined' ? JSON.parse('[' + decodeURIComponent(this.inputPlaces) + ']') : [];        
        let isOregon = false;
        let isCalifornia = false;
        let hasNoStatewide = false;
        console.log('url places:', this.urlPlaces);
        for (var x = 0; x < this.urlPlaces.length; x++) {
            let place: SearchResult = this.urlPlaces[x];
            console.log('processing place:', place);
            //this.urlPlaces.push(place);
            switch (place.ResID) {
                case '41':
                    isOregon = true;
                    break;
                case '06':
                    isCalifornia = true;
                    break;
                default:
                    hasNoStatewide = true;
                    break;
            }
        }
        console.log('state check', hasNoStatewide);
        this.selectedPlaceType = this.urlPlaces.length > 0 ? (hasNoStatewide ? 'CountiesCitiesTracts' : (isOregon ? 'Oregon' : 'California')) : 'Oregon';        
    }
}


