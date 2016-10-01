import {Component} from '@angular/core';
import {TopicsComponent} from './topics/topics.component';
import {PlacesComponent} from './places/places.component';
import {SearchResult} from '../../shared/data_models/index';
import {SearchComponent} from '../../shared/components/search/search.component';
import {Router} from '@angular/router';
//import {Router} from '@angular/router-deprecated';

declare var window: any;


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
    oregon: any = {
        Name: 'Oregon',
        ResID: '41',
        Type: 'Oregon',
        TypeCategory: 'State',
        Desc: 'Oregon'
    };
    california: any = {
        Name: 'California',
        ResID: '06',
        Type: 'California',
        TypeCategory: 'State',
        Desc: 'California'
    };

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
                //console.log('crt_globals');
                //console.log('crt_globals', crt_globals);
                //crt_globals = crt_globals === 'undefined' ? {} : crt_globals;
                window['detailBackUrl'] = window.location.href;
                this._router.navigate(['Explore', {
                    indicator: encodeURIComponent(results.Name
                        .replace('(', '%28')
                        .replace(')', '%29')
                    )
                }]);
            } else {
                //on home add to url and go to explore page
                let places = '';
                if (results.ResID.indexOf('41') === 0) {
                    places = encodeURIComponent(JSON.stringify(this.oregon));
                } else {
                    places = encodeURIComponent(JSON.stringify(this.california));
                }
                let place = encodeURIComponent(JSON.stringify(results));
                places += ',' + place;
                this._router.navigate(['Explore', { places: places }]);                //this._router.navigate(['Explore', { topics: 'All Topics' }]);
            }
        }
    }
}

