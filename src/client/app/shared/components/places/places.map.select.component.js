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
var common_1 = require('@angular/common');
var http_1 = require('@angular/http');
var ng2_dragula_1 = require('ng2-dragula/ng2-dragula');
var ng2_dragula_2 = require('ng2-dragula/ng2-dragula');
var map_leaflet_component_1 = require('../../components/map/map.leaflet.component');
var index_1 = require('../../services/index');
require('rxjs/add/operator/map');
require('rxjs/add/operator/debounceTime');
require('rxjs/add/operator/distinctUntilChanged');
require('rxjs/add/operator/switchMap');
require('rxjs/add/operator/share');
var PlacesMapSelectComponent = (function () {
    function PlacesMapSelectComponent(_searchPlaceService, _selectedPlacesService, dragulaService) {
        var _this = this;
        this._searchPlaceService = _searchPlaceService;
        this._selectedPlacesService = _selectedPlacesService;
        this.selPlacesEvt = new core_1.EventEmitter();
        this.term = new common_1.Control();
        this.customSetCounter = 1;
        this.mapOptions = null;
        dragulaService.drop.subscribe(function (value) {
            console.log("drop: " + value[0]);
            _this.onDrop(value.slice(1));
        });
        dragulaService.over.subscribe(function (value) {
            console.log("over: " + value[0]);
            _this.onOver(value.slice(1));
        });
        dragulaService.out.subscribe(function (value) {
            console.log("out: " + value[0]);
            _this.onOut(value.slice(1));
        });
        this.searchResults = this.term.valueChanges
            .debounceTime(200)
            .distinctUntilChanged()
            .switchMap(function (term) { return _this._searchPlaceService.search(term !== undefined ? term.toString() : ''); })
            .share();
        this.searchResults.subscribe(function (value) { return _this.tempResults = value; });
        this.selectedSearchResults = [];
    }
    PlacesMapSelectComponent.prototype.onDrop = function (args) {
        this.setPlaceBinGroups(args[0], true);
        console.log('on drop', args);
        if (args[2] === null) {
            return;
        }
    };
    PlacesMapSelectComponent.prototype.onOver = function (args) {
        this.setPlaceBinGroups(args[0]);
    };
    PlacesMapSelectComponent.prototype.onOut = function (args) {
        console.log('on out', args);
        this.setPlaceBinGroups(args[0]);
        if (args[2].children.length > 0) {
            this.setPlaceBinGroups(args[2].children[0]);
        }
    };
    PlacesMapSelectComponent.prototype.onCombineLabelKeyPress = function (evt, dragBin, placeContainer, inpPlace) {
        if (evt.keyCode === 13 || evt.keyCode === 9) {
            this.updateCustomSetName(dragBin, placeContainer, inpPlace);
        }
    };
    PlacesMapSelectComponent.prototype.setPlaceBinGroups = function (e, update) {
        if (e.parentNode !== undefined) {
            var updatePlaces = [];
            var combine = false;
            for (var i = 0; i < e.parentNode.children.length; i++) {
                if (e.parentNode.children.length === 1) {
                    e.parentNode.parentNode.parentNode.setAttribute('editView', 'false');
                }
                else {
                    combine = true;
                    e.parentNode.parentNode.parentNode.setAttribute('editView', 'true');
                }
                this.selectedSearchResults.forEach(function (place) {
                    if (place.ResID === e.parentNode.children[i].getAttribute('placeresid') && place.Name === e.parentNode.children[i].getAttribute('placename')) {
                        updatePlaces.push(place);
                    }
                });
            }
            if (update) {
                this._selectedPlacesService.updatePlaceGroupNames(updatePlaces, e.parentNode.getAttribute('groupname'), combine);
            }
        }
    };
    PlacesMapSelectComponent.prototype.updateCustomSetName = function (dragBin, placeContainer, inpPlace) {
        var placesInBin = dragBin.getElementsByClassName('place-bin');
        var updatePlaces = [];
        for (var _i = 0; _i < placesInBin.length; _i++) {
            var binP = placesInBin[_i];
            this.selectedSearchResults.forEach(function (place) {
                if (place.ResID === binP.getAttribute('placeresid') && place.Name === binP.getAttribute('placename')) {
                    updatePlaces.push(place);
                }
            });
        }
        this._selectedPlacesService.updatePlaceGroupNames(updatePlaces, inpPlace.value, true);
        placeContainer.setAttribute('editView', 'false');
    };
    PlacesMapSelectComponent.prototype.inputSearchClickHandler = function (event, result) {
        this.term.updateValue('', { emitEvent: true, emitModelToViewChange: true });
        this.searchTerms = '';
    };
    PlacesMapSelectComponent.prototype.setClasses = function (suffix) {
        var sReturn = '';
        switch (suffix) {
            case 'MapCol':
                sReturn += this.viewType === 'explore' ? 'col-lg-7 col-md-7 col-xs-12 ' : 'col-xs-12 ';
                break;
            case 'FindCombComp':
                sReturn += this.viewType === 'explore' ? 'col-lg-5 col-md-5 col-xs-12 ' : '';
                break;
            default:
                break;
        }
        return (this.viewType === 'explore' ? 'explore' : 'indicatorDetail') + suffix + sReturn;
    };
    PlacesMapSelectComponent.prototype.inputKeypressHandler = function (event, result) {
        if (event.keyCode === 13) {
            if (result !== undefined) {
                this.addPlace(result);
            }
            else {
                if (this.tempResults.length > 0) {
                    var firstItem = this.tempResults[0];
                    var selected = {
                        Name: firstItem['Name'].replace(/\,/g, '%2C'),
                        ResID: firstItem['ResID'],
                        Type: firstItem['Type'],
                        TypeCategory: firstItem['TypeCategory'],
                        Desc: firstItem['Desc']
                    };
                    this.addPlace(selected);
                }
            }
            if (this.tempResults.length === 0) {
                alert('Please select a valid search term.');
            }
            this.searchTerms = '';
        }
    };
    PlacesMapSelectComponent.prototype.clickedSearchResult = function (event, result) {
        this.addPlace(result);
        this.searchTerms = '';
    };
    PlacesMapSelectComponent.prototype.blurHandler = function (event) {
        var searchScope = this;
        setTimeout(function () {
            if (document.activeElement.classList.toString() === 'list-group-item') {
                var attr = 'data-search-item';
                var listItem = JSON.parse(document.activeElement.attributes[attr].value);
                var selected = {
                    Name: listItem.Name.replace(/\,/g, '%2C'),
                    ResID: listItem.ResID,
                    Type: listItem.Type,
                    TypeCategory: listItem.TypeCategory,
                    Desc: listItem.Desc
                };
                searchScope.addPlace(selected);
            }
            else if (document.activeElement.id === 'explore-btn') {
                if (searchScope.tempResults.length > 0) {
                    var firstItem = searchScope.tempResults[0];
                    var selected = {
                        Name: firstItem['Name'].replace(/\,/g, '%2C'),
                        ResID: firstItem['ResID'],
                        Type: firstItem['Type'],
                        TypeCategory: firstItem['TypeCategory'],
                        Desc: firstItem['Desc']
                    };
                    searchScope.addPlace(selected);
                }
                else {
                    alert('Please select a valid search term.');
                }
            }
            else {
                searchScope.term.updateValue('', { emitEvent: true, emitModelToViewChange: true });
                searchScope.searchTerms = '';
            }
        }, 1);
    };
    PlacesMapSelectComponent.prototype.removePlace = function (place, placeBin, dragBin, panelContainer) {
        var indexPlace = this.selectedSearchResults.indexOf(place);
        this.selectedSearchResults.splice(indexPlace, 1);
        this.selPlacesEvt.emit(this.selectedSearchResults);
        console.log('removing place', place);
        if (place.Combined) {
            console.log('place combined and chekcing dragbin', dragBin);
            console.log(dragBin.getElementsByClassName('place-bin'));
            if (dragBin.getElementsByClassName('place-bin').length === 2) {
            }
        }
        this._selectedPlacesService.remove(place);
    };
    PlacesMapSelectComponent.prototype.addPlace = function (place) {
        place.Desc = '';
        var indexPos = this.selectedSearchResults.map(function (e) { return e.Name.trim().replace(' County', ''); }).indexOf(place.Name.trim().replace(' County', ''));
        if (indexPos === -1) {
            this.selectedSearchResults.push(place);
            this.selPlacesEvt.emit(this.selectedSearchResults);
            this._selectedPlacesService.add(place, 'map');
        }
    };
    PlacesMapSelectComponent.prototype.addPlaceCompare = function (compareType) {
        var compareResult = {
            Name: compareType !== 'Oregon' ? compareType + ' Oregon' : compareType,
            ResID: compareType === 'Oregon' ? '41' : compareType === 'Rural' ? '41r' : '41u',
            Type: compareType,
            TypeCategory: 'State',
            Desc: compareType
        };
        var indexPos = this.selectedSearchResults.map(function (e) { return e.Name; }).indexOf(compareType);
        if (indexPos === -1) {
            this.selectedSearchResults.push(compareResult);
            this.selPlacesEvt.emit(this.selectedSearchResults);
            this._selectedPlacesService.add(compareResult, 'map');
        }
    };
    PlacesMapSelectComponent.prototype.onPlaceSelectedMap = function (place) {
        this.addPlace(place);
    };
    PlacesMapSelectComponent.prototype.onSelectedPlacesChanged = function (places) {
        console.log('this one gets it', places);
        this.selectedSearchResults = [];
        var uniquePlaces = places.filter(function (place, index, self) { return self.findIndex(function (t) { return t.ResID === place.ResID && t.Name === place.Name; }) === index; });
        for (var _i = 0; _i < uniquePlaces.length; _i++) {
            var place = uniquePlaces[_i];
            this.selectedSearchResults.push(place);
        }
        console.log('unique places', this.selectedSearchResults);
        var runScope = this;
        var runInterval = setInterval(runCheck, 50);
        function runCheck() {
            var combinedGroups = runScope.checkCombineGroups().groupName;
            combinedGroups.forEach(function (gn, idx) {
                console.log('Here is a group, need to be binned', gn);
                var dragBins = document.getElementsByClassName('dragBin');
                var processedGroups = [];
                for (var db = 0; db < dragBins.length; db++) {
                    console.log('dragbin processing', dragBins[db]);
                    console.log('processed groups', processedGroups);
                    var dBsToRemove = [];
                    if (dragBins[db].getAttribute('groupname') === gn && processedGroups.indexOf(gn) === -1) {
                        console.log('group to process!', gn);
                        for (var db1 = 0; db1 < dragBins.length; db1++) {
                            if (db1 !== db && dragBins[db1].getAttribute('groupname') === gn) {
                                var placeBin = dragBins[db1].getElementsByClassName('place-bin');
                                console.log('place bin to append', placeBin, dragBins[db]);
                                for (var pb = 0; pb < placeBin.length; pb++) {
                                    if (placeBin[pb].getAttribute('combined') === 'true') {
                                        console.log('appending place', placeBin[pb]);
                                        dBsToRemove.push(dragBins[db1]);
                                    }
                                }
                            }
                        }
                        processedGroups.push(gn);
                    }
                    console.log('dbstoremove', dBsToRemove);
                    dBsToRemove.forEach(function (dbr) {
                        console.log(dbr);
                    });
                }
                console.log('All the dragBins', dragBins);
            });
            clearInterval(runInterval);
        }
    };
    PlacesMapSelectComponent.prototype.checkCombineGroups = function () {
        var _this = this;
        var combineArray = [];
        var groupNames = [];
        this.selectedSearchResults.forEach(function (place) {
            if (place.GroupName !== undefined) {
                if (groupNames.indexOf(place.GroupName) === -1) {
                    groupNames.push(place.GroupName);
                }
            }
        });
        console.log('GroupNames', groupNames);
        groupNames.forEach(function (gn, idx) {
            var groupArray = [];
            if (gn !== '') {
                _this.selectedSearchResults.forEach(function (place) {
                    if (place.GroupName === gn) {
                        groupArray.push(place);
                    }
                });
                if (idx === groupNames.length - 1 && groupArray.length > 1) {
                    combineArray.push(groupArray);
                }
            }
        });
        console.log('combined array', combineArray);
        return { 'groupName': groupNames, 'combineArray': combineArray };
    };
    PlacesMapSelectComponent.prototype.onMapLoad = function (response) {
    };
    PlacesMapSelectComponent.prototype.translatePlaceTypes = function (placeType, placeName) {
        var modPT = placeType;
        switch (placeType) {
            case 'County':
            case 'Counties':
                modPT = 'Counties';
                break;
            case 'Census Designated Place':
            case 'Incorporated City':
            case 'Incorporated Town':
            case 'City':
            case 'Cities':
                modPT = 'Places';
                break;
            case 'Census Tract':
            case 'Census Tracts':
            case 'Unicorporated Place':
                modPT = 'Tracts';
                break;
            default:
                modPT = placeType;
                break;
        }
        if (placeName) {
            modPT += placeName.replace(/\ /g, '');
        }
        return modPT;
    };
    PlacesMapSelectComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._selectedPlacesService.selectionChanged$.subscribe(function (updatedPlaces) { return _this.onSelectedPlacesChanged(updatedPlaces); });
        this._selectedPlacesService.load();
        if (this.selectedPlaces.length > 0) {
            for (var x = 0; x < this.selectedPlaces.length; x++) {
                this.addPlace(this.selectedPlaces[x]);
            }
        }
        else {
            this.addPlaceCompare(this.selectedPlaceType);
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], PlacesMapSelectComponent.prototype, "selectedPlaceType", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PlacesMapSelectComponent.prototype, "viewType", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], PlacesMapSelectComponent.prototype, "selectedPlaces", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], PlacesMapSelectComponent.prototype, "isVisible", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], PlacesMapSelectComponent.prototype, "selPlacesEvt", void 0);
    __decorate([
        core_1.ViewChild(map_leaflet_component_1.MapLeafletComponent), 
        __metadata('design:type', map_leaflet_component_1.MapLeafletComponent)
    ], PlacesMapSelectComponent.prototype, "leafletMap", void 0);
    PlacesMapSelectComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'places-map-select',
            templateUrl: 'places.map.select.component.html',
            styleUrls: ['places.map.select.component.css'],
            providers: [http_1.JSONP_PROVIDERS, index_1.SearchPlacesService],
            viewProviders: [ng2_dragula_2.DragulaService],
            directives: [
                common_1.CORE_DIRECTIVES,
                map_leaflet_component_1.MapLeafletComponent,
                ng2_dragula_1.Dragula
            ]
        }), 
        __metadata('design:paramtypes', [index_1.SearchPlacesService, index_1.SelectedPlacesService, ng2_dragula_2.DragulaService])
    ], PlacesMapSelectComponent);
    return PlacesMapSelectComponent;
})();
exports.PlacesMapSelectComponent = PlacesMapSelectComponent;
//# sourceMappingURL=places.map.select.component.js.map