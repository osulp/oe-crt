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
var http_1 = require('@angular/http');
var Rx_1 = require('rxjs/Rx');
var Observable_1 = require('rxjs/Observable');
var initialState = [];
var SelectedPlacesService = (function () {
    function SelectedPlacesService(jsonp) {
        var _this = this;
        this.jsonp = jsonp;
        this.selectionChanged$ = new Rx_1.ReplaySubject(1);
        this.updates = new Subject_1.Subject();
        this.addPlace = new Subject_1.Subject();
        this.removePlace = new Subject_1.Subject();
        this.updatePlaces = new Subject_1.Subject();
        this._setAllByPlaceType = new Subject_1.Subject();
        this.getAll = new Subject_1.Subject();
        this.selectedPlaces = [];
        this.processing = false;
        this.processingQueue = [];
        this.intervalCount = 0;
        this.updates
            .scan(function (accumulator, operation) {
            return operation(accumulator);
        }, initialState)
            .subscribe(function (data) {
            _this.selectedPlaces = data;
            _this.selectionChanged$.next(data);
        });
        this.addPlace
            .map(function (args) {
            return function (state) {
                return state.concat(args[0]);
            };
        })
            .subscribe(this.updates);
        this.removePlace
            .map(function (place) {
            return function (state) {
                return state.filter(function (places) {
                    return places.Name.replace(' County', '') !== place.Name.replace(' County', '');
                })
                    .map(function (places) {
                    console.log('removing place from service', state, places, place);
                    if (!place.Combined) {
                        return places;
                    }
                    else {
                        if (places.GroupName === place.GroupName) {
                            var placeGroupName = state.filter(function (p) { return p.GroupName === place.GroupName && p.Name !== place.Name; });
                            console.log('selected place service, removing check for group name', placeGroupName);
                            if (placeGroupName.length === 1) {
                                var returnPlace = places;
                                delete returnPlace.GroupName;
                                delete returnPlace.Combined;
                                console.log('place with removed group name', returnPlace);
                                return returnPlace;
                            }
                            else {
                                return places;
                            }
                        }
                        else {
                            return places;
                        }
                    }
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
        this.updatePlaces
            .map(function (args) {
            return function (state) {
                console.log(args);
                var updatedPlaces = args[0];
                return state
                    .map(function (place) {
                    var isPlaceToUpdate = false;
                    updatedPlaces.forEach(function (up) {
                        isPlaceToUpdate = up.Name === place.Name && up.ResID === place.ResID ? true : isPlaceToUpdate;
                    });
                    if (isPlaceToUpdate) {
                        place.GroupName = args[2] ? args[1] : '';
                        place.Combined = args[2] ? true : false;
                    }
                    return place;
                });
            };
        })
            .subscribe(this.updates);
        this._setAllByPlaceType
            .map(function (args) {
            return function (state) {
                return state
                    .filter(function (places) {
                    return _this.translatePlaceTypes(places.TypeCategory) !== args[1];
                })
                    .concat(args[0]);
            };
        })
            .subscribe(this.updates);
    }
    SelectedPlacesService.prototype.load = function () {
    };
    SelectedPlacesService.prototype.add = function (place, source) {
        var _this = this;
        console.log('adding place to selectedPlaces', place);
        if (place.TypeCategory !== 'State') {
            this.getAdditionalPlaceInfo([place]).subscribe(function (pinfo) {
                var geoInfo = pinfo.filter(function (pi) {
                    return pi.length > 0 ?
                        pi[0].community ? pi[0].community.replace(' County', '').trim() === place.Name.replace(' County', '').trim() || pi[0].geoid === place.ResID
                            : false
                        : false;
                });
                place.GeoInfo = geoInfo.length > 0 ? geoInfo[0] : [];
                place.UpdateOnly = true;
                _this.addPlace.next([place, true]);
            });
            place.UpdateOnly = false;
        }
        else {
            place.UpdateOnly = true;
            place.GeoInfo = [];
            this.addPlace.next([place, false]);
        }
    };
    SelectedPlacesService.prototype.addPlaces = function (places) {
        var _this = this;
        console.log('adding multiple places to selectedPlaces', places);
        places = places.map(function (p) {
            p.UpdateOnly = p.TypeCategory === 'State';
            p.GeoInfo = [];
            return p;
        });
        this.getAdditionalPlaceInfo(places).subscribe(function (pinfo) {
            console.log('jumping frank', pinfo);
            places.forEach(function (place) {
                var geoInfo = pinfo.filter(function (pi) {
                    console.log('jumping susan', pi, place);
                    return pi.length > 0 ?
                        pi[0].community ? pi[0].community.replace(' County', '').trim() === place.Name.replace(' County', '').trim() || pi[0].geoid === place.ResID
                            : false
                        : false;
                });
                place.GeoInfo = geoInfo.length > 0 ? geoInfo[0] : [];
                place.UpdateOnly = true;
            });
            _this.addPlace.next([places, false]);
        });
    };
    SelectedPlacesService.prototype.getAdditionalPlaceInfo = function (place) {
        var _this = this;
        var observables = [];
        var serviceUrl = 'https://oe.oregonexplorer.info/rural/crt_rest_api/places';
        place.forEach(function (p) {
            var params = new http_1.URLSearchParams();
            params.set('place', p.Name);
            params.set('f', 'json');
            params.set('callback', 'JSONP_CALLBACK');
            var isStatewide = ['41', '06', '41r', '41u', '06r', '06u'].indexOf(p.ResID) !== -1;
            var selPlace = _this.selectedPlaces.filter(function (sp) { return sp.Name === p.Name || isStatewide; });
            if (isStatewide) {
                observables.push([p]);
            }
            else if (selPlace.length > 0 ? selPlace[0].GeoInfo.length > 0 : false) {
                observables.push([selPlace]);
            }
            else {
                observables.push(_this.jsonp
                    .get(serviceUrl, { search: params })
                    .map(function (request) { return request.json(); }));
            }
        });
        return Observable_1.Observable.forkJoin(observables);
    };
    SelectedPlacesService.prototype.remove = function (place) {
        console.log('removing place from selectedPlaces');
        console.log(place);
        this.removePlace.next(place);
    };
    SelectedPlacesService.prototype.setAllbyPlaceType = function (places, placeType, indicatorGeo) {
        var translatedPlaceType = this.translatePlaceTypes(placeType);
        console.log('set all by place type', placeType, places, indicatorGeo);
        if (places.length > 0) {
            if (placeType !== 'SchoolDistricts') {
                this.subScribeToGetAddionalPlaceInfo(places, placeType, indicatorGeo);
            }
            else {
                this._setAllByPlaceType.next([places, placeType]);
            }
        }
        else {
            this.processingQueue = [];
            this._setAllByPlaceType.next([places, translatedPlaceType]);
        }
    };
    SelectedPlacesService.prototype.subScribeToGetAddionalPlaceInfo = function (places, translatedPlaceType, indicatorGeo) {
        var _this = this;
        this.getAdditionalPlaceInfo(places).subscribe(function (pinfo) {
            console.log('jumping jack3', _this.processingQueue);
            _this.processingQueue.shift();
            console.log('jumping jack5', places);
            places.forEach(function (place) {
                if (place.GeoInfo.length === 0) {
                    var geoInfo = pinfo.filter(function (pi) {
                        console.log('jumping susan', pi, place);
                        if (pi.length > 0) {
                            if (pi[0].community) {
                                return pi.length > 0 ? pi[0].community.replace(' County', '').trim() === place.Name.replace(' County', '').trim() || pi[0].geoid === place.ResID
                                    : false;
                            }
                            else {
                                return false;
                            }
                        }
                        else {
                            return false;
                        }
                    });
                    place.GeoInfo = geoInfo.length > 0 ? geoInfo[0] : [];
                    place.UpdateOnly = true;
                }
            });
            _this.processing = false;
            _this._setAllByPlaceType.next([places, translatedPlaceType]);
        });
    };
    SelectedPlacesService.prototype.updatePlaceGroupNames = function (places, groupName, add) {
        this.updatePlaces.next([places, groupName, add]);
    };
    SelectedPlacesService.prototype.translatePlaceTypes = function (placeType) {
        switch (placeType) {
            case 'County':
            case 'Counties':
                return 'Counties';
            case 'Census Designated Place':
            case 'Incorporated City':
            case 'Incorporated Town':
            case 'City':
            case 'Cities':
            case 'Places':
                return 'Places';
            case 'Census Tract':
            case 'Census Tracts':
            case 'Unincorporated Place':
                return 'Tracts';
            default:
                return placeType;
        }
    };
    SelectedPlacesService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Jsonp])
    ], SelectedPlacesService);
    return SelectedPlacesService;
})();
exports.SelectedPlacesService = SelectedPlacesService;
//# sourceMappingURL=selected.places.service.js.map