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
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
var GetGeoJSONService = (function () {
    function GetGeoJSONService(jsonp, http) {
        this.jsonp = jsonp;
        this.http = http;
    }
    GetGeoJSONService.prototype.getByPlaceType = function (placeType, years) {
        var observables = [];
        if (placeType === 'oregon_siskiyou_boundary') {
            observables.push(this.http.get('./assets/geojson/oregon_siskiyou_boundary.json').map(function (res) { return res.json(); }));
        }
        else {
            var geoyears = years[placeType];
            for (var _i = 0; _i < geoyears.length; _i++) {
                var year = geoyears[_i];
                observables.push(this.http.get('./assets/geojson/' + placeType.toLowerCase() + '_' + year.Year + '.json').map(function (res) { return res.json(); }));
            }
        }
        return Observable_1.Observable.forkJoin(observables);
    };
    GetGeoJSONService.prototype.load = function (placeType, mostRecent) {
        var observables = [];
        var serviceUrl = 'http://oe.oregonexplorer.info/rural/crt_rest_api/geojson';
        for (var p = 0; p < placeType.length; p++) {
            var params = new http_1.URLSearchParams();
            params.set('f', 'json');
            params.set('placeType', placeType[p]);
            params.set('callback', 'JSONP_CALLBACK');
            observables.push(this.jsonp
                .get(serviceUrl, { search: params })
                .map(function (request) { return request.json(); }));
        }
        return Observable_1.Observable.forkJoin(observables);
    };
    GetGeoJSONService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Jsonp, http_1.Http])
    ], GetGeoJSONService);
    return GetGeoJSONService;
})();
exports.GetGeoJSONService = GetGeoJSONService;
//# sourceMappingURL=geojson.service.js.map