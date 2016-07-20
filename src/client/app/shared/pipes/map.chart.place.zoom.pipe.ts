import {Pipe, PipeTransform} from '@angular/core';


@Pipe({
    name: 'mapChartPlaceZoomPipe'
})

export class MapChartPlaceZoomPipe implements PipeTransform {
    transform(places: any[], selectedPlaceType: any): any {
        console.log('pipecheck', places, selectedPlaceType);
        return places.filter((place: any) => { return place.placeType === this.translatePlaceTypes(selectedPlaceType) });
    }

    translatePlaceTypes(placeType: string) {
        switch (placeType) {
            case 'County':
            case 'Counties':
            case 'State':
                return 'Counties';
            case 'Census Designated Place':
            case 'Incorporated City':
            case 'Incorporated Town':
            case 'City':
            case 'Cities':
                return 'Places';
            case 'Census Tract':
            case 'Census Tracts':
            case 'Unicorporated Place':
                return 'Tracts';
            default:
                return placeType;
        }
    }
}




