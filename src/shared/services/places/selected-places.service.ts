import {Injectable} from 'angular2/core';
import {SearchResult} from '../../data_models/search-result';
//import {Observable} from 'rxjs/Observable';
import {Subject}    from 'rxjs/Subject';
//import {BehaviorSubject} from 'rxjs/Rx';
import {ReplaySubject}    from 'rxjs/Rx';
//import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';


let initialState: any[] = [];

@Injectable()
export class SelectedPlacesService {
    selectionChanged$: ReplaySubject<any[]> = new ReplaySubject(1);
    updates: Subject<any> = new Subject<any>();
    addPlace: Subject<any> = new Subject<any>();
    removePlace: Subject<any> = new Subject<any>();
    getAll: Subject<any> = new Subject<any>();
    //private _observer: Observer<SearchResult[]>;
    //_selectedPlaces = new Subject<SearchResult[]>();
    //selectionChanged$ = this._selectedPlaces.asObservable();
    //selectionChanged$: Observable<SearchResult[]>;
    selectedPlaces = new Array<SearchResult>();
    //private _observer: Observer<SearchResult[]>;
    //: Observable<SearchResult[]>;    

    constructor() {
        //this.selectionChanged$ = new Observable((observer: any) => this._observer = observer)
        //    //.subscribe(this.favourites);
        //    //.publishLast().refCount();
        //    //.distinctUntilChanged()
        //    .share();
        this.updates
            .scan((accumulator: Object[], operation: Function) => {
                return operation(accumulator);
            }, initialState)
            .subscribe(this.selectionChanged$);
        this.addPlace
            .map((place) => {
                return (state: any) => {
                    return state.concat(place);
                };
            })
            .subscribe(this.updates);

        this.removePlace
            .map((place) => {
                return (state: any) => {
                    return state.filter((places: any) => {
                        return places.Name !== place;
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
    }

    load() {
        //this._selectedPlaces.next(this.selectedPlaces);
        //this._observer.next(this.selectedPlaces);

    }


    add(place: SearchResult): void {
        console.log('adding place to selectedPlaces');
        this.selectedPlaces.push(place);
        //this._observer.next(this.selectedPlaces);
        this.addPlace.next(place);
        //this._selectedPlaces.next(this.selectedPlaces);
        //console.log(this.selectedPlaces);
    }
    remove(place: SearchResult): void {
        console.log('removing place from selectedPlaces');
        //const i = this.selectedPlaces.indexOf(place);
        //this.selectedPlaces.splice(i, 1);
        //this._observer.next(this.selectedPlaces);
        this.removePlace.next(place.Name);
        //this._selectedPlaces.next(this.selectedPlaces);
        //console.log(this.selectedPlaces);
    }
}


