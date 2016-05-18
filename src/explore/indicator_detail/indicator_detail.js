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
var http_1 = require('angular2/http');
var data_tile_1 = require('../../shared/components/data_tile/data-tile');
var indicator_desc_service_1 = require('../../shared/services/indicators/indicator.desc.service');
var selected_places_service_1 = require('../../shared/services/places/selected-places.service');
var highmap_selected_service_1 = require('../../shared/services/places/highmap-selected.service');
var selected_data_service_1 = require('../../shared/services/data/selected-data.service');
var places_map_select_1 = require('../../shared/components/places/places-map-select');
var DetailCmp = (function () {
    function DetailCmp(_indicatorDescService, _selectedDataService, _selectedPlacesService, _highmapSelectedService) {
        this._indicatorDescService = _indicatorDescService;
        this._selectedDataService = _selectedDataService;
        this._selectedPlacesService = _selectedPlacesService;
        this._highmapSelectedService = _highmapSelectedService;
        this.indicatorDesc = [];
        this.selectedPlaceType = 'Oregon';
        this.urlPlaces = [];
    }
    DetailCmp.prototype.ngOnInit = function () {
        var _this = this;
        this.showMap = true;
        this.showGraph = true;
        this.showTable = false;
        this.inputIndicator = decodeURI(this.inputIndicator).replace(/\%28/g, '(').replace(/\%29/g, ')');
        this._indicatorDescService.getIndicator(this.inputIndicator).subscribe(function (data) {
            _this.indicatorDesc = data;
            console.log(data);
        });
        this.selectedDataSubscription = this._selectedDataService.selectionChanged$.subscribe(function (data) {
            console.log('Community Data throwing event');
            console.log(data);
            _this.SelectedData = data[0];
        }, function (err) { return console.error(err); }, function () { return console.log('done with subscribe event places selected'); });
        this.selectedPlaceSubscription = this._selectedPlacesService.selectionChanged$.subscribe(function (data) {
            console.log('subscribe throwing event');
            console.log(data);
        }, function (err) { return console.error(err); }, function () { return console.log('done with subscribe event places selected'); });
        this.highmapSelectedSubscription = this._highmapSelectedService.selectionChanged$.subscribe(function (data) {
            console.log('highmap subscribe throwing event');
            console.log(data);
        }, function (err) { return console.error(err); }, function () { return console.log('done with subscribe event highmap selected'); });
        var urlQueryString = document.location.search;
        var keyRegex = new RegExp('([\?&])places([^&]*|[^,]*)');
        if (urlQueryString.match(keyRegex) !== null) {
            var temp = urlQueryString.match(keyRegex)[0];
            var tempPlaces = temp.replace(new RegExp('([\?&])places='), '').split(',');
            for (var x = 0; x < tempPlaces.length; x++) {
                var place = JSON.parse(decodeURIComponent(tempPlaces[x]));
                this.urlPlaces.push(place);
            }
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DetailCmp.prototype, "inputIndicator", void 0);
    DetailCmp = __decorate([
        core_1.Component({
            selector: 'indicator-detail',
            templateUrl: './explore/indicator_detail/indicator_detail.html',
            styleUrls: ['./explore/indicator_detail/indicator_detail.css'],
            providers: [http_1.JSONP_PROVIDERS, indicator_desc_service_1.IndicatorDescService, selected_data_service_1.SelectedDataService, selected_places_service_1.SelectedPlacesService, highmap_selected_service_1.HighmapSelectedService],
            directives: [places_map_select_1.PlacesMapSelect, data_tile_1.DataTileCmp]
        }), 
        __metadata('design:paramtypes', [indicator_desc_service_1.IndicatorDescService, selected_data_service_1.SelectedDataService, selected_places_service_1.SelectedPlacesService, highmap_selected_service_1.HighmapSelectedService])
    ], DetailCmp);
    return DetailCmp;
})();
exports.DetailCmp = DetailCmp;
