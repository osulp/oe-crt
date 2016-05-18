var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var common_1 = require('angular2/common');
var http_1 = require('angular2/http');
var map_component_1 = require('../../components/map/map.component');
var places_service_1 = require('../../services/places/places.service');
var selected_places_service_1 = require('../../services/places/selected-places.service');
require('rxjs/add/operator/map');
require('rxjs/add/operator/debounceTime');
require('rxjs/add/operator/distinctUntilChanged');
require('rxjs/add/operator/switchMap');
require('rxjs/add/operator/share');
var PlacesMapSelect = (function () {
    function PlacesMapSelect(_searchPlaceService, _selectedPlacesService) {
        var _this = this;
        this._searchPlaceService = _searchPlaceService;
        this._selectedPlacesService = _selectedPlacesService;
        this.selPlacesEvt = new core_1.EventEmitter();
        this.term = new common_1.Control();
        this.mapOptions = null;
        this.searchResults = this.term.valueChanges
            .debounceTime(200)
            .distinctUntilChanged()
            .switchMap(function (term) { return _this._searchPlaceService.search(term !== undefined ? term.toString() : ''); })
            .share();
        this.searchResults.subscribe(function (value) { return _this.tempResults = value; });
        this.selectedSearchResults = [];
    }
    PlacesMapSelect.prototype.inputSearchClickHandler = function (event, result) {
        this.term.updateValue('', { emitEvent: true, emitModelToViewChange: true });
        this.searchTerms = '';
    };
    PlacesMapSelect.prototype.setClasses = function (suffix) {
        var sReturn = '';
        switch (suffix) {
            case 'MapCol':
                sReturn += this.viewType === 'explore' ? 'col-lg-7 col-md-7 col-xs-12 ' : 'col-xs-12 ';
                break;
            case 'FindCombComp':
                sReturn += this.viewType === 'explore' ? 'col-lg-5 col-md-5 col-xs-12 ' : '';
                break;
            default:
                break;
        }
        return (this.viewType === 'explore' ? 'explore' : 'indicatorDetail') + suffix + sReturn;
    };
    PlacesMapSelect.prototype.inputKeypressHandler = function (event, result) {
        if (event.keyCode === 13) {
            if (result !== undefined) {
                this.addPlace(result);
            }
            else {
                if (this.tempResults.length > 0) {
                    var firstItem = this.tempResults[0];
                    var selected = {
                        Name: firstItem['Name'].replace(/\,/g, '%2C'),
                        ResID: firstItem['ResID'],
                        Type: firstItem['Type'],
                        TypeCategory: firstItem['TypeCategory'],
                        Desc: firstItem['Desc']
                    };
                    this.addPlace(selected);
                }
            }
            if (this.tempResults.length === 0) {
                alert('Please select a valid search term.');
            }
            this.searchTerms = '';
        }
    };
    PlacesMapSelect.prototype.clickedSearchResult = function (event, result) {
        this.addPlace(result);
        this.searchTerms = '';
    };
    PlacesMapSelect.prototype.blurHandler = function (event) {
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
                searchScope.addPlace(selected);
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
                    searchScope.addPlace(selected);
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
    PlacesMapSelect.prototype.removePlace = function (place) {
        var indexPlace = this.selectedSearchResults.indexOf(place);
        this.selectedSearchResults.splice(indexPlace, 1);
        this.selPlacesEvt.emit(this.selectedSearchResults);
        this._selectedPlacesService.remove(place);
    };
    PlacesMapSelect.prototype.addPlace = function (place) {
        var indexPos = this.selectedSearchResults.map(function (e) { return e.Name.trim(); }).indexOf(place.Name.trim());
        if (indexPos === -1) {
            this.selectedSearchResults.push(place);
            this.selPlacesEvt.emit(this.selectedSearchResults);
            this._selectedPlacesService.add(place, 'search');
        }
    };
    PlacesMapSelect.prototype.addPlaceCompare = function (compareType) {
        var compareResult = {
            Name: compareType,
            ResID: compareType === 'Oregon' ? '41' : compareType === 'Rural' ? '41r' : '41u',
            Type: compareType,
            TypeCategory: 'State',
            Desc: compareType
        };
        var indexPos = this.selectedSearchResults.map(function (e) { return e.Name; }).indexOf(compareType);
        if (indexPos === -1) {
            this.selectedSearchResults.push(compareResult);
            this.selPlacesEvt.emit(this.selectedSearchResults);
            this._selectedPlacesService.add(compareResult, 'search');
        }
    };
    PlacesMapSelect.prototype.onSelectedPlacesChanged = function (places) {
        this.selectedSearchResults = [];
        for (var _i = 0; _i < places.length; _i++) {
            var place = places[_i];
            this.selectedSearchResults.push(place);
        }
    };
    PlacesMapSelect.prototype.onMapLoad = function (response) {
    };
    PlacesMapSelect.prototype.ngOnInit = function () {
        var _this = this;
        this._selectedPlacesService.selectionChanged$.subscribe(function (updatedPlaces) { return _this.onSelectedPlacesChanged(updatedPlaces); });
        this._selectedPlacesService.load();
        if (this.selectedPlaces.length > 0) {
            for (var x = 0; x < this.selectedPlaces.length; x++) {
                this.addPlace(this.selectedPlaces[x]);
            }
        }
        else {
            this.addPlaceCompare(this.selectedPlaceType);
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], PlacesMapSelect.prototype, "selectedPlaceType", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PlacesMapSelect.prototype, "viewType", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], PlacesMapSelect.prototype, "selectedPlaces", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], PlacesMapSelect.prototype, "selPlacesEvt", void 0);
    PlacesMapSelect = __decorate([
        core_1.Component({
            selector: 'places-map-select',
            templateUrl: './shared/components/places/places-map-select.html',
            styleUrls: ['./shared/components/places/places-map-select.css'],
            providers: [http_1.JSONP_PROVIDERS, places_service_1.SearchPlacesService],
            directives: [common_1.CORE_DIRECTIVES, map_component_1.MapComponent]
        }), 
        __metadata('design:paramtypes', [places_service_1.SearchPlacesService, selected_places_service_1.SelectedPlacesService])
    ], PlacesMapSelect);
    return PlacesMapSelect;
})();
exports.PlacesMapSelect = PlacesMapSelect;
