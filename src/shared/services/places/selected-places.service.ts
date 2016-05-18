import {Injectable} from 'angular2/core';
//import {SearchResult} from '../../data_models/search-result';
import {Subject}    from 'rxjs/Subject';
import {ReplaySubject}    from 'rxjs/Rx';
//import 'rxjs/add/operator/share';
//import 'rxjs/add/operator/startWith';

let initialState: any[] = [];
let initialStateMap: any[] = [];

@Injectable()
export class SelectedPlacesService {
    //search based selections
    selectionChanged$: ReplaySubject<any[]> = new ReplaySubject(1);
    updates: Subject<any> = new Subject<any>();
    addPlace: Subject<any> = new Subject<any>();
    removePlace: Subject<any> = new Subject<any>();
    getAll: Subject<any> = new Subject<any>();
    //map selections
    selectionMapChanged$: ReplaySubject<any[]> = new ReplaySubject(1);
    updatesMap: Subject<any> = new Subject<any>();
    addPlaceMap: Subject<any> = new Subject<any>();
    removePlaceMap: Subject<any> = new Subject<any>();
    setAllPlacesMap: Subject<any> = new Subject<any>();
    getAllMap: Subject<any> = new Subject<any>();
    //selectedPlaces = new Array<SearchResult>();

    constructor() {
        this.updates
            .scan((accumulator: Object[], operation: Function) => {
                return operation(accumulator);
            }, initialState)
            .subscribe(this.selectionChanged$);

        this.addPlace
            .map((place) => {
                return (state: any) => { return state.concat(place); };
            })
            .subscribe(this.updates);

        this.removePlace
            .map((place) => {
                return (state: any) => {
                    return state.filter((places: any) => {
                        return places.Name.replace(' County', '') !== place.replace(' County', '');
                    });
                };
            })
            .subscribe(this.updates);

        this.getAll
            .map(() => {
                return (state: any) => {
                    return state.map((eachPlace: any) => {
                        return eachPlace;
                    });
                };
            })
            .subscribe(this.updates);

        //map based selections
        this.updatesMap
            .scan((accumulator: Object[], operations: Function) => {
                console.log('upadesmap');
                console.log(accumulator);
                console.log(operations);
                return operations(accumulator);
            }, initialStateMap)
            .subscribe(this.selectionMapChanged$);

        this.addPlaceMap
            .map((place) => {
                return (state: any) => { return state.concat(place); };
            })
            .subscribe(this.updatesMap);

        this.removePlaceMap
            .map((place) => {
                return (state: any) => {
                    return state.filter((places: any) => {
                        return places.Name.replace(' County', '') !== place.replace(' County', '');
                    });
                };
            })
            .subscribe(this.updatesMap);

        this.setAllPlacesMap
            .map((places) => {
                return (state: any) => {
                    console.log('places from inside setAllPlaceMap');
                    console.log(places);
                    return places;
                };
            })
            .subscribe(this.updatesMap);
    }

    load() {
        //intializes subscription?
    }


    add(place: any, source?: any): void {
        console.log('adding place to selectedPlaces');
        //this.selectedPlaces.push(place);
        if (source) {
            place.Source = source;
        }
        this.addPlace.next(place);
    }

    remove(place: any): void {
        console.log('removing place from selectedPlaces');
        console.log(place);
        this.removePlace.next(place.Name);
    }

    addMapPlace(place: any, source?: any): void {
        console.log('adding place to selectedPlaces');
        //this.selectedPlaces.push(place);
        if (source) {
            place.Source = source;
        }
        this.addPlaceMap.next(place);
    }

    removeMapPlace(place: any): void {
        console.log('removing place from selectedPlaces');
        console.log(place);
        this.removePlaceMap.next(place.Name);
    }

    setMapPlaces(places: any): void {
        this.setAllPlacesMap.next(places);
    }
}
