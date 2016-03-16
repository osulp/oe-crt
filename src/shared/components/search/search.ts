import {Component, Output, EventEmitter} from 'angular2/core';
import {Control, CORE_DIRECTIVES, NgClass} from 'angular2/common';
import {JSONP_PROVIDERS}  from 'angular2/http';
import {Router, RouteParams} from 'angular2/router';
import {SearchTopicsPlacesService} from '../../../shared/services/search-topics-places/search.service';
import {Observable} from 'rxjs/Observable';
import {SearchResult} from '../../../shared/data_models/search-result';
import {HelperFunctions} from '../../../shared/utilities/helper-functions';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/share';

@Component({
    selector: 'search',
    templateUrl: './shared/components/search/search.html',
    styleUrls: ['./shared/components/search/search.css'],
    providers: [JSONP_PROVIDERS, SearchTopicsPlacesService, HelperFunctions],
    directives: [CORE_DIRECTIVES, NgClass]
})

export class SearchCmp {
    @Output() selSearchResultEvt = new EventEmitter();
    term = new Control();
    searchTerms: string;
    selectedSearchResult: SearchResult;
    tempResults: [{}];
    items: Observable<[{}]>;

    constructor(private _searchService: SearchTopicsPlacesService, public _helperFuncs: HelperFunctions,
        private _router: Router, routeParams: RouteParams) {
        this.items = this.term.valueChanges
            .debounceTime(200)
            .distinctUntilChanged()
            .switchMap(term => this._searchService.search(term !== undefined ? term.toString() : ''))
            .share();
        this.items.subscribe(value => this.tempResults = value);
    }
    eventHandler(event: any, searchItem: SearchResult) {
        this.selSearchResultEvt.emit(searchItem);
    }

    inputSearchClickHandler(event: any) {
        this.term.updateValue('', { emitEvent: true, emitModelToViewChange: true });
        this.searchTerms = '';
    }
    inputKeypressHandler(event: any) {
        if (event.keyCode === 13) {
            //get tempResult values
            if (this.tempResults.length > 0) {
                var firstItem: any = this.tempResults[0];
                var selected: SearchResult = {
                    Name: firstItem['Name'].replace(/\,/g,'%2C'),
                    Type: firstItem['Type'],
                    TypeCategory: firstItem['TypeCategory'],
                    Desc: firstItem['Desc']
                };
                this.selectedSearchResult = selected;
                this.selSearchResultEvt.emit(selected);
            } else {
                alert('Please select a valid search term.');
            }
        }
    }
    blurHandler(event: any) {
        var searchScope = this;
        setTimeout(function () {
            //if tabbing on list result set input box to match the Name property, but don't clear.           
            if (document.activeElement.classList.toString() === 'list-group-item') {
                var attr: any = 'data-search-item';
                var listItem: any = JSON.parse(document.activeElement.attributes[attr].value);
                var selected: SearchResult = {
                    Name: listItem.Name.replace(/\,/g, '%2C'),
                    Type: listItem.Type,
                    TypeCategory: listItem.TypeCategory,
                    Desc: listItem.Desc
                };
                searchScope.selectedSearchResult = selected;
                //if the Explore button then select the top result and go else put focus on the input
            } else if (document.activeElement.id === 'explore-btn') {
                //get tempResult values
                if (searchScope.tempResults.length > 0) {
                    var firstItem: any = searchScope.tempResults[0];
                    var selected: SearchResult = {
                        Name: firstItem['Name'].replace(/\,/g, '%2C'),
                        Type: firstItem['Type'],
                        TypeCategory: firstItem['TypeCategory'],
                        Desc: firstItem['Desc']
                    };
                    searchScope.selectedSearchResult = selected;
                    searchScope.selSearchResultEvt.emit(selected);
                    alert(firstItem['Name']);
                } else {
                    alert('Please select a valid search term.');
                }
            } else {
                searchScope.term.updateValue('', { emitEvent: true, emitModelToViewChange: true });
                searchScope.searchTerms = '';
            }
        }, 1);
        //event.preventDefault();
    }
}

