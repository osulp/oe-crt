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
var index_1 = require('../../shared/components/index');
var PlacesWrapperComponent = (function () {
    function PlacesWrapperComponent() {
        this.urlPlaces = [];
    }
    PlacesWrapperComponent.prototype.getClass = function () {
        return this.selectedPlaceType === 'CountiesCitiesTracts' ? 'glyphicon glyphicon-menu-up' : 'glyphicon glyphicon-menu-down';
    };
    PlacesWrapperComponent.prototype.toggleSelection = function (tab) {
        this.selectedPlaceType = tab;
        if (tab === 'CountiesCitiesTracts') {
            this.placeMap.leafletMap.refreshMap();
        }
    };
    PlacesWrapperComponent.prototype.ngOnInit = function () {
        console.log('loaded explore places component');
        this.selectedPlaceType = 'Oregon';
        var urlQueryString = document.location.search;
        var keyRegex = new RegExp('([\?&])places([^&]*|[^,]*)');
        if (urlQueryString.match(keyRegex) !== null) {
            var temp = urlQueryString.match(keyRegex)[0];
            var tempPlaces = temp.replace(new RegExp('([\?&])places='), '').split(',');
            var isOregon = false;
            var isCalifornia = false;
            var hasNotStatewide = false;
            for (var x = 0; x < tempPlaces.length; x++) {
                var place = JSON.parse(decodeURIComponent(tempPlaces[x]));
                this.urlPlaces.push(place);
                switch (place.ResID) {
                    case '41':
                        isOregon = true;
                        break;
                    case '06':
                        isCalifornia = true;
                        break;
                    default:
                        hasNotStatewide = true;
                        break;
                }
            }
            this.selectedPlaceType = hasNotStatewide ? 'CountiesCitiesTracts' : (isOregon ? 'Oregon' : 'California');
        }
    };
    __decorate([
        core_1.ViewChild(index_1.PlacesMapSelectComponent), 
        __metadata('design:type', index_1.PlacesMapSelectComponent)
    ], PlacesWrapperComponent.prototype, "placeMap", void 0);
    PlacesWrapperComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'places',
            templateUrl: 'places.wrapper.component.html',
            styleUrls: ['places.wrapper.component.css'],
            directives: [index_1.PlacesMapSelectComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], PlacesWrapperComponent);
    return PlacesWrapperComponent;
})();
exports.PlacesWrapperComponent = PlacesWrapperComponent;
//# sourceMappingURL=places.wrapper.component.js.map