import {Component} from '@angular/core';
import {TopicsComponent} from './topics/topics.component';
import {PlacesComponent} from './places/places.component';
import {SearchResult} from '../../shared/data_models/index';
import {SearchComponent} from '../../shared/components/search/search.component';
import {Router} from '@angular/router';
//import {Router} from '@angular/router-deprecated';

@Component({
    moduleId: module.id,
    selector: 'find-wrapper',
    templateUrl: 'find.wrapper.component.html',
    styleUrls: ['find.wrapper.component..css'],
    directives: [SearchComponent, PlacesComponent, TopicsComponent]
})

export class FindWrapperComponent {
    selectedSearchResult: SearchResult;
    page: string;

    constructor(private _router: Router
    ) { }

    goto(page: string) {
        this._router.navigate([page]);
    }
    //emitted from search component
    onSelectedSearchResult(results: SearchResult) {
        this.selectedSearchResult = results;
        if (this.selectedSearchResult !== undefined) {
            if (results.Type.toLowerCase() === 'indicator') {
                //this._router.navigate(['Explore', { indicator: encodeURIComponent(results.Name), topics: results.TypeCategory.split(';')[1] }]);
                this._router.navigate(['Explore', {
                    indicator: encodeURIComponent(results.Name.replace('(', '%28').replace(')', '%29'))
                }]);
            } else {
                this._router.navigate(['Explore', { places: encodeURI(JSON.stringify(results)) }]);
                //this._router.navigate(['Explore', { topics: 'All Topics' }]);
            }
        }
    }
}
