import {Injectable} from 'angular2/core';
import {SearchResult} from '../../data_models/search-result';
//import {Observable} from 'rxjs/Observable';
import {Subject}    from 'rxjs/Subject';
//import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';

@Injectable()
export class SelectedPlacesService {

    //private _observer: Observer<SearchResult[]>;
    _selectedPlaces = new Subject<SearchResult[]>();
    selectionChanged$ = this._selectedPlaces.asObservable();
    selectedPlaces = new Array<SearchResult>();
    //: Observable<SearchResult[]>;    

    load() {
        this._selectedPlaces.next(this.selectedPlaces);
    }


    add(place: SearchResult): void {
        console.log('adding place to selectedPlaces');
        this.selectedPlaces.push(place);
        this._selectedPlaces.next(this.selectedPlaces);
        //console.log(this.selectedPlaces);
    }
    remove(place: SearchResult): void {
        console.log('removing place from selectedPlaces');
        const i = this.selectedPlaces.indexOf(place);
        this.selectedPlaces.splice(i, 1);
        this._selectedPlaces.next(this.selectedPlaces);
        //console.log(this.selectedPlaces);
    }
}


