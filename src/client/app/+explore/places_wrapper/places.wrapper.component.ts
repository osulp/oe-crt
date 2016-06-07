import {Component, OnInit} from '@angular/core';
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


