import {Component, Output, Input, OnInit, EventEmitter} from '@angular/core';
import {Control, CORE_DIRECTIVES, NgClass} from '@angular/common';
import {JSONP_PROVIDERS}  from '@angular/http';
import {Router} from '@angular/router';
import {SearchTopicsPlacesService, SelectedPlacesService} from '../../../shared/services/index';
import {Observable} from 'rxjs/Observable';
import {SearchResult} from '../../../shared/data_models/index';
import {HelperFunctions} from '../../../shared/utilities/index';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/share';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'search',
    templateUrl: 'search.component.html',
    styleUrls: ['search.component.css'],
    providers: [JSONP_PROVIDERS, SearchTopicsPlacesService, HelperFunctions],
    directives: [CORE_DIRECTIVES, NgClass]
})

export class SearchComponent implements OnInit {
    @Input() viewType: any;
    @Input() filterType: any;
    @Output() selSearchResultEvt = new EventEmitter();
    term = new Control();
    filter: string = '%';
    searchTerms: string;
    selectedSearchResult: SearchResult;
    tempResults: any[] = [];
    items: Observable<any[]>;
    tempTabIndex: number = -1;
    isMobile: boolean = false;
    explorePushed: boolean = false;

    constructor(
        private _searchService: SearchTopicsPlacesService,
        public _helperFuncs: HelperFunctions,
        private _router: Router,
        private _selectedPlacesService: SelectedPlacesService) {
        //console.log('searching for shit', this.filterType);
        this.filter = this.filterType !== undefined ? this.filterType : this.filter;
        //var searchScope = this;
        this.items = this.term.valueChanges
            .debounceTime(200)
            .distinctUntilChanged()
            .switchMap((term: any) => this._searchService.search(term !== undefined ? term.toString() : ''))
            .share();
        this.items.subscribe(value => this.tempResults = value);
    }
    eventHandler(event: any, searchItem: SearchResult) {
        this.selectResult(searchItem);
    }

    selectResult(searchItem: SearchResult) {
        if (searchItem.Type === 'Place') {
            //searchItem.Desc = searchItem.Desc.replace(/\./g, '%2E');
            searchItem.GeoInfo = [];
            this._selectedPlacesService.add(searchItem, 'map');
        }
        this.selSearchResultEvt.emit(searchItem);
        this.term.updateValue('', { emitEvent: true, emitModelToViewChange: true });
        this.searchTerms = '';
    }

    inputSearchClickHandler(event: any) {
        this.term.updateValue('', { emitEvent: true, emitModelToViewChange: true });
        this.searchTerms = '';
    }

    searchByText(event: any) {
        this.explorePushed = true;
        if (this.searchTerms !== '') {
            this._router.navigate(['Explore', { filter: this.searchTerms }]);
        } else {
            this._router.navigate(['Explore']);
        }
    }

    inputKeypressHandler(event: any) {
        var code = event.keyCode || event.which;
        if (code === 13) {
            //get tempResult values
            if (this.tempResults.length > 0) {
                let searchScope = this;
                window.setTimeout(function () {
                    var firstItem: any = searchScope.tempResults[searchScope.tempTabIndex === -1 ? 0 : searchScope.tempTabIndex];
                    var selected: SearchResult = {
                        Name: firstItem['Name'].replace(/\,/g, '%2C').replace(/\./g, '%2E'),
                        ResID: firstItem['ResID'],
                        Type: firstItem['Type'],
                        TypeCategory: firstItem['TypeCategory'],
                        Desc: firstItem['Desc']
                    };
                    searchScope.selectedSearchResult = selected;
                    searchScope.selectResult(selected);
                }, 500);
            } else {
                alert('Please select a valid search term.');
            }
            this.term.updateValue('', { emitEvent: true, emitModelToViewChange: true });
            this.searchTerms = '';
        } else if (code === 40 || code === 9) {
            //tab or down arro
            if (this.tempTabIndex !== this.tempResults.length) {
                this.tempTabIndex++;
            } else {
                this.tempTabIndex = 0;
            }
        } else if (code === 38) {
            //up arrow
            if (this.tempTabIndex !== -1) {
                this.tempTabIndex--;
            } else {
                this.tempTabIndex = 0;
            }
        } else {
            this.tempTabIndex = -1;
        }
        this.tempResults.forEach((result: any, idx: number) => {
            this.tempResults[idx].hovered = this.tempTabIndex === idx ? true : false;
        });
        if (code === 9) {
            event.preventDefault();
        }
        //window.setTimeout(this.adjustListGroupTags, 500);
    }

    blurHandler(event: any) {
        var searchScope = this;
        //console.log('blur', event);
        if (!this.explorePushed) {
            setTimeout(function () {
                //if tabbing on list result set input box to match the Name property, but don't clear.
                if (document.activeElement.classList.toString() === 'list-group-item') {
                    var attr: any = 'data-search-item';
                    var listItem: any = JSON.parse(document.activeElement.attributes[attr].value);
                    var selected: SearchResult = {
                        Name: listItem.Name.replace(/\,/g, '%2C').replace(/\./g, '%2E'),
                        ResID: listItem.ResID,
                        Type: listItem.Type,
                        TypeCategory: listItem.TypeCategory,
                        Desc: listItem.Desc
                    };
                    searchScope.selectedSearchResult = selected;
                    //if the Explore button then select the top result and go else put focus on the input
                } else if (document.activeElement.id === 'explore-btn') {
                    //get tempResult values
                    if (searchScope.tempResults.length > 0) {
                        var firstItem: any = searchScope.tempResults[searchScope.tempTabIndex];
                        var selected: SearchResult = {
                            Name: firstItem['Name'].replace(/\,/g, '%2C').replace(/\./g, '%2E'),
                            ResID: firstItem['ResID'],
                            Type: firstItem['Type'],
                            TypeCategory: firstItem['TypeCategory'],
                            Desc: firstItem['Desc']
                        };
                        searchScope.selectedSearchResult = selected;
                        searchScope.selectResult(selected);
                        alert(firstItem['Name']);
                    } else {
                        alert('Please select a valid search term.');
                    }
                } else {
                    searchScope.term.updateValue('', { emitEvent: true, emitModelToViewChange: true });
                    searchScope.searchTerms = '';
                }
            }, 1);
        }
        //event.preventDefault();
    }

    adjustListGroupTags() {
        //for each result
        let results = $('.search-result-type');
        console.log(results);
        let parents = $('.list-group-item');
        $.each(results, function (idx: number, result: any) {
            console.log(idx, result);
            console.log(this, parent);
            console.log('parentheight', idx, $(parents[idx]).height());
            $(result).css('min-width', $(parents[idx]).height() + 25 + 'px !important');
        });
    }

    ngOnInit() {
        this.isMobile = $(window).width() < 400;
    }
}

