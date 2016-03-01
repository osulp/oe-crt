import {Component} from 'angular2/core';
import {TopicsCmp} from './topics/topics';
import {PlacesCmp} from './places/places';
import {SearchCmp} from '../../shared/components/search/search';
import {Router} from 'angular2/router';

@Component({
    selector: 'find-wrapper',
    templateUrl: './home/find/find-wrapper.html',
    styleUrls: ['./home/find/find-wrapper.css'],
    directives: [TopicsCmp, PlacesCmp, SearchCmp]
})

export class FindWrapperCmp {
    constructor(private _router: Router) { }
    page: string;
    goto(page) {
        this._router.navigate([page]);
    }
}

