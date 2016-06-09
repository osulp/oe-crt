import {Component, Input, Output, ViewChild, EventEmitter, OnInit} from '@angular/core';
import {Control, CORE_DIRECTIVES} from '@angular/common';
//import {RouteParams} from 'angular2/router';
import {JSONP_PROVIDERS}  from '@angular/http';
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
    directives: [CORE_DIRECTIVES, MapLeafletComponent]
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
    //searchResults: Observable<[{}]>;
    searchResults: Observable<any>;
    mapOptions: any = null;
    urlPlaces: any;

    constructor(
        //private _routerParams: RouteParams,
        private _searchPlaceService: SearchPlacesService,
        private _selectedPlacesService: SelectedPlacesService) {
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
    removePlace(place: SearchResult) {
        var indexPlace = this.selectedSearchResults.indexOf(place);
        this.selectedSearchResults.splice(indexPlace, 1);
        //broadcast out to application
        this.selPlacesEvt.emit(this.selectedSearchResults);
        this._selectedPlacesService.remove(place);
    }
    addPlace(place: SearchResult) {
        //check if already added                
        var indexPos = this.selectedSearchResults.map(function (e) { return e.Name.trim().replace(' County', ''); }).indexOf(place.Name.trim().replace(' County', ''));
        if (indexPos === -1) {
            this.selectedSearchResults.push(place);
            this.selPlacesEvt.emit(this.selectedSearchResults);
            this._selectedPlacesService.add(place, 'search');
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
            this.selectedSearchResults.push(compareResult);
            this.selPlacesEvt.emit(this.selectedSearchResults);
            this._selectedPlacesService.add(compareResult, 'search');
        }
    }

    onSelectedPlacesChanged(places: any[]) {
        console.log('this one gets it', places);
        this.selectedSearchResults = [];
        var uniquePlaces: any[] = places.filter((place: any, index: number, self: any) => self.findIndex((t: any) => { return t.ResID === place.ResID && t.Name === place.Name; }) === index);
        for (var place of uniquePlaces) {
            this.selectedSearchResults.push(place);
        }
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

