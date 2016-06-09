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
var router_1 = require('@angular/router');
var index_1 = require('../../shared/components/index');
var index_2 = require('../../shared/services/index');
var DetailComponent = (function () {
    function DetailComponent(_indicatorDescService, _router) {
        this._indicatorDescService = _indicatorDescService;
        this._router = _router;
        this.indicatorDesc = [];
        this.selectedPlaceType = 'Oregon';
        this.urlPlaces = [];
        this.visible = false;
        this.indInfo = 'desc';
        this.initialLoad = true;
    }
    DetailComponent.prototype.getClass = function () {
        return this.visible ? 'glyphicon glyphicon-menu-up' : 'glyphicon glyphicon-menu-down';
    };
    DetailComponent.prototype.toggleCommunitiesWrapper = function () {
        this.visible = !this.visible;
        if (this.initialLoad) {
            this.placeMap.leafletMap.refreshMap();
            this.initialLoad = false;
        }
    };
    DetailComponent.prototype.goBack = function () {
        this._router.navigate(['/Explore']);
        window.scrollTo(0, 0);
    };
    DetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.showMap = true;
        this.showGraph = true;
        this.showTable = false;
        this.inputIndicator = decodeURI(this.inputIndicator).replace(/\%28/g, '(').replace(/\%29/g, ')');
        this._indicatorDescService.getIndicator(this.inputIndicator).subscribe(function (data) {
            _this.indicatorDesc = data;
            console.log('indicatorDesc service', data);
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
    ], DetailComponent.prototype, "inputIndicator", void 0);
    __decorate([
        core_1.ViewChild(index_1.PlacesMapSelectComponent), 
        __metadata('design:type', index_1.PlacesMapSelectComponent)
    ], DetailComponent.prototype, "placeMap", void 0);
    DetailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'indicator-detail',
            templateUrl: 'indicator.detail.component.html',
            styleUrls: ['indicator.detail.component.css'],
            providers: [http_1.JSONP_PROVIDERS, index_2.IndicatorDescService],
            directives: [index_1.PlacesMapSelectComponent, index_1.DataTileComponent]
        }), 
        __metadata('design:paramtypes', [index_2.IndicatorDescService, router_1.Router])
    ], DetailComponent);
    return DetailComponent;
})();
exports.DetailComponent = DetailComponent;
//# sourceMappingURL=indicator.detail.component.js.map