import {Injectable} from 'angular2/core';
import {CommunityData} from '../../data_models/community-data';
import {Subject}    from 'rxjs/Subject';
import {ReplaySubject}    from 'rxjs/Rx';
//import 'rxjs/add/operator/share';
//import 'rxjs/add/operator/startWith';

let initialState: any[] = [];

@Injectable()
export class SelectedDataService {
    selectionChanged$: ReplaySubject<any[]> = new ReplaySubject(1);
    updates: Subject<any> = new Subject<any>();
    addData: Subject<any> = new Subject<any>();
    removeData: Subject<any> = new Subject<any>();
    getAll: Subject<any> = new Subject<any>();
    //selectedPlaces = new Array<SearchResult>();

    constructor() {
        this.updates
            .scan((accumulator: Object[], operation: Function) => {
                return operation(accumulator);
            }, initialState)
            .subscribe(this.selectionChanged$);
        this.addData
            .map((data:any) => {
                return (state: any) => { return state.concat(data); };
            })
            .subscribe(this.updates);

        this.removeData
            .map((data:any) => {
                return (state: any) => {
                    return state.filter((dataset: any) => {
                        return data !== data;
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
        console.log('load selected data');
        this.getAll.next(null);
        //intializes subscription?
    }


    add(data: CommunityData): void {
        console.log('adding data to selectedData');
        //this.selectedPlaces.push(place);
        this.addData.next(data);
    }

    remove(data: CommunityData): void {
        console.log('removing data from selectedData');
        this.removeData.next(data);
    }
}



