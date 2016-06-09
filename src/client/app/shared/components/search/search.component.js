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
var search_service_1 = require('../../../shared/services/search-topics-places/search.service');
var index_1 = require('../../../shared/utilities/index');
require('rxjs/add/operator/map');
require('rxjs/add/operator/debounceTime');
require('rxjs/add/operator/distinctUntilChanged');
require('rxjs/add/operator/switchMap');
require('rxjs/add/operator/share');
var SearchComponent = (function () {
    function SearchComponent(_searchService, _helperFuncs, _router) {
        var _this = this;
        this._searchService = _searchService;
        this._helperFuncs = _helperFuncs;
        this._router = _router;
        this.selSearchResultEvt = new core_1.EventEmitter();
        this.term = new common_1.Control();
        this.items = this.term.valueChanges
            .debounceTime(200)
            .distinctUntilChanged()
            .switchMap(function (term) { return _this._searchService.search(term !== undefined ? term.toString() : ''); })
            .share();
        this.items.subscribe(function (value) { return _this.tempResults = value; });
    }
    SearchComponent.prototype.eventHandler = function (event, searchItem) {
        this.selSearchResultEvt.emit(searchItem);
    };
    SearchComponent.prototype.inputSearchClickHandler = function (event) {
        this.term.updateValue('', { emitEvent: true, emitModelToViewChange: true });
        this.searchTerms = '';
    };
    SearchComponent.prototype.inputKeypressHandler = function (event) {
        if (event.keyCode === 13) {
            if (this.tempResults.length > 0) {
                var firstItem = this.tempResults[0];
                var selected = {
                    Name: firstItem['Name'].replace(/\,/g, '%2C'),
                    ResID: firstItem['ResID'],
                    Type: firstItem['Type'],
                    TypeCategory: firstItem['TypeCategory'],
                    Desc: firstItem['Desc']
                };
                this.selectedSearchResult = selected;
                this.selSearchResultEvt.emit(selected);
            }
            else {
                alert('Please select a valid search term.');
            }
        }
    };
    SearchComponent.prototype.blurHandler = function (event) {
        var searchScope = this;
        setTimeout(function () {
            if (document.activeElement.classList.toString() === 'list-group-item') {
                var attr = 'data-search-item';
                var listItem = JSON.parse(document.activeElement.attributes[attr].value);
                var selected = {
                    Name: listItem.Name.replace(/\,/g, '%2C'),
                    ResID: listItem.ResID,
                    Type: listItem.Type,
                    TypeCategory: listItem.TypeCategory,
                    Desc: listItem.Desc
                };
                searchScope.selectedSearchResult = selected;
            }
            else if (document.activeElement.id === 'explore-btn') {
                if (searchScope.tempResults.length > 0) {
                    var firstItem = searchScope.tempResults[0];
                    var selected = {
                        Name: firstItem['Name'].replace(/\,/g, '%2C'),
                        ResID: firstItem['ResID'],
                        Type: firstItem['Type'],
                        TypeCategory: firstItem['TypeCategory'],
                        Desc: firstItem['Desc']
                    };
                    searchScope.selectedSearchResult = selected;
                    searchScope.selSearchResultEvt.emit(selected);
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
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SearchComponent.prototype, "viewType", void 0);
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
            providers: [http_1.JSONP_PROVIDERS, search_service_1.SearchTopicsPlacesService, index_1.HelperFunctions],
            directives: [common_1.CORE_DIRECTIVES, common_1.NgClass]
        }), 
        __metadata('design:paramtypes', [search_service_1.SearchTopicsPlacesService, index_1.HelperFunctions, router_1.Router])
    ], SearchComponent);
    return SearchComponent;
})();
exports.SearchComponent = SearchComponent;
//# sourceMappingURL=search.component.js.map