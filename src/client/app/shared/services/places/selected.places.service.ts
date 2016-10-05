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
    selectedPlaces: any = [];
    processing: boolean = false;
    processingQueue: any[] = [];
    intervalCount: number = 0;
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
                this.selectedPlaces = data;
                this.selectionChanged$.next(data);
            });

        this.addPlace
            .map((place: any) => {
                return (state: any) => {
                    return state.concat(place);
                };
            })
            .subscribe(this.updates);



        this.removePlace
            .map((place: any) => {
                return (state: any) => {
                    return state.filter((places: any) => {
                        return places.Name.replace(' County', '') !== place.Name.replace(' County', '');
                    })
                        .map((places: any) => {
                            console.log('removing place from service', state, places, place);
                            if (!place.Combined) {
                                return places;
                            } else {
                                //check how many places have same group name and  if only 1 remove name and combined flag
                                if (places.GroupName === place.GroupName) {
                                    let placeGroupName = state.filter((p: any) => p.GroupName === place.GroupName && p.Name !== place.Name);
                                    console.log('selected place service, removing check for group name', placeGroupName);
                                    if (placeGroupName.length === 1) {
                                        let returnPlace = places;
                                        delete returnPlace.GroupName;
                                        delete returnPlace.Combined;
                                        //places.GroupName = '';
                                        //places.Combined = false;
                                        console.log('place with removed group name', returnPlace);
                                        return returnPlace;
                                    } else {
                                        return places;
                                    }
                                } else {
                                    return places;
                                }
                            }
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
                    //console.log('places from inside setAllPlaceMap');
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
        //console.log('adding place to selectedPlaces', place);
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
            //console.log('initialstate', this.selectedPlaces);
            //only get data for place that doesn't have placeinfo
            let isStatewide = ['41', '06', '41r', '41u', '06r', '06u'].indexOf(p.ResID) !== -1;
            let selPlace = this.selectedPlaces.filter((sp: any) => sp.Name === p.Name || isStatewide);
            if (isStatewide) {
                //console.log('isStatewide, dont need more placeinfo');
                observables.push([p]);
            } else if (selPlace.length > 0 ? selPlace[0].GeoInfo.length > 0 : false) {
                //console.log('already have geoinfo for', selPlace);
                observables.push([selPlace]);
            } else {
                //console.log('need geoinfo for', p.Name);
                observables.push(this.jsonp
                    .get(serviceUrl, { search: params })
                    .map((request: any) => <string[]>request.json()));
            }
        });
        return Observable.forkJoin(observables);
    }

    remove(place: any): void {
        console.log('removing place from selectedPlaces');
        console.log(place);
        this.removePlace.next(place);
    }

    setAllbyPlaceType(places: any[], placeType: string): void {
        let translatedPlaceType = this.translatePlaceTypes(placeType);
        console.log('processing queue', this.processingQueue, places);
        if (places.length > 0) {
            this.processingQueue.push({ places: places, placeType: translatedPlaceType });
            if (!this.processing) {
                this.processing = true;
                this.intervalCount = 0;
                this._setAllByPlaceType.next([this.processingQueue[0].places, this.processingQueue[0].placeType]);
                if (placeType !== 'SchoolDistricts') {
                    this.subScribeToGetAddionalPlaceInfo(this.processingQueue[0].places, this.processingQueue[0].placeType);
                } else {
                    this.processingQueue.shift();
                    this.processing = false;
                }
            } else {
                //console.log('still processing', this.processing);
                let runScope = this;
                var runInterval = setInterval(runCheck, 500);
                function runCheck() {
                    console.log('processing queue run check', runScope.processingQueue, runScope.intervalCount);
                    runScope.intervalCount++;
                    if (runScope.intervalCount >= 6) {
                        clearInterval(runInterval);
                    }
                    if (!runScope.processing && runScope.processingQueue.length > 0) {
                        //console.log('processing interval not processing moving on to next in queue', runScope.intervalCount);
                        clearInterval(runInterval);
                        runScope.intervalCount = 0;
                        runScope.processing = true;
                        runScope._setAllByPlaceType.next([runScope.processingQueue[0].places, runScope.processingQueue[0].placeType]);
                        if (runScope.processingQueue[0].placeType !== 'SchoolDistricts') {
                            runScope.subScribeToGetAddionalPlaceInfo(runScope.processingQueue[0].places, runScope.processingQueue[0].placeType);
                        } else {
                            this.processingQueue.shift();
                            this.processing = false;
                        }
                    }
                }
            }
        } else {
            this.processingQueue = [];
            this._setAllByPlaceType.next([places, translatedPlaceType]);
        }
    }

    subScribeToGetAddionalPlaceInfo(places: any,translatedPlaceType:any) {
        this.getAdditionalPlaceInfo(places).subscribe((pinfo: any[]) => {
            //console.log('jumping jack3', this.processingQueue);
            this.processingQueue.shift();
            console.log('jumping jack5', this.processingQueue);
            places.forEach((place: any) => {
                if (place.GeoInfo.length === 0) {
                    let geoInfo = pinfo.filter((pi: any[]) => {
                        //console.log('jumping susan', pi, place);
                        if (pi[0].community) {
                            return pi.length > 0 ? pi[0].community.replace(' County', '').trim() === place.Name.replace(' County', '').trim() : false;
                        } else {
                            return false;
                        }
                    });
                    place.GeoInfo = geoInfo.length > 0 ? geoInfo[0] : [];
                }
                //console.log('jumping ben', place);
            });
            //console.log('jumping jack4', places);
            this._setAllByPlaceType.next([places, translatedPlaceType]);
            this.processing = false;
        });
    }

    updatePlaceGroupNames(places: any[], groupName: string, add: boolean): void {
        //console.log('updating place group names', places, groupName, add);
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
