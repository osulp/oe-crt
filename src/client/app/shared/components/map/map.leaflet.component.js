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
var MapLeafletComponent = (function () {
    function MapLeafletComponent() {
    }
    MapLeafletComponent.prototype.loadMap = function () {
        this.map = L.map('map', {
            center: [45, -122],
            zoom: 5
        });
        L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
        }).addTo(this.map);
        L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
        }).addTo(this.map);
    };
    MapLeafletComponent.prototype.ngOnInit = function () {
        try {
            this.loadMap();
        }
        catch (ex) {
            console.log(ex);
            this.loadMap();
        }
    };
    MapLeafletComponent.prototype.refreshMap = function () {
        window.dispatchEvent(new Event('resize'));
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MapLeafletComponent.prototype, "options", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], MapLeafletComponent.prototype, "isVisible", void 0);
    MapLeafletComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'leaflet-map',
            templateUrl: 'map.leaflet.component.html',
            styleUrls: ['map.leaflet.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], MapLeafletComponent);
    return MapLeafletComponent;
})();
exports.MapLeafletComponent = MapLeafletComponent;
//# sourceMappingURL=map.leaflet.component.js.map