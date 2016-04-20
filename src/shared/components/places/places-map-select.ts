import {Component, Input, OnInit} from 'angular2/core';
import {Control, CORE_DIRECTIVES} from 'angular2/common';
import {JSONP_PROVIDERS}  from 'angular2/http';
//import {MapLeafletComponent} from '../../components/map/map.leaflet.component';
import {MapComponent} from '../../components/map/map.component';
import {SearchPlacesService} from '../../services/places/places.service';
import {SelectedPlacesService} from '../../services/places/selected-places.service';
import {SearchResult} from '../../data_models/search-result';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/share';

@Component({
    selector: 'places-map-select',
    templateUrl: './shared/components/places/places-map-select.html',
    styleUrls: ['./shared/components/places/places-map-select.css'],
    providers: [JSONP_PROVIDERS, SearchPlacesService],
    directives: [CORE_DIRECTIVES, MapComponent]
})

export class PlacesMapSelect implements OnInit {
    @Input() selectedPlaceType: any;
    @Input() viewType: string;
    term = new Control();
    searchTerms: string;
    selectedSearchResults: SearchResult[];
    selectedSearchResult: SearchResult;
    selectedPlaces: string;
    tempResults: [{}];
    searchResults: Observable<[{}]>;
    mapOptions: any = null;

    constructor(private _searchPlaceService: SearchPlacesService, private _selectedPlacesService: SelectedPlacesService) {
        this.searchResults = this.term.valueChanges
            .debounceTime(200)
            .distinctUntilChanged()
            .switchMap(term => this._searchPlaceService.search(term !== undefined ? term.toString() : ''))
            .share();
        this.searchResults.subscribe(value => this.tempResults = value);
        //this._selectedPlacesService.selectionChanged$.subscribe();
        this.selectedSearchResults = [];
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
                this.selectedSearchResults.push(result);
                this._selectedPlacesService.add(result);
            } else {                //get tempResult values
                //get tempResult values
                //console.log('no result');
                //console.log(this.searchResults);
                //console.log(this.tempResults);
                if (this.tempResults.length > 0) {
                    var firstItem: any = this.tempResults[0];
                    var selected: SearchResult = {
                        Name: firstItem['Name'].replace(/\,/g, '%2C'),
                        ResID: firstItem['ResID'],
                        Type: firstItem['Type'],
                        TypeCategory: firstItem['TypeCategory'],
                        Desc: firstItem['Desc']
                    };
                    this.selectedSearchResults.push(selected);
                    this._selectedPlacesService.add(selected);
                }
            }
            //broadcast out to application
            //this.selPlacesEvt.emit(this.selectedSearchResults);
            if (this.tempResults.length === 0) {
                alert('Please select a valid search term.');
            }
            this.searchTerms = '';
        }
    }
    clickedSearchResult(event: any, result: SearchResult) {
        this.selectedSearchResults.push(result);
        //broadcast out to application
        //this.selPlacesEvt.emit(this.selectedSearchResults);
        this._selectedPlacesService.add(result);
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
                searchScope.selectedSearchResult = selected;
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
                    searchScope.selectedSearchResult = selected;
                    //searchScope.selPlacesEvt.emit(selected);
                    this._selectedPlacesService.add(selected);
                    alert(firstItem['Name']);
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
        //this.selPlacesEvt.emit(this.selectedSearchResults);
        this._selectedPlacesService.remove(place);
    }

    addPlaceCompare(compareType: string) {
        var compareResult: SearchResult = {
            Name: compareType,
            ResID: compareType === 'Oregon' ? '41' : compareType === 'Rural' ? '41r' : '41u',
            Type: compareType,
            TypeCategory: 'Place',
            Desc: compareType
        };
        //check if already added                
        var indexPos = this.selectedSearchResults.map(function (e) { return e.Name; }).indexOf(compareType);
        console.log(indexPos);
        console.log('index position is: ' + indexPos);
        if (indexPos === -1) {
            this.selectedSearchResults.push(compareResult);
            //this.selPlacesEvt.emit(this.selectedSearchResults);
            console.log(compareResult);
            this._selectedPlacesService.add(compareResult);
        }
    }
    onMapLoad(response: any) {
        console.log('MAP LOADEDED!!!!!');
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
        console.log('loaded explore places component');
        this._selectedPlacesService.selectionChanged$.subscribe(updatedPlaces => console.log(updatedPlaces));
        this._selectedPlacesService.load();
        this.addPlaceCompare(this.selectedPlaceType);
    }
}

