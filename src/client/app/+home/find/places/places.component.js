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
var index_1 = require('../../../shared/components/index');
var router_1 = require('@angular/router');
var PlacesComponent = (function () {
    function PlacesComponent(elementRef, _router) {
        this.elementRef = elementRef;
        this._router = _router;
        this.isMobile = false;
        this.mapOptions = null;
        this.searchOptions = {
            enableButtonMode: true,
            enableLabel: false,
            enableInfoWindow: true,
            showInfoWindowOnSelect: false,
        };
    }
    PlacesComponent.prototype.onMapLoad = function (response) {
        console.log('MAP LOADEDED!!!!!');
    };
    PlacesComponent.prototype.onBasemapSelected = function (basemapName) {
    };
    PlacesComponent.prototype.goToExplorePlaces = function () {
        this._router.navigateByUrl('/Explore;show=Places');
    };
    PlacesComponent.prototype.ngOnInit = function () {
        this.isMobile = $(window).width() < 550;
    };
    PlacesComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'places',
            templateUrl: 'places.component.html',
            styleUrls: ['places.component.css'],
            directives: [index_1.MapLeafletComponent]
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, router_1.Router])
    ], PlacesComponent);
    return PlacesComponent;
})();
exports.PlacesComponent = PlacesComponent;
//# sourceMappingURL=places.component.js.map