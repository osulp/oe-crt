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
var places_map_select_1 = require('../../shared/components/places/places-map-select');
var DetailCmp = (function () {
    function DetailCmp(_indicatorDescService) {
        this._indicatorDescService = _indicatorDescService;
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
            providers: [http_1.JSONP_PROVIDERS, indicator_desc_service_1.IndicatorDescService],
            directives: [places_map_select_1.PlacesMapSelect, data_tile_1.DataTileCmp]
        }), 
        __metadata('design:paramtypes', [indicator_desc_service_1.IndicatorDescService])
    ], DetailCmp);
    return DetailCmp;
})();
exports.DetailCmp = DetailCmp;
