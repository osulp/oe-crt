var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var http_1 = require('@angular/http');
var router_1 = require('@angular/router');
var index_1 = require('../../../shared/services/index');
var index_2 = require('../../../shared/utilities/index');
require('rxjs/add/operator/map');
require('rxjs/add/operator/debounceTime');
require('rxjs/add/operator/distinctUntilChanged');
require('rxjs/add/operator/switchMap');
require('rxjs/add/operator/share');
var SearchComponent = (function () {
    function SearchComponent(_searchService, _helperFuncs, _router, _selectedPlacesService) {
        var _this = this;
        this._searchService = _searchService;
        this._helperFuncs = _helperFuncs;
        this._router = _router;
        this._selectedPlacesService = _selectedPlacesService;
        this.selSearchResultEvt = new core_1.EventEmitter();
        this.term = new common_1.Control();
        this.filter = '%';
        this.tempResults = [];
        this.tempTabIndex = -1;
        this.filter = this.filterType !== undefined ? this.filterType : this.filter;
        this.items = this.term.valueChanges
            .debounceTime(200)
            .distinctUntilChanged()
            .switchMap(function (term) { return _this._searchService.search(term !== undefined ? term.toString() : ''); })
            .share();
        this.items.subscribe(function (value) { return _this.tempResults = value; });
    }
    SearchComponent.prototype.eventHandler = function (event, searchItem) {
        this.selectResult(searchItem);
    };
    SearchComponent.prototype.selectResult = function (searchItem) {
        if (searchItem.Type === 'Place') {
            this._selectedPlacesService.add(searchItem, 'map');
        }
        this.selSearchResultEvt.emit(searchItem);
    };
    SearchComponent.prototype.inputSearchClickHandler = function (event) {
        this.term.updateValue('', { emitEvent: true, emitModelToViewChange: true });
        this.searchTerms = '';
    };
    SearchComponent.prototype.inputKeypressHandler = function (event) {
        var _this = this;
        var code = event.keyCode || event.which;
        if (code === 13) {
            if (this.tempResults.length > 0) {
                var firstItem = this.tempResults[this.tempTabIndex === -1 ? 0 : this.tempTabIndex];
                var selected = {
                    Name: firstItem['Name'].replace(/\,/g, '%2C').replace(/\./g, '%2E'),
                    ResID: firstItem['ResID'],
                    Type: firstItem['Type'],
                    TypeCategory: firstItem['TypeCategory'],
                    Desc: firstItem['Desc']
                };
                this.selectedSearchResult = selected;
                this.selectResult(selected);
            }
            else {
                alert('Please select a valid search term.');
            }
            this.term.updateValue('', { emitEvent: true, emitModelToViewChange: true });
            this.searchTerms = '';
        }
        else if (code === 40 || code === 9) {
            if (this.tempTabIndex !== this.tempResults.length) {
                this.tempTabIndex++;
            }
            else {
                this.tempTabIndex = 0;
            }
        }
        else if (code === 38) {
            if (this.tempTabIndex !== -1) {
                this.tempTabIndex--;
            }
            else {
                this.tempTabIndex = 0;
            }
        }
        else {
            this.tempTabIndex = -1;
        }
        this.tempResults.forEach(function (result, idx) {
            _this.tempResults[idx].hovered = _this.tempTabIndex === idx ? true : false;
        });
        if (code === 9) {
            event.preventDefault();
        }
    };
    SearchComponent.prototype.blurHandler = function (event) {
        var searchScope = this;
        setTimeout(function () {
            if (document.activeElement.classList.toString() === 'list-group-item') {
                var attr = 'data-search-item';
                var listItem = JSON.parse(document.activeElement.attributes[attr].value);
                var selected = {
                    Name: listItem.Name.replace(/\,/g, '%2C').replace(/\./g, '%2E'),
                    ResID: listItem.ResID,
                    Type: listItem.Type,
                    TypeCategory: listItem.TypeCategory,
                    Desc: listItem.Desc
                };
                searchScope.selectedSearchResult = selected;
            }
            else if (document.activeElement.id === 'explore-btn') {
                if (searchScope.tempResults.length > 0) {
                    var firstItem = searchScope.tempResults[searchScope.tempTabIndex];
                    var selected = {
                        Name: firstItem['Name'].replace(/\,/g, '%2C').replace(/\./g, '%2E'),
                        ResID: firstItem['ResID'],
                        Type: firstItem['Type'],
                        TypeCategory: firstItem['TypeCategory'],
                        Desc: firstItem['Desc']
                    };
                    searchScope.selectedSearchResult = selected;
                    searchScope.selectResult(selected);
                    alert(firstItem['Name']);
                }
                else {
                    alert('Please select a valid search term.');
                }
            }
            else {
                searchScope.term.updateValue('', { emitEvent: true, emitModelToViewChange: true });
                searchScope.searchTerms = '';
            }
        }, 1);
    };
    SearchComponent.prototype.adjustListGroupTags = function () {
        var results = $('.search-result-type');
        console.log(results);
        var parents = $('.list-group-item');
        $.each(results, function (idx, result) {
            console.log(idx, result);
            console.log(this, parent);
            console.log('parentheight', idx, $(parents[idx]).height());
            $(result).css('min-width', $(parents[idx]).height() + 25 + 'px !important');
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SearchComponent.prototype, "viewType", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SearchComponent.prototype, "filterType", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], SearchComponent.prototype, "selSearchResultEvt", void 0);
    SearchComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'search',
            templateUrl: 'search.component.html',
            styleUrls: ['search.component.css'],
            providers: [http_1.JSONP_PROVIDERS, index_1.SearchTopicsPlacesService, index_2.HelperFunctions],
            directives: [common_1.CORE_DIRECTIVES, common_1.NgClass]
        }), 
        __metadata('design:paramtypes', [index_1.SearchTopicsPlacesService, index_2.HelperFunctions, router_1.Router, index_1.SelectedPlacesService])
    ], SearchComponent);
    return SearchComponent;
})();
exports.SearchComponent = SearchComponent;
//# sourceMappingURL=search.component.js.map