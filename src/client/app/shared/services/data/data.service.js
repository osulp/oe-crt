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
var DataService = (function () {
    function DataService(jsonp) {
        this.jsonp = jsonp;
    }
    DataService.prototype.get = function (geoids, indicators) {
        var serviceUrl = 'http://oe.oregonexplorer.info/rural/crt_rest_api/communityData';
        var params = new http_1.URLSearchParams();
        params.set('geoids', geoids);
        params.set('indicators', indicators);
        params.set('f', 'json');
        params.set('callback', 'JSONP_CALLBACK');
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map(function (request) { return request.json(); });
    };
    DataService.prototype.getAllbyGeoType = function (geoType, indicator) {
        console.log('GETTING ALL BY GEOTYPE', geoType, indicator);
        if (geoType === 'Schools') {
            var serviceUrl = 'http://oe.oregonexplorer.info/rural/crt_rest_api/schools';
            var params = new http_1.URLSearchParams();
            params.set('schooldistrict', '1');
            params.set('indicator', indicator);
            params.set('schooldists', 'all');
            params.set('f', 'json');
            params.set('callback', 'JSONP_CALLBACK');
            return this.jsonp
                .get(serviceUrl, { search: params })
                .map(function (request) { return request.json(); });
        }
        else {
            var serviceUrl = 'http://oe.oregonexplorer.info/rural/crt_rest_api/communityData';
            var params = new http_1.URLSearchParams();
            params.set('geoType', geoType);
            params.set('indicator', indicator);
            params.set('f', 'json');
            params.set('callback', 'JSONP_CALLBACK');
            return this.jsonp
                .get(serviceUrl, { search: params })
                .map(function (request) { return request.json(); });
        }
    };
    DataService.prototype.getIndicatorDataWithMetadata = function (geoids, geonames, indicator) {
        var serviceUrl = 'http://oe.oregonexplorer.info/rural/crt_rest_api/communityData';
        var params = new http_1.URLSearchParams();
        params.set('viewType', 'basic');
        params.set('indicator', indicator);
        params.set('geoids', geoids);
        params.set('geonames', geonames);
        params.set('f', 'json');
        params.set('callback', 'JSONP_CALLBACK');
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map(function (request) { return request.json(); });
    };
    DataService.prototype.getIndicatorDetailDataWithMetadata = function (geoids, indicator) {
        var serviceUrl = 'http://oe.oregonexplorer.info/rural/crt_rest_api/communityData';
        var params = new http_1.URLSearchParams();
        params.set('viewType', 'combined');
        params.set('indicator', indicator);
        params.set('geoids', geoids);
        params.set('f', 'json');
        params.set('callback', 'JSONP_CALLBACK');
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map(function (request) { return request.json(); });
    };
    DataService.prototype.getIndicatorDataWithMetadataBatch = function (geoids, indicators) {
        var _this = this;
        var observables = [];
        indicators.forEach(function (indicator) {
            var serviceUrl = 'http://oe.oregonexplorer.info/rural/crt_rest_api/communityData';
            var params = new http_1.URLSearchParams();
            params.set('viewType', 'basic');
            params.set('indicator', indicator.indicator.replace(/\+/g, '%2B').replace(/\&/g, '%26').replace(/\=/g, '%3D'));
            params.set('geoids', geoids);
            params.set('geonames', '');
            params.set('f', 'json');
            params.set('callback', 'JSONP_CALLBACK');
            observables.push(_this.jsonp
                .get(serviceUrl, { search: params })
                .map(function (request) { return request.json(); }));
        });
        return Observable_1.Observable.forkJoin(observables);
    };
    DataService.prototype.getSchoolDistrictData = function (school_districts, indicator, counties, cts) {
        var serviceUrl = 'http://oe.oregonexplorer.info/rural/crt_rest_api/schools';
        var params = new http_1.URLSearchParams();
        params.set('schooldistrict', '1');
        params.set('indicator', indicator);
        params.set('schooldists', school_districts);
        params.set('counties', counties);
        params.set('cts', cts);
        params.set('f', 'json');
        params.set('callback', 'JSONP_CALLBACK');
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map(function (request) { return request.json(); });
    };
    DataService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Jsonp])
    ], DataService);
    return DataService;
})();
exports.DataService = DataService;
//# sourceMappingURL=data.service.js.map