import {Component, OnInit} from 'angular2/core';
import {PlacesMapSelect} from '../../shared/components/places/places-map-select';


@Component({
    selector: 'places',
    templateUrl: 'app/explore/places_wrapper/places_wrapper.html',
    styleUrls: ['app/explore/places_wrapper/places_wrapper.css'],
    directives: [PlacesMapSelect]
})

export class PlacesWrapperCmp implements OnInit {
    selectedPlaceType: string;

    getClass() {
        return this.selectedPlaceType === 'CountiesCitiesTracts' ? 'glyphicon glyphicon-menu-up' : 'glyphicon glyphicon-menu-down';
    }

    ngOnInit() {
        console.log('loaded explore places component');
        this.selectedPlaceType = 'Oregon';
    }
}

