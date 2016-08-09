import {Component, Input, Output, ViewChild, EventEmitter, OnInit} from '@angular/core';
import {Control, CORE_DIRECTIVES} from '@angular/common';
//import {RouteParams} from 'angular2/router';
import {JSONP_PROVIDERS}  from '@angular/http';
//import {DND_DIRECTIVES} from 'ng2-dnd/ng2-dnd';
import {Dragula} from 'ng2-dragula/ng2-dragula';
import {DragulaService} from 'ng2-dragula/ng2-dragula';
import {MapLeafletComponent} from '../../components/map/map.leaflet.component';
//import {MapComponent} from '../../components/map/map.component';
import {SearchPlacesService, SelectedPlacesService} from '../../services/index';

import {SearchResult} from '../../data_models/index';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/share';

@Component({
    moduleId: module.id,
    selector: 'places-map-select',
    templateUrl: 'places.map.select.component.html',
    styleUrls: ['places.map.select.component.css'],
    providers: [JSONP_PROVIDERS, SearchPlacesService],
    viewProviders: [DragulaService],
    directives: [
        CORE_DIRECTIVES,
        MapLeafletComponent,
        //COMMON_DIRECTIVES,
        //DND_DIRECTIVES,
        Dragula
    ]
})

export class PlacesMapSelectComponent implements OnInit {
    @Input() selectedPlaceType: any;
    @Input() viewType: string;
    @Input() selectedPlaces: any;
    @Input() isVisible: boolean;
    @Output() selPlacesEvt = new EventEmitter();
    @ViewChild(MapLeafletComponent) leafletMap: MapLeafletComponent;
    term = new Control();
    searchTerms: string;
    selectedSearchResults: SearchResult[];
    selectedSearchResult: SearchResult;
    //selectedPlaces: string;
    tempResults: [{}];
    customSetCounter: number = 1;
    //searchResults: Observable<[{}]>;
    searchResults: Observable<any>;
    mapOptions: any = null;
    urlPlaces: any;

    constructor(
        private _searchPlaceService: SearchPlacesService,
        private _selectedPlacesService: SelectedPlacesService,
        dragulaService: DragulaService
    ) {
        ////setup dragNdrop for creating content
        //dragulaService.setOptions('bag-crt', {
        //    copy: false,
        //    copySortSource: false
        //});

        //dragulaService.drag.subscribe((value:any) => {
        //    console.log(`drag: ${value[0]}`);
        //    this.onDrag(value.slice(1));
        //});
        dragulaService.drop.subscribe((value: any) => {
            console.log(`drop: ${value[0]}`);
            this.onDrop(value.slice(1));
            //this.onDrop(value);
        });
        dragulaService.over.subscribe((value: any) => {
            console.log(`over: ${value[0]}`);
            this.onOver(value.slice(1));
            //this.onOver(value);
        });
        dragulaService.out.subscribe((value: any) => {
            console.log(`out: ${value[0]}`);
            this.onOut(value.slice(1));
        });

        this.searchResults = this.term.valueChanges
            .debounceTime(200)
            .distinctUntilChanged()
            .switchMap((term: any) => this._searchPlaceService.search(term !== undefined ? term.toString() : ''))
            .share();
        this.searchResults.subscribe(value => this.tempResults = value);
        //this._selectedPlacesService.selectionChanged$.subscribe();
        this.selectedSearchResults = [];
        //this.urlPlaces = this._routerParams.get('places');
    }

    //onDrag(args: any) {
    //    let [e, el] = args;
    //    console.log('on drag', args);
    //    this.setPlaceBinClasses(e);
    //    // do something
    //}

    onDrop(args: any) {
        //let [e, src, target] = args;
        this.setPlaceBinGroups(args[0],true);
        console.log('on drop', args);
        if (args[2] === null) {
            return;
        }
    }

    onOver(args: any) {
        //let [e, src, target] = args;
        //console.log('on over', e, src, target);
        this.setPlaceBinGroups(args[0]);
    }

    onOut(args: any) {
        //let [e, el, container] = args;
        console.log('on out', args);
        this.setPlaceBinGroups(args[0]);
        if (args[2].children.length > 0) {
            this.setPlaceBinGroups(args[2].children[0]);
        }

    }

    onCombineLabelKeyPress(evt: any, dragBin: any, placeContainer: any, inpPlace: any) {
        if (evt.keyCode === 13 || evt.keyCode === 9) {
            this.updateCustomSetName(dragBin, placeContainer, inpPlace);
        }
    }

    setPlaceBinGroups(e: any, update?: boolean) {
        if (e.parentNode !== undefined) {
            let updatePlaces: SearchResult[] = [];
            let combine: boolean = false;
            for (var i = 0; i < e.parentNode.children.length; i++) {
                if (e.parentNode.children.length === 1) {
                    //not combined
                    //var reg = new RegExp(' combinedPlaces', 'g');
                    //e.parentNode.children[i].className = e.parentNode.children[i].className.replace(reg, '');
                    e.parentNode.parentNode.parentNode.setAttribute('editView', 'false');
                    //find place and remove combined group attr
                } else {
                    //combined
                    combine = true;
                    //e.parentNode.children[i].className += ' combinedPlaces';
                    e.parentNode.parentNode.parentNode.setAttribute('editView', 'true');
                }
                this.selectedSearchResults.forEach((place: SearchResult) => {
                    if (place.ResID === e.parentNode.children[i].getAttribute('placeresid') && place.Name === e.parentNode.children[i].getAttribute('placename')) {
                        updatePlaces.push(place);
                    }
                });
            }
            if (update) {
                this._selectedPlacesService.updatePlaceGroupNames(updatePlaces, e.parentNode.getAttribute('groupname'), combine);
            }
        }
    }

    updateCustomSetName(dragBin: any, placeContainer: any, inpPlace: any) {
        //get all places in bin and update their group-name value
        let placesInBin = dragBin.getElementsByClassName('place-bin');
        let updatePlaces: SearchResult[] = [];
        for (var binP of placesInBin) {
            this.selectedSearchResults.forEach((place: SearchResult) => {
                if (place.ResID === binP.getAttribute('placeresid') && place.Name === binP.getAttribute('placename')) {
                    updatePlaces.push(place);
                }
            });
        }
        this._selectedPlacesService.updatePlaceGroupNames(updatePlaces, inpPlace.value, true);
        placeContainer.setAttribute('editView', 'false');
    }

    inputSearchClickHandler(event: any, result: SearchResult) {
        this.term.updateValue('', { emitEvent: true, emitModelToViewChange: true });
        this.searchTerms = '';
    }

    setClasses(suffix: string) {
        let sReturn: string = '';
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
    }

    inputKeypressHandler(event: any, result: SearchResult) {
        if (event.keyCode === 13) {
            //console.log(result);
            if (result !== undefined) {
                this.addPlace(result);
            } else {
                if (this.tempResults.length > 0) {
                    var firstItem: any = this.tempResults[0];
                    var selected: SearchResult = {
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
    }
    clickedSearchResult(event: any, result: SearchResult) {
        this.addPlace(result);
        this.searchTerms = '';
    }
    blurHandler(event: any) {
        var searchScope = this;
        setTimeout(function () {
            //if tabbing on list result set input box to match the Name property, but don't clear.
            if (document.activeElement.classList.toString() === 'list-group-item') {
                var attr: any = 'data-search-item';
                var listItem: any = JSON.parse(document.activeElement.attributes[attr].value);
                var selected: SearchResult = {
                    Name: listItem.Name.replace(/\,/g, '%2C'),
                    ResID: listItem.ResID,
                    Type: listItem.Type,
                    TypeCategory: listItem.TypeCategory,
                    Desc: listItem.Desc
                };
                searchScope.addPlace(selected);
                //if the Explore button then select the top result and go else put focus on the input
            } else if (document.activeElement.id === 'explore-btn') {
                //get tempResult values
                if (searchScope.tempResults.length > 0) {
                    var firstItem: any = searchScope.tempResults[0];
                    var selected: SearchResult = {
                        Name: firstItem['Name'].replace(/\,/g, '%2C'),
                        ResID: firstItem['ResID'],
                        Type: firstItem['Type'],
                        TypeCategory: firstItem['TypeCategory'],
                        Desc: firstItem['Desc']
                    };
                    searchScope.addPlace(selected);
                } else {
                    alert('Please select a valid search term.');
                }
            } else {
                searchScope.term.updateValue('', { emitEvent: true, emitModelToViewChange: true });
                searchScope.searchTerms = '';
            }
        }, 1);
        //event.preventDefault();
    }
    removePlace(place: SearchResult, placeBin?: any, dragBin?: any, panelContainer?: any) {
        var indexPlace = this.selectedSearchResults.indexOf(place);
        this.selectedSearchResults.splice(indexPlace, 1);
        //broadcast out to application
        this.selPlacesEvt.emit(this.selectedSearchResults);
        console.log('removing place', place);
        if (place.Combined) {
            //remove its dom node if empty
            console.log('place combined and chekcing dragbin', dragBin);
            console.log(dragBin.getElementsByClassName('place-bin'));
            if (dragBin.getElementsByClassName('place-bin').length === 2) {
                //means that removing one will leave only one in bin, needs to be uncombined
                //let unCombine = this.checkCombineGroups().combineArray.forEach((group: any[]) => {
                //    group.forEach((gplace: SearchResult) => {
                //        if (gplace.GroupName === place.GroupName && gplace.ResID !== place.ResID) {
                //            return gplace;
                //        }
                //    });
                //});
                //console.log('uncombine', unCombine);

                //panelContainer.parentElement.removeChild(panelContainer);
            }
        }
        this._selectedPlacesService.remove(place);
    }
    addPlace(place: SearchResult) {
        //check if already added
        var indexPos = this.selectedSearchResults.map(function (e) { return e.Name.trim().replace(' County', ''); }).indexOf(place.Name.trim().replace(' County', ''));
        if (indexPos === -1) {
            //this.selectedSearchResults.push(place);
            //this.selPlacesEvt.emit(this.selectedSearchResults);
            this._selectedPlacesService.add(place, 'map');
        }
    }

    addPlaceCompare(compareType: string) {
        var compareResult: SearchResult = {
            Name: compareType,
            ResID: compareType === 'Oregon' ? '41' : compareType === 'Rural' ? '41r' : '41u',
            Type: compareType,
            TypeCategory: 'State',
            Desc: compareType
        };
        //check if already added
        var indexPos = this.selectedSearchResults.map(function (e) { return e.Name; }).indexOf(compareType);
        //console.log(indexPos);
        //console.log('index position is: ' + indexPos);
        if (indexPos === -1) {
            //this.selectedSearchResults.push(compareResult);
            //this.selPlacesEvt.emit(this.selectedSearchResults);
            this._selectedPlacesService.add(compareResult, 'map');
        }
    }

    onPlaceSelectedMap(place: any) {        
        this.addPlace(place);
    }

    onSelectedPlacesChanged(places: any[]) {
        console.log('this one gets it', places);
        this.selectedSearchResults = [];
        var uniquePlaces: any[] = places.filter((place: any, index: number, self: any) => self.findIndex((t: any) => { return t.ResID === place.ResID && t.Name === place.Name; }) === index);
        for (var place of uniquePlaces) {
            this.selectedSearchResults.push(place);
        }
        console.log('unique places', this.selectedSearchResults);
        let runScope = this;
        var runInterval = setInterval(runCheck, 50);
        function runCheck() {
            let combinedGroups = runScope.checkCombineGroups().groupName;
            //sort into groups if any
            combinedGroups.forEach((gn: any, idx: number) => {
                console.log('Here is a group, need to be binned', gn);
                let dragBins = document.getElementsByClassName('dragBin');
                let processedGroups: any[] = [];
                //let placeBinsToAppend: any[]
                for (var db = 0; db < dragBins.length; db++) {
                    //NEED TO CHECK THAT THE ORIG type matches for appending
                    console.log('dragbin processing', dragBins[db]);
                    console.log('processed groups', processedGroups);
                    let dBsToRemove: any[] = [];
                    if (dragBins[db].getAttribute('groupname') === gn && processedGroups.indexOf(gn) === -1) {
                        console.log('group to process!', gn);
                        for (var db1 = 0; db1 < dragBins.length; db1++) {
                            if (db1 !== db && dragBins[db1].getAttribute('groupname') === gn) {
                                //append to first dragbin
                                let placeBin = dragBins[db1].getElementsByClassName('place-bin');
                                console.log('place bin to append', placeBin, dragBins[db]);
                                for (var pb = 0; pb < placeBin.length; pb++) {
                                    if (placeBin[pb].getAttribute('combined') === 'true') {
                                        console.log('appending place', placeBin[pb]);
                                        //dragBins[db].appendChild(placeBin[pb]);
                                        dBsToRemove.push(dragBins[db1]);
                                        //remove?  drag bin
                                    }
                                }
                            }
                        }
                        processedGroups.push(gn);
                    }
                    console.log('dbstoremove', dBsToRemove);
                    dBsToRemove.forEach((dbr: any) => {
                        console.log(dbr);
                        //dbr.parentElement.parentElement.parentElement.removeChild(dbr.parentElement.parentElement);
                    });
                }
                console.log('All the dragBins', dragBins);
                //find first instance of dragbin with groupname matching and then append other dragbins with same groupname into dragbin

            });
            clearInterval(runInterval);
        }
    }

    checkCombineGroups() {
        let combineArray: any[] = [];
        //find group-names, if more than one with group-name add to combine array
        var groupNames: any[] = [];
        this.selectedSearchResults.forEach((place: SearchResult) => {
            if (place.GroupName !== undefined) {
                if (groupNames.indexOf(place.GroupName) === -1) {
                    groupNames.push(place.GroupName);
                }
            }
        });
        console.log('GroupNames', groupNames);

        groupNames.forEach((gn: any, idx: number) => {
            let groupArray: any[] = [];
            if (gn !== '') {
                this.selectedSearchResults.forEach(place => {
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
        //return combineArray;
        return { 'groupName': groupNames, 'combineArray': combineArray };
    }

    onMapLoad(response: any) {
        //console.log('MAP LOADEDED!!!!!');
        //const map = response.map;
        // bind the search dijit to the map
        //this.searchComponent.setMap(map);
        // initialize the leged dijit with map and layer infos
        //this.legendComponent.init(map, response.layerInfos);
        // set the selected basemap
        //this.basemapSelect.selectedBasemap = response.basemapName;
        // bind the map title
        //this.title = response.itemInfo.item.title;
    }

    translatePlaceTypes(placeType: string, placeName?: string) {
        let modPT = placeType;
        switch (placeType) {
            case 'County':
            case 'Counties':
            //case 'State':
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
    }

    ngOnInit() {
        this._selectedPlacesService.selectionChanged$.subscribe(updatedPlaces => this.onSelectedPlacesChanged(updatedPlaces));
        this._selectedPlacesService.load();
        if (this.selectedPlaces.length > 0) {
            for (var x = 0; x < this.selectedPlaces.length; x++) {
                this.addPlace(this.selectedPlaces[x]);
            }
        } else {
            this.addPlaceCompare(this.selectedPlaceType);
        }
    }
}

