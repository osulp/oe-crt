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
var SearchTopicsPlacesService = (function () {
    function SearchTopicsPlacesService(jsonp) {
        this.jsonp = jsonp;
    }
    SearchTopicsPlacesService.prototype.search = function (term, filter) {
        console.log('search service: ', term, filter);
        var serviceUrl = 'https://oe.oregonexplorer.info/rural/crt_rest_api/search';
        var params = new http_1.URLSearchParams();
        params.set('term', term);
        if (filter) {
            params.set('filter', filter);
        }
        params.set('f', 'json');
        params.set('callback', 'JSONP_CALLBACK');
        return this.jsonp
            .get(serviceUrl, { search: params })
            .map(function (request) { return request.json(); });
    };
    SearchTopicsPlacesService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Jsonp])
    ], SearchTopicsPlacesService);
    return SearchTopicsPlacesService;
})();
exports.SearchTopicsPlacesService = SearchTopicsPlacesService;
//# sourceMappingURL=search.service.js.map