var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var Subject_1 = require('rxjs/Subject');
var Rx_1 = require('rxjs/Rx');
var initialState = [];
var SelectedPlacesService = (function () {
    function SelectedPlacesService() {
        this.selectionChanged$ = new Rx_1.ReplaySubject(1);
        this.updates = new Subject_1.Subject();
        this.addPlace = new Subject_1.Subject();
        this.removePlace = new Subject_1.Subject();
        this.getAll = new Subject_1.Subject();
        this.updates
            .scan(function (accumulator, operation) {
            return operation(accumulator);
        }, initialState)
            .subscribe(this.selectionChanged$);
        this.addPlace
            .map(function (place) {
            return function (state) { return state.concat(place); };
        })
            .subscribe(this.updates);
        this.removePlace
            .map(function (place) {
            return function (state) {
                return state.filter(function (places) {
                    return places.Name !== place;
                });
            };
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
    SelectedPlacesService.prototype.load = function () {
    };
    SelectedPlacesService.prototype.add = function (place) {
        console.log('adding place to selectedPlaces');
        this.addPlace.next(place);
    };
    SelectedPlacesService.prototype.remove = function (place) {
        console.log('removing place from selectedPlaces');
        this.removePlace.next(place.Name);
    };
    SelectedPlacesService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], SelectedPlacesService);
    return SelectedPlacesService;
})();
exports.SelectedPlacesService = SelectedPlacesService;
//# sourceMappingURL=selected-places.service.js.map