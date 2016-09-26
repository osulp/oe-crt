import {Injectable} from '@angular/core';
import {Subject}    from 'rxjs/Subject';
import {Jsonp, URLSearchParams} from '@angular/http';
import {ReplaySubject}    from 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

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
    //oregon: any = {
    //    Name: 'Oregon',
    //    ResID: '41',
    //    Type: 'Oregon',
    //    TypeCategory: 'State',
    //    Desc: 'Oregon'
    //};
    //california: any = {
    //    Name: 'California',
    //    ResID: '06',
    //    Type: 'California',
    //    TypeCategory: 'State',
    //    Desc: 'California'
    //};

    constructor(private jsonp:Jsonp) {
        this.updates
            .scan((accumulator: Object[], operation: Function) => {
                return operation(accumulator);
            }, initialState)
            .subscribe((data: any) => {
                this.selectionChanged$.next(data);
            });

        this.addPlace
            .map((place: any) => {
                return (state: any) => {
                    console.log('adding place service array', state);
                    console.log('adding concated place', state.concat(place));
                    //add state if nothing else in bin
                    //if (state.length === 0) {
                    //    console.log('adding place', place.ResID.indexOf('41'));
                    //    if (place.ResID.indexOf('41') === 0 && place.Name !== 'Oregon') {
                    //        console.log('should be adding Oregon...');
                    //        state.concat(this.oregon);
                    //    } else if (place.Name !== 'California'){
                    //        state.concat(this.california);
                    //    }
                    //}
                    return state.concat(place);
                };
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
                                isPlaceToUpdate = up.Name === place.Name && up.ResID === place.ResID ? true : isPlaceToUpdate;
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
        console.log('adding place to selectedPlaces', place);
        this.getAdditionalPlaceInfo([place]).subscribe((pinfo: any) => {
            let geoInfo = pinfo.filter((pi: any[]) => {
                return pi.length > 0 ? pi[0].community.replace(' County', '').trim() === place.Name.replace(' County', '').trim() : false;
            });
            place.GeoInfo = geoInfo.length > 0 ? geoInfo[0] : [];
            this.addPlace.next(place);
        });
    }

    addPlaces(places: any[]) {
        //console.log('adding multiple places to selectedPlaces', places);
        this.getAdditionalPlaceInfo(places).subscribe((pinfo: any) => {
            //console.log('jumping frank', pinfo);
            places.forEach((place: any) => {
                let geoInfo = pinfo.filter((pi: any[]) => {
                    //console.log('jumping susan', pi, place);
                    return pi.length > 0 ? pi[0].community.replace(' County', '').trim() === place.Name.replace(' County', '').trim() : false;
                });
                place.GeoInfo = geoInfo.length > 0 ? geoInfo[0] : [];
                //console.log('jumping ben', place);
            });
            //console.log('jumping jack5', places);
            this.addPlace.next(places);
        });

    }

    getAdditionalPlaceInfo(place: any[]) {
        let observables: any[] = [];
        let serviceUrl = 'http://oe.oregonexplorer.info/rural/crt_rest_api/places';
        place.forEach((p: any) => {
            var params = new URLSearchParams();
            params.set('place', p.Name); // the user's search value
            params.set('f', 'json');
            params.set('callback', 'JSONP_CALLBACK');
            observables.push(this.jsonp
                .get(serviceUrl, { search: params })
                .map((request: any) => <string[]>request.json()));
        });
        return Observable.forkJoin(observables);
    }

    remove(place: any): void {
        console.log('removing place from selectedPlaces');
        console.log(place);
        this.removePlace.next(place.Name);
    }

    setAllbyPlaceType(places: any[], placeType: string): void {
        let translatedPlaceType = this.translatePlaceTypes(placeType);
        if (places.length > 0) {
            this.getAdditionalPlaceInfo(places).subscribe((pinfo: any[]) => {
                //console.log('jumping jack3', pinfo);
                places.forEach((place: any) => {
                    let geoInfo = pinfo.filter((pi: any[]) => {
                        //console.log('jumping susan', pi, place);
                        return pi.length > 0 ? pi[0].community.replace(' County', '').trim() === place.Name.replace(' County', '').trim() : false;
                    });
                    place.GeoInfo = geoInfo.length > 0 ? geoInfo[0] : [];
                    //console.log('jumping ben', place);
                });
                //console.log('jumping jack4', places);
                this._setAllByPlaceType.next([places, translatedPlaceType]);
            });
        } else {
            this._setAllByPlaceType.next([places, translatedPlaceType]);
        }
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
            case 'Unincorporated Place':
                return 'Tracts';
            default:
                return placeType;
        }
    }
}
