import {Component} from 'angular2/core';
import {TopicsCmp} from './topics/topics';
import {PlacesCmp} from './places/places';
import {SearchResult} from '../../shared/data_models/search-result';
import {SearchCmp} from '../../shared/components/search/search';
import {Router} from 'angular2/router';

@Component({
    selector: 'find-wrapper',
    templateUrl: './home/find/find-wrapper.html',
    styleUrls: ['./home/find/find-wrapper.css'],
    directives: [TopicsCmp, PlacesCmp, SearchCmp]
})

export class FindWrapperCmp {
    selectedSearchResult: SearchResult;
    constructor(private _router: Router) { }
    page: string;
    goto(page: string) {
        this._router.navigate([page]);
    }
    //emitted from search component
    onSelectedSearchResult(results: SearchResult) {
        this.selectedSearchResult = results;
        if (this.selectedSearchResult !== undefined) {
            if (results.Type.toLowerCase() === 'indicator') {
                this._router.navigate(['Explore', { indicator: encodeURI(results.Name), topics: results.TypeCategory.split(';')[1] }]);
            } else {
                this._router.navigate(['Explore', { places: encodeURI(results.Name), topics: 'All Topics' }]);
            }
        }
    }
}

