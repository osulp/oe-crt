import {Component, OnInit} from 'angular2/core';
import {PlacesMapSelect} from '../../shared/components/places/places-map-select';
import {SearchResult} from '../../shared/data_models/search-result';


@Component({
    selector: 'places',
    templateUrl: './explore/places_wrapper/places_wrapper.html',
    styleUrls: ['./explore/places_wrapper/places_wrapper.css'],
    directives: [PlacesMapSelect]
})

export class PlacesWrapperCmp implements OnInit {
    selectedPlaceType: string;
    urlPlaces: SearchResult[] = [];

    getClass() {
        return this.selectedPlaceType === 'CountiesCitiesTracts' ? 'glyphicon glyphicon-menu-up' : 'glyphicon glyphicon-menu-down';
    }

    ngOnInit() {
        console.log('loaded explore places component');
        this.selectedPlaceType = 'Oregon';
        var urlQueryString = document.location.search;
        var keyRegex = new RegExp('([\?&])places([^&]*|[^,]*)');
        // If param exists already, update it
        if (urlQueryString.match(keyRegex) !== null) {
            let temp = urlQueryString.match(keyRegex)[0];
            let tempPlaces: string[] = temp.replace(new RegExp('([\?&])places='), '').split(',');
            let isOregon = false;
            let isCalifornia = false;
            let hasNotStatewide = false;
            for (var x = 0; x < tempPlaces.length; x++) {
                let place: SearchResult = JSON.parse(decodeURIComponent(tempPlaces[x]));
                this.urlPlaces.push(place);
                switch (place.ResID) {
                    case '41':
                        isOregon = true;
                        break;
                    case '06':
                        isCalifornia = true;
                        break;
                    default:
                        hasNotStatewide = true;
                        break;
                }

            }
            this.selectedPlaceType = hasNotStatewide ? 'CountiesCitiesTracts' : (isOregon ? 'Oregon' : 'California');
        }
    }
}


