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
var Subject_1 = require('rxjs/Subject');
var Rx_1 = require('rxjs/Rx');
var initialState = [];
var GeoJSONStoreService = (function () {
    function GeoJSONStoreService() {
        this.selectionChanged$ = new Rx_1.ReplaySubject(1);
        this.updates = new Subject_1.Subject();
        this.addLayer = new Subject_1.Subject();
        this.getAll = new Subject_1.Subject();
        this.updates
            .scan(function (accumulator, operation) {
            return operation(accumulator);
        }, initialState)
            .subscribe(this.selectionChanged$);
        this.addLayer
            .map(function (layer) {
            return function (state) { return state.concat(layer); };
        })
            .subscribe(this.updates);
        this.getAll
            .map(function () {
            return function (state) {
                return state.map(function (eachPlace) {
                    return eachPlace;
                });
            };
        })
            .subscribe(this.updates);
    }
    GeoJSONStoreService.prototype.load = function () {
    };
    GeoJSONStoreService.prototype.add = function (layer) {
        console.log('adding layer to geojsonstore');
        this.addLayer.next(layer);
    };
    GeoJSONStoreService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], GeoJSONStoreService);
    return GeoJSONStoreService;
})();
exports.GeoJSONStoreService = GeoJSONStoreService;
//# sourceMappingURL=geojson_store.service.js.map