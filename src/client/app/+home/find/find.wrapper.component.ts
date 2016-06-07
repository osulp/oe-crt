import {Component} from '@angular/core';
import {TopicsCmp} from './topics/topics.component';
import {PlacesCmp} from './places/places.component';
import {SearchResult} from '../../shared/data_models/index';
import {SearchCmp} from '../../shared/components/search/search.component';
import {Router} from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'find-wrapper',
    templateUrl: 'find.wrapper.component..html',
    styleUrls: ['find.wrapper.component..css'],
    directives: [SearchCmp, TopicsCmp, PlacesCmp]
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

