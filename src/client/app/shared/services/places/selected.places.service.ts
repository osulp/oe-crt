import {Injectable} from '@angular/core';
import {Subject}    from 'rxjs/Subject';
import {ReplaySubject}    from 'rxjs/Rx';

let initialState: any[] = [];

@Injectable()
export class SelectedPlacesService {
    //search based selections
    selectionChanged$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    updates: Subject<any> = new Subject<any>();
    addPlace: Subject<any> = new Subject<any>();
    removePlace: Subject<any> = new Subject<any>();
    updatePlaces: Subject<[any[],string,boolean]> = new Subject<any>();
    _setAllByPlaceType: Subject<[any, string]> = new Subject<any>();
    getAll: Subject<any> = new Subject<any>();

    constructor() {
        this.updates
            .scan((accumulator: Object[], operation: Function) => {
                return operation(accumulator);
            }, initialState)
            .subscribe((data: any) => {
                this.selectionChanged$.next(data);
            });

        this.addPlace
            .map((place: any) => {
                return (state: any) => { return state.concat(place); };
            })
            .subscribe(this.updates);

        this.removePlace
            .map((place: any) => {
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

        this.updatePlaces
            .map((args: any) => {
                return (state: any) => {
                    console.log(args);
                    console.log('places from inside setAllPlaceMap');
                    let updatedPlaces = args[0];
                    return state
                        .map((place: any) => {
                            //updated the groupname attribute for updatedplaces
                            let isPlaceToUpdate = false;
                            updatedPlaces.forEach((up: any) => {
                                isPlaceToUpdate = up.Name === place.Name && up.ResID == place.ResID ? true : isPlaceToUpdate;
                            });
                            if (isPlaceToUpdate) {
                                place.GroupName = args[2] ? args[1] : '';
                                place.Combined = args[2] ? true : false;
                            }
                            return place;

                        });
                };
            })
            .subscribe(this.updates);

        this._setAllByPlaceType
            .map((args: any) => {
                return (state: any) => {
                    return state
                        .filter((places: any) => {
                            return this.translatePlaceTypes(places.TypeCategory) !== args[1];
                        })
                        .concat(args[0]);
                };
            })
            .subscribe(this.updates);
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

    setAllbyPlaceType(places: any, placeType: string): void {
        let translatedPlaceType = this.translatePlaceTypes(placeType);
        this._setAllByPlaceType.next([places, translatedPlaceType]);
    }

    updatePlaceGroupNames(places: any[], groupName: string, add: boolean): void {
        console.log('updating place group names', places, groupName, add);
        this.updatePlaces.next([places, groupName, add]);
    }

    translatePlaceTypes(placeType: string) {
        switch (placeType) {
            case 'County':
            case 'Counties':
                return 'Counties';
            case 'Census Designated Place':
            case 'Incorporated City':
            case 'Incorporated Town':
            case 'City':
            case 'Cities':
            case 'Places':
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
