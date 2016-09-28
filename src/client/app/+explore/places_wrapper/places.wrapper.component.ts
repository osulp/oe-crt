import {Component, ViewChild, Input, OnInit} from '@angular/core';
import {PlacesMapSelectComponent} from '../../shared/components/index';
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
    @Input() expanded: boolean;
    @ViewChild(PlacesMapSelectComponent) placeMap: PlacesMapSelectComponent;
    selectedPlaceType: string;
    selectedPlaceTypes: any[] = [];
    urlPlaces: SearchResult[] = [];
    selPlaces: any = [];
    selPlacesNotStatewide: any = [];
    selPlacesNotStateTemp: any = [];
    initMapLoad: boolean = false;
    california: SearchResult = {
        Name: 'California',
        ResID: '06',
        Type: 'Place',
        TypeCategory: 'State',
        Desc: 'California'
    };
    oregon: SearchResult = {
        Name: 'Oregon',
        ResID: '41',
        Type: 'Place',
        TypeCategory: 'State',
        Desc: 'Oregon'
    };

    getClass() {
        return this.selectedPlaceType === 'CountiesCitiesTracts' || this.expanded.toString() === 'true' ? 'glyphicon glyphicon-menu-up' : 'glyphicon glyphicon-menu-down';
    }

    onSelPlaces(places: any[]) {
        this.selPlaces = places;
        this.selPlacesNotStatewide = places.filter((place: any) => ['State', 'SchoolDistricts'].indexOf(place.TypeCategory) === -1);
        if (this.selPlacesNotStatewide.length > this.selPlacesNotStateTemp.length) {
            this.expanded = true;
            if (!this.initMapLoad && this.selPlacesNotStatewide.length > 0) {
                this.initMapLoad = true;
                this.placeMap.leafletMap.refreshMap();
            }
        }
        this.selPlacesNotStateTemp = this.selPlacesNotStatewide;
    }



    toggleSelection(tab: any) {
        let addPlace = false;
        //console.log('toggletab', tab, this.selectedPlaceTypes, this.expanded.toString());
        if (tab === 'CountiesCitiesTracts' ? this.expanded.toString() === 'false' : this.selectedPlaceTypes.indexOf(tab) === -1) {
            addPlace = true;
            this.selectedPlaceTypes.push(tab);
        } else {
            this.selectedPlaceTypes = this.selectedPlaceTypes.filter((spt: any) => { return spt !== tab; });
        }
        //this.selectedPlaceType = tab;
        if (tab === 'CountiesCitiesTracts') {
            try {
                this.expanded = this.expanded.toString() === 'true' ? false : true;
                if (!this.initMapLoad) {
                    this.initMapLoad = true;
                    this.placeMap.leafletMap.refreshMap();
                }
            } catch (ex) {
                console.log('IE fails here');
                let mapScope = this;
                //window.setTimeout(function () {
                console.log(mapScope.placeMap.leafletMap.refreshMap());
                mapScope.placeMap.leafletMap.refreshMap();
                //}, 500);
            }
        }
        if (addPlace) {
            switch (tab) {
                case 'Oregon':
                    this.placeMap.addPlace(this.oregon);
                    break;
                case 'California':
                    this.placeMap.addPlace(this.california);
                    break;
                default:
                    break;
            }
        } else {
            //remove
            switch (tab) {
                case 'Oregon':
                    this.placeMap.removePlace(this.oregon);
                    break;
                case 'California':
                    this.placeMap.removePlace(this.california);
                    break;
                default:
                    break;
            }
        }
    }

    ngOnInit() {
        this.urlPlaces = this.inputPlaces !== 'undefined' ? JSON.parse('[' + decodeURIComponent(this.inputPlaces) + ']') : [];
        let isOregon = false;
        let isCalifornia = false;
        let hasNoStatewide = false;
        console.log('url places:', this.urlPlaces);
        for (var x = 0; x < this.urlPlaces.length; x++) {
            let place: SearchResult = this.urlPlaces[x];
            //console.log('processing place:', place);
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
        if (this.urlPlaces.length === 0) {
            isOregon = true;
        }
        this.selectedPlaceType = this.urlPlaces.length > 0 ? (hasNoStatewide ? 'CountiesCitiesTracts' : (isOregon ? 'Oregon' : 'California')) : 'Oregon';

        if (hasNoStatewide) {
            this.selectedPlaceTypes.push('CountiesCitiesTracts');
        }
        if (isCalifornia) {
            this.selectedPlaceTypes.push('California');
        }
        if (isOregon) {
            this.selectedPlaceTypes.push('Oregon');
        }
        this.expanded = this.selectedPlaceType === 'CountiesCitiesTracts' ? true : this.expanded;
    }
}

