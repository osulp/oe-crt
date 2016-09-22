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
var index_1 = require('../../shared/services/indicators/index');
var index_2 = require('../../shared/components/data_tile/index');
var http_1 = require('@angular/http');
var FeaturedDataComponent = (function () {
    function FeaturedDataComponent(_featuredIndicatorService) {
        this._featuredIndicatorService = _featuredIndicatorService;
        this.featuredIndicators = [];
    }
    FeaturedDataComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._featuredIndicatorService.getFeaturedIndicators().subscribe(function (featInd) {
            console.log('featuredIndicators', featInd);
            _this.featuredIndicators = featInd;
        });
    };
    FeaturedDataComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'featured-data',
            templateUrl: 'featured.data.component.html',
            styleUrls: ['featured.data.component.css'],
            providers: [index_1.FeaturedIndicatorsService, http_1.JSONP_PROVIDERS],
            directives: [index_2.DataTileComponent]
        }), 
        __metadata('design:paramtypes', [index_1.FeaturedIndicatorsService])
    ], FeaturedDataComponent);
    return FeaturedDataComponent;
})();
exports.FeaturedDataComponent = FeaturedDataComponent;
//# sourceMappingURL=featured.data.component.js.map