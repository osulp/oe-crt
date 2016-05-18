import {Injectable} from 'angular2/core';
import {Subject}    from 'rxjs/Subject';
import {ReplaySubject}    from 'rxjs/Rx';

let initialState: any[] = [];

@Injectable()
export class HighmapSelectedService {
    selectionChanged$: ReplaySubject<any[]> = new ReplaySubject(1);
    updates: Subject<any> = new Subject<any>();
    setSelectedPlaces: Subject<any> = new Subject<any>();
    getAll: Subject<any> = new Subject<any>();
    //selectedPlaces = new Array<SearchResult>();

    constructor() {
        this.updates
            .scan((accumulator: Object[], operation: Function) => {
                return operation(accumulator);
            }, initialState)
            .subscribe(this.selectionChanged$);

        this.setSelectedPlaces
            .map((places) => {
                return (state: any) => { return places; };
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
        this.getAll.next('');
    }

    set(places: any[]): void {
        console.log('setting places selected in highmap');
        this.setSelectedPlaces.next(places);
    }
}



