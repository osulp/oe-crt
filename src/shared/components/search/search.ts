import {Component} from 'angular2/core';
import {Control, CORE_DIRECTIVES, NgClass} from 'angular2/common';
import {JSONP_PROVIDERS}  from 'angular2/http';
import {SearchTopicsPlacesService} from '../../../shared/services/search-topics-places/search.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/share';

declare var jQuery: any;

interface SearchResult {
    Name: string;
    Type: string;
    TypeCategory: string;
    Desc: string;
}

@Component({
    selector: 'search',
    templateUrl: './shared/components/search/search.html',
    styleUrls: ['./shared/components/search/search.css'],
    providers: [JSONP_PROVIDERS, SearchTopicsPlacesService],
    directives: [CORE_DIRECTIVES, NgClass]
})

export class SearchCmp {
    term = new Control();
    searchTerms: string;
    selectedSearchResult: SearchResult;
    tempResults: [{}];
    items: Observable<[{}]>;
    constructor(private _searchService: SearchTopicsPlacesService) {
        this.items = this.term.valueChanges
            .debounceTime(200)
            .distinctUntilChanged()
            .switchMap(term => this._searchService.search(term !== undefined ? term.toString() : ''))
            .share();
        this.items.subscribe(value => this.tempResults = value);
    }
    eventHandler(event) {
        var searchItem = JSON.parse(event.target.attributes['data-search-item'].value);
        alert(searchItem.Name + ' ' + searchItem.Source + ' ' + searchItem.Type);
        //console.log(event, event.keyCode, event.keyIdentifier);
    }
    inputSearchClickHandler(event) {
        this.term.updateValue('', { emitEvent: true, emitModelToViewChange: true });
        this.searchTerms = '';
    }
    inputKeypressHandler(event) {
        if (event.keyCode === 13) {
            //get tempResult values
            if (this.tempResults.length > 0) {
                var firstItem = this.tempResults[0];
                var selected: SearchResult = {
                    Name: firstItem['Name'],
                    Type: firstItem['Type'],
                    TypeCategory: firstItem['TypeCategory'],
                    Desc: firstItem['Desc']
                };
                this.selectedSearchResult = selected;
                alert(firstItem['Name']);
            } else {
                alert('Please select a valid search term.');
            }
        }
    }
    blurHandler(event) {
        var searchScope = this;
        setTimeout(function () {
            //console.log(document.activeElement);
            //if tabbing on list result set input box to match the Name property, but don't clear.           
            if (document.activeElement.classList.toString() === 'list-group-item') {
                var listItem = JSON.parse(document.activeElement.attributes['data-search-item'].value);
                var selected: SearchResult = {
                    Name: listItem.Name,
                    Type: listItem.Type,
                    TypeCategory: listItem.TypeCategory,
                    Desc: listItem.Desc
                };
                searchScope.selectedSearchResult = selected;
                //if the Explore button then select the top result and go else put focus on the input
            } else if (document.activeElement.id === 'explore-btn') {
                //get tempResult values
                if (searchScope.tempResults.length > 0) {
                    var firstItem = searchScope.tempResults[0];
                    var selected: SearchResult = {
                        Name: firstItem['Name'],
                        Type: firstItem['Type'],
                        TypeCategory: firstItem['TypeCategory'],
                        Desc: firstItem['Desc']
                    };
                    searchScope.selectedSearchResult = selected;
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

