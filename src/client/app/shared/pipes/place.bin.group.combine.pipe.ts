import {Pipe, PipeTransform} from '@angular/core';
import {SearchResult} from '../../shared/data_models/index';

@Pipe({
    name: 'placeBinGroupCombinePipe'
})

export class PlaceBinGroupCombinePipe implements PipeTransform {
    transform(places: SearchResult[]): any {
        //create an array of arrays based on group-name
        let processedGroups: any[] = [];
        let returnArray: any[] = [];
        for (var place of places) {
            let groupArray: any[] = [];
            if (place.GroupName === undefined) {
                groupArray = places.filter((pl: any) => {
                    return pl.Name === place.Name;
                });
            } else if (processedGroups.indexOf(place.GroupName) === -1) {
                groupArray = places.filter((pl: any) => {
                    return pl.GroupName === place.GroupName;
                });
                processedGroups.push(place.GroupName);
            } else {
                let placeHolder = {
                    'TypeCategory': place.TypeCategory
                };
                groupArray = [placeHolder];
            }
            returnArray.push(groupArray);
        }
        console.log('pb return', returnArray);
        return returnArray
    }
}


