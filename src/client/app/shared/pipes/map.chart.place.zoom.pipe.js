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
var MapChartPlaceZoomPipe = (function () {
    function MapChartPlaceZoomPipe() {
    }
    MapChartPlaceZoomPipe.prototype.transform = function (places, selectedPlaceType) {
        var _this = this;
        console.log('pipecheck', places, selectedPlaceType);
        return places.filter(function (place) { return place.placeType === _this.translatePlaceTypes(selectedPlaceType); });
    };
    MapChartPlaceZoomPipe.prototype.translatePlaceTypes = function (placeType) {
        var returnPT = placeType;
        switch (placeType) {
            case 'County':
            case 'Counties':
            case 'State':
                returnPT = 'Counties';
                break;
            case 'Census Designated Place':
            case 'Incorporated City':
            case 'Incorporated Town':
            case 'City':
            case 'Cities':
            case 'Places':
                returnPT = 'Places';
                break;
            case 'Census Tract':
            case 'Census Tracts':
            case 'Unincorporated Place':
                returnPT = 'Tracts';
                break;
            default:
                break;
        }
        return returnPT;
    };
    MapChartPlaceZoomPipe = __decorate([
        core_1.Pipe({
            name: 'mapChartPlaceZoomPipe'
        }), 
        __metadata('design:paramtypes', [])
    ], MapChartPlaceZoomPipe);
    return MapChartPlaceZoomPipe;
})();
exports.MapChartPlaceZoomPipe = MapChartPlaceZoomPipe;
//# sourceMappingURL=map.chart.place.zoom.pipe.js.map