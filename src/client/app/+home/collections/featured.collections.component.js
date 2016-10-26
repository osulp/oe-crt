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
var router_1 = require('@angular/router');
var http_1 = require('@angular/http');
var collections_service_1 = require('../../shared/services/collections/collections.service');
require('rxjs/add/operator/map');
var FeaturedCollectionsComponent = (function () {
    function FeaturedCollectionsComponent(_collectionsService) {
        this._collectionsService = _collectionsService;
    }
    FeaturedCollectionsComponent.prototype.search = function (term) {
        this.items = this._collectionsService.get();
    };
    FeaturedCollectionsComponent.prototype.gotoCollection = function (collection) {
        window.location.href = './Explore;collection=' + collection;
    };
    FeaturedCollectionsComponent.prototype.ngOnInit = function () {
        this.search('');
    };
    FeaturedCollectionsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'featured-collections',
            templateUrl: 'featured.collections.component.html',
            styleUrls: ['featured.collections.component.css'],
            providers: [http_1.JSONP_PROVIDERS, collections_service_1.CollectionsService],
            directives: [router_1.ROUTER_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [collections_service_1.CollectionsService])
    ], FeaturedCollectionsComponent);
    return FeaturedCollectionsComponent;
})();
exports.FeaturedCollectionsComponent = FeaturedCollectionsComponent;
//# sourceMappingURL=featured.collections.component.js.map