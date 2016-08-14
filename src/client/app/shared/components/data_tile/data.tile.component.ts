import {Component, Input, OnInit, ElementRef, Output, EventEmitter, Inject, OnDestroy} from '@angular/core';
import {JSONP_PROVIDERS}  from '@angular/http';
import {Router} from '@angular/router';
import {CHART_DIRECTIVES, Highcharts} from 'angular2-highcharts';
import * as Highchmap from 'highcharts/modules/map';
import * as HighchartsMore from 'highcharts/highcharts-more';
import {Subscription}   from 'rxjs/Subscription';
import {HmapMenuComponent} from './hmap-menu/hmap.menu.component';
import {Year, CommunityData, SearchResult} from '../../data_models/index';
import {SelectedDataService, DataService, GeoJSONStoreService, GetGeoJSONService, PlaceTypeService, SelectedPlacesService, IndicatorDescService} from '../../services/index';
import {MapChartPlaceZoomPipe} from '../../pipes/index';

declare var $: any;

Highcharts.setOptions({
    colors: ['#058DC7', '#50B432', '#ED561B']
});

Highchmap(Highcharts);
HighchartsMore(Highcharts);

interface Chart {
    //xAxis: [{
    //    setCategories: any;
    //    options: any;
    //}];
    xAxis: any;
    yAxis: any;
    series: any;
    addSeries: any;
    setTitle: any;
    colorAxis: any;
    tooltip: any;
    chartWidth: any;
    chartHeight: any;
    redraw: any;
    getSelectedPoints: any;
    reflow: any;
    legend: any;
    showLoading: any;
    hideLoading: any;
}

@Component({
    moduleId: module.id,
    selector: 'data-tile',
    templateUrl: 'data.tile.component.html',
    styleUrls: ['data.tile.component.css'],
    directives: [CHART_DIRECTIVES, HmapMenuComponent],
    providers: [JSONP_PROVIDERS, DataService, GeoJSONStoreService, GetGeoJSONService, SelectedDataService, PlaceTypeService, IndicatorDescService],
    pipes: [MapChartPlaceZoomPipe]
})


export class DataTileComponent implements OnInit, OnDestroy {
    @Input() indicator: any;//Just name pull rest of info from desc service
    @Input() tileType: any;//map/graph/table
    @Input() viewType: any;//basic/advanced
    @Output() onChartDataUpdate = new EventEmitter();
    public geoJSONStore: any[] = [];
    elementRef: ElementRef;
    private places = new Array<SearchResult>();
    private subscription: Subscription;
    private geoSubscription: Subscription;
    private dataSubscription: Subscription;
    private placeNames: string = '';
    private tempPlaces: Array<SearchResult>;
    private placeTypeData: CommunityData;
    private dataStore: any;
    private Data: any;
    private placeTypes: string[] = [];
    //private place_data: [{}] = [{}];
    //private place_data_years: any;
    //private place_data_years_moe: any;
    private selectedPlaceType: string = 'County';
    private selectedMapData: any;
    private selectedYear: Year;
    private selectedYearIndex: number;
    private selectedYearIndexArray: any = {};
    private offsetYear: number;
    private _tickArray: number[] = [];
    private _tickLabels: any[] = [];
    private _tickLabelsTime: any[] = [];
    private _tickArrayTime: any[] = [];
    private hasDrillDowns: boolean = false;
    private hasMOEs: boolean;
    private showMOES: boolean = true;
    private county_no_data: any = [];
    private county_map_no_data: any = [];
    private animationCounter: number = -1;
    private sliderState: string = 'play';
    private isHandheld: boolean = false;
    private placeTypeGeoYears: any;
    private isSliderInit: boolean = false;
    private isCountyLevel: boolean = false;
    private isStatewide: boolean = false;
    private isNotCombinable: boolean = false;
    private hasCombined: boolean = false;
    private isTOP: boolean = false;
    private is10yr: boolean = false;
    private collections: any[] = [];
    private indicator_collections: any[] = [];
    private yearStartOffset: number = 0;
    //private school_dist_no_data: any = [];
    //private school_dist_map_no_data: any = [];

    private xAxisCategories: any = {};
    private defaultChartOptions = {
        chart: {
            type: 'line',
            marginRight: 15,
            marginLeft: 60,
            spacingLeft: 30,
            spacingRight: 15,
            spacingTop: 15,
            zoomType: 'x',
            resetZoomButton: {
                position: {
                    align: 'left', // by default
                    // verticalAlign: 'top', // by default
                    x: 0,
                    y: -10
                },
                theme: {
                    fill: 'white',
                    stroke: 'silver',
                    r: 0,
                    states: {
                        hover: {
                            //fill: indicatorData.Metadata[0].Color_hex,
                            style: {
                                color: 'white'
                            }
                        }
                    }
                }
            }
        },
        title: {},
        credits: {
            enabled: false,
        },
        xAxis: {
            categories: [0, 1]
        },
        series: {
            fillOpacity: 0.85,
            animation: {
                duration: 500
            },
            marker: {
                lineWidth: 1,
                symbol: 'circle'
            },
            connectNulls: true,
            threshold: 0
        }
    };
    private defaultAdvChartOptions = {
        chart: {
            type: 'line',
            marginRight: 15,
            marginLeft: 70,
            spacingLeft: 30,
            spacingRight: 35,
            spacingTop: 55,
            zoomType: 'x',
            resetZoomButton: {
                position: {
                    align: 'left', // by default
                    // verticalAlign: 'top', // by default
                    x: 0,
                    y: -10
                },
                theme: {
                    fill: 'white',
                    stroke: 'silver',
                    r: 0,
                    states: {
                        hover: {
                            //fill: indicatorData.Metadata[0].Color_hex,
                            style: {
                                color: 'white'
                            }
                        }
                    }
                }
            }
        },
        title: {},
        credits: {
            enabled: false,
        },
        xAxis: {
            categories: [0, 1]
        },
        series: {
            fillOpacity: 0.85,
            animation: {
                duration: 500
            },
            marker: {
                lineWidth: 1,
                symbol: 'circle'
            },
            connectNulls: true,
            threshold: 0
        }
    };
    private mapOptions: Object;
    private chart: Chart;
    private mapChart: any;
    private selectedMapPoints: any = [];
    //private mapSeriesStore: any = {};

    constructor(
        @Inject(ElementRef) elementRef: ElementRef,
        //public _renderer: Renderer,
        private _dataService: DataService,
        private _selectedPlacesService: SelectedPlacesService,
        private _router: Router,
        private _geoStore: GeoJSONStoreService,
        private _geoService: GetGeoJSONService,
        private _selectedDataService: SelectedDataService,
        private _placeTypesService: PlaceTypeService,
        private _indicatorDescService: IndicatorDescService
    ) {
        this.elementRef = elementRef;
        this.tempPlaces = new Array<SearchResult>();
        this.xAxisCategories = [];
        this.Data = [];
        this.mapOptions = {
            chart: {
                renderTo: 'highmap',
                type: 'map'
            },
            title: {
                text: ''
            },
            exporting: {
                buttons: {
                    contextButton: {
                        enabled: false
                    },
                }
            },
            legend: {
                //enabled: false,
                layout: 'horizontal',
                borderWidth: 0,
                backgroundColor: 'white',
                floating: false,
                verticalAlign: 'bottom',
                y: -15,
                title: {
                    text: ' ',
                    align: 'center'
                }
            },
            credits: {
                enabled: true,
                text: 'Maps and Charts provided by Oregon Explorer and OSU Rural Studies Program',
                href: 'http://oregonexplorer.info/rural',
                position: {
                    align: 'center'
                }
            },
            mapNavigation: {
                enabled: true,
                enableMouseWheelZoom: false,
                buttonOptions: {
                    verticalAlign: 'bottom'
                },
                buttons: {
                    zoomIn: {
                        x: 8,
                        y: -8
                    },
                    zoomOut: {
                        x: 8,
                        y: 20
                    }
                }
            },
            //margin: [0, 0, 0, 0],
            //spacing: [10, 10, 10, 10],
            colorAxis: {},
            tooltip: {
                hideDelay: 1,
                followPointer: false,
                borderWidth: 1,
                shadow: false
            },
        };
        this.dataStore = {
            Counties: {},
            Places: {},
            Tracts: {},
            Boundary: {}
        };
    }

    saveInstance(chartInstance: any) {
        //LOGIC
        //1. Chart gets initiated via default settings and saves instance to this.chart
        //2. Subscribe to changes in place selection and indicator selection?
        //3. On place change lookup geo layer to see if it needs to be added
        //4. Subscribe to chanes in geolayers to access geojson for layers
        //5. On getdata for indicator/place grab geojson and update map/chart
        console.log('saving chart instance', this.indicator);
        if (this.tileType === 'graph') {
            this.chart = chartInstance;
            this.chart.showLoading();
        } else {
            this.mapChart = chartInstance;
            this.mapChart.showLoading();
        }
        this.checkScreenSize();

        this._indicatorDescService.getIndicator(this.indicator.replace(/\+/g, '%2B')).subscribe(
            (indicatorDesc: any) => {
                let indicator_info = indicatorDesc.Desc[0];
                if (indicator_info) {
                    this.isStatewide = indicator_info.Geog_ID === 8 ? true : false;
                    this.isCountyLevel = indicator_info.CountyLevel;
                    this.isTOP = indicator_info.isTOP;
                    this.is10yr = indicator_info.is10yrPlan;
                    this.indicator_collections = indicator_info.collections ? indicator_info.collections.split(', ') : [];
                }
                this.subscription = this._selectedPlacesService.selectionChanged$.subscribe(
                    data => {
                        console.log('selected places subscribe throwing event');
                        console.log(data);
                        this.onPlacesChanged(data);
                    },
                    err => console.error(err),
                    () => console.log('done with subscribe event places selected')
                );
                if (this.tileType === 'map'  && !this.isStatewide) {
                    this.geoSubscription = this._geoStore.selectionChanged$.subscribe(
                        data => {
                            this.geoJSONStore = data;
                            console.log('new geojson file loaded');
                            console.log(data);
                            //this.onGeoJSONChanged(data);
                        },
                        err => console.error(err),
                        () => console.log('done loading geojson')
                    );
                }

                this.dataSubscription = this._selectedDataService.selectionChanged$.subscribe(
                    data => {
                        this.onSelectedDataChanged(data);
                    },
                    err => console.error(err),
                    () => console.log('done with subscribe event places selected')
                );

            },
            (err: any) => console.log('error getting indicator description', err),
            () => console.log('loaded the indicator description in data tile')
        );

        var chartScope = this;
        // Wrap point.select to get to the total selected points
        Highcharts.wrap(Highcharts.Point.prototype, 'select', function (proceed: any) {
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));
            //LOGIC:
            //For map tiles, need to handle the selection of map places, "points"
            //For map based selections, need to add to place search bin
            //For place bin selections, don' add again since it should already be in bin
            if (chartScope.tileType === 'map' && !chartScope.isStatewide) {
                var points = chartScope.mapChart.getSelectedPoints();
                chartScope.selectedMapPoints = points;
                var pointsAsPlacesForBin: any[] = [];
                for (var p = 0; p < points.length; p++) {
                    let place = points[p];
                    let binPlace: any;
                    let isInBin = false;
                    console.log('here are the places from map click', chartScope.places);
                    for (var b = 0; b < chartScope.places.length; b++) {
                        console.log('map point', points[p]);
                        console.log('place bin', chartScope.places[b]);
                        isInBin = points[p].geoid === chartScope.places[b].ResID;
                        if (isInBin) {
                            console.log('IS in BIn', chartScope.places[b]);
                            binPlace = chartScope.places[b];
                            pointsAsPlacesForBin.push(binPlace);
                        }
                    }
                    if (!isInBin) {
                        pointsAsPlacesForBin.push({ Name: place.id + (chartScope.selectedPlaceType === 'Counties' ? ' County' : ''), ResID: place.geoid, Type: 'Place', TypeCategory: chartScope.selectedPlaceType, Source: 'map' });
                    }
                    //pointsAsPlacesForBin.push({ Name: place.id + (chartScope.selectedPlaceType === 'Counties' ? ' County' : ''), ResID: place.geoid, Type: 'Place', TypeCategory: chartScope.selectedPlaceType, Source: 'map', Combined: false });
                }
                pointsAsPlacesForBin = pointsAsPlacesForBin.filter((place: any, index: number, self: any) => self.findIndex((t: any) => { return t.ResID === place.ResID && t.Name === place.Name; }) === index);
                console.log('adding from map', chartScope.tileType, pointsAsPlacesForBin);
                chartScope._selectedPlacesService.setAllbyPlaceType(pointsAsPlacesForBin, chartScope.selectedPlaceType);
            }
        });
    }

    onPlacesChanged(selectedPlaces: SearchResult[]) {
        console.log('adding DataTile place change', selectedPlaces);
        this.places = selectedPlaces;
        this.placeNames = '';
        //check if repeated event with same places
        if (this.tempPlaces.length !== this.places.length) {
            console.log('temp place not the same as place length, adding ...');
            for (var x = 0; x < this.places.length; x++) {
                console.log('place: ', this.places[x]);
                //set selected place type based on new addition place type
                if (this.tempPlaces.indexOf(this.places[x]) === -1) {
                    //is the new addition
                    this.selectedPlaceType = this.isCountyLevel ? 'Counties' : this.translatePlaceTypes(this.places[x].TypeCategory);
                    console.log('selectedPlaceType set:', this.selectedPlaceType);
                }
                this.tempPlaces.push(this.places[x]);
                //used for goto details link creation
                this.placeNames += encodeURIComponent(JSON.stringify(this.places[x]));
                this.placeNames += (x < this.places.length - 1) ? ',' : '';
            }
        }
        this.checkDataStateForCharts();
    }

    checkDataStateForCharts(source?: any) {
        console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
        let loadingGeoJSON = this.tileType === 'map' && !this.isStatewide ? this.checkLoadGeoJSON() : false;
        if (this.tileType === 'graph') {
            //sets placetypes for graph knowing about county level data warnings, etc.
            this.getPlaceTypes('graph');
        }
        //console.log(this.tileType);
        //console.log(this.placeTypeData);
        let loadMoreData = this.tileType === 'graph' ? true : this.checkUpdateData();
        if (!loadingGeoJSON && loadMoreData) {
            console.log('need to load data.  chart type: ', this.tileType);
            //check that if on advanced page only load for indicator not all indicators
            if (window.location.href.indexOf('indicator=') !== -1) {
                console.log('on indicator detail page', this.indicator, window.location.href);
                console.log('decode for data call', decodeURI(window.location.href).replace('%28', '(').replace('%29', ')'));
                if (decodeURI(window.location.href)
                    .replace(/\%28/g, '(')
                    .replace(/\%29/g, ')')
                    .replace(/\%2C/g, ',')
                    .replace(/\%24/g, '$')
                    .replace(/\%2B/g, '+')
                    .indexOf(this.indicator) !== -1) {
                    console.log('yes siree');
                    this.getData();
                } else {
                    console.log('no siree');
                }
            } else {
                this.getData();
            }
        } else if (!loadingGeoJSON) {
            console.log('NEED TO UPDATE MAP/CHART');
            if (this.tileType === 'map' && !this.isStatewide) {
                //deselect to clear if place removed
                let selectedPlaces = this.mapChart.getSelectedPoints();
                //logic
                //1. if in selectedPlaces (selected from map), then already selected.
                //2. If not in selectedPlaces, then deselect
                for (var s = 0; s < selectedPlaces.length; s++) {
                    //deselect only if not currently still active
                    console.log('checking selected place');
                    console.log(selectedPlaces[s]);
                    let inSelectedPlaces = false;
                    for (var z = 0; z < this.places.length; z++) {
                        inSelectedPlaces = (this.places[z].Name.replace(' County', '') === selectedPlaces[s].id.replace(' County', '') && this.places[z].ResID === selectedPlaces[s].geoid) ? true : inSelectedPlaces;
                    }
                    console.log(inSelectedPlaces);
                    if (!inSelectedPlaces) {
                        //deselect
                        selectedPlaces[s].select(false, true);
                    }
                }
                if (this.places.length !== this.mapChart.getSelectedPoints().length) {
                    console.log('Place length is different');
                    //assume a search box entry not showing
                    for (var p = 0; p < this.places.length; p++) {
                        let place = this.places[p];
                        let isSelected = false;
                        for (var sp of this.mapChart.getSelectedPoints()) {
                            isSelected = place.ResID === sp.geoid ? true : isSelected;
                        }
                        console.log('is selected' + isSelected);
                       // if (!isSelected && place.Source === 'search' && place.TypeCategory !== 'State') {
                            if (!isSelected && place.TypeCategory !== 'State') {
                            let ptIndex: number;
                            for (var pt = 0; pt < this.mapChart.series[0].data.length; pt++) {
                                //console.log(this.mapChart.series[0].data[pt]);
                                if (this.mapChart.series[0].data[pt].geoid === place.ResID) {
                                    ptIndex = pt;
                                    break;
                                }
                            }
                            if (ptIndex !== undefined) {
                                this.mapChart.series[0].data[ptIndex].select(true, true);
                            }
                        }
                    }
                }
                if (source) {
                    this.initMapChart();
                    //this.setupTimeSlider();
                }
            } else if (this.tileType === 'graph') {
                this.createGraphChart();
            }
        }
    }

    getPlaceTypes(source?: string) {
        var geoJSON_to_load: any[] = [];
        for (var x = 0; x < this.places.length; x++) {
            let placeTypeLoaded = false;
            for (var g = 0; g < this.geoJSONStore.length; g++) {
                if (this.places[x].TypeCategory !== 'State') {
                    placeTypeLoaded = this.translatePlaceTypes(this.places[x].TypeCategory) === this.geoJSONStore[g].layerId ? true : placeTypeLoaded;
                } else {
                    placeTypeLoaded = true; //always load state data
                }
            }
            if (!placeTypeLoaded && ((this.isCountyLevel && this.places[x].TypeCategory === 'County') || !this.isCountyLevel)) {
                geoJSON_to_load.push(this.places[x].TypeCategory);
                //if (this.translatePlaceTypes(this.places[x].TypeCategory) === 'Places') {
                //    geoJSON_to_load.push('oregon_siskiyou_boundary');
                //}
                this.placeTypes.push(source ? this.translatePlaceTypes(this.places[x].TypeCategory) : this.places[x].TypeCategory);
            }
        }
        return geoJSON_to_load;
    }

    checkLoadGeoJSON() {
        let loadingGeoJSON = false;
        //check for missing placetype geojson
        let geoJSON_to_load: any[] = this.getPlaceTypes();
        //also check selected place to see if loaded
        let selPTCheck = geoJSON_to_load.filter(layer => { return this.translatePlaceTypes(layer) === this.selectedPlaceType; });
        if (selPTCheck.length === 0) {
            //if (geoJSON_to_load.indexOf(this.selectedPlaceType) === -1) {
            console.log('Selected place type not in the geoJSON to load queue based on selected places');
            console.log(this.selectedPlaceType);
            console.log(geoJSON_to_load);
            //check if already loaded
            let geoCheck = this.geoJSONStore.filter(geo => { return geo.layerId === this.selectedPlaceType; });
            console.log(geoCheck);
            if (geoCheck.length === 0) {
                geoJSON_to_load.push(this.selectedPlaceType);
            }
        }

        //add boundary layer for places if in geoJSON to load
        let bndryChk = geoJSON_to_load.filter(layer => { return this.translatePlaceTypes(layer) === 'Places'; });
        if (bndryChk.length > 0) {
            console.log('PLACE TYPE NOT LAODED');
            geoJSON_to_load.push('oregon_siskiyou_boundary');
            //let addBoundary = geoJSON_to_load.indexOf('Places') !== -1 ? true : false;
            //if (addBoundary) {
            //}
        }

        if (geoJSON_to_load.length > 0) {
            if (this.placeTypeGeoYears === undefined) {
                this._placeTypesService.get().subscribe((data: any) => {
                    this.placeTypeGeoYears = data;
                    this.getGeoJSON(geoJSON_to_load);
                });
            } else {
                this.getGeoJSON(geoJSON_to_load);
            }
            loadingGeoJSON = true;
        }
        return loadingGeoJSON;
    }

    getGeoJSON(placeTypeToLoad: any[]) {
        for (var pt of placeTypeToLoad) {
            this._geoService.getByPlaceType(this.translatePlaceTypes(pt), this.placeTypeGeoYears).subscribe(
                (data: any) => {
                    console.log('got response from NEWWWWWWWWWWWWWWWWWWWWWWW geoservice');
                    console.log(data);
                    if (data.length > 0) {
                        let mapData = { layerId: data[0].layerType, features: data };
                        this._geoStore.add(mapData);
                        this.updateDataStore(mapData, 'mapData');
                        console.log('got geojson, updated data store and checking place type to get indicator data');
                        console.log(this.selectedPlaceType, data);
                        if (this.selectedPlaceType === data[0].layerType) {
                            //if (data[0].layerType !== 'State' && data[0].layerType !== 'Boundary') {
                            this.getData();
                        }
                    }
                });
        }
    }

    getData() {
        //get ResIDs for geoids param
        //this.defaultChartOptions.title = { text: this.indicator };
        let geoids = '';
        //console.log('test selectedplaces');
        //console.log(selectedPlaces);
        let selectedPlaces = this.places;
        if (selectedPlaces.length !== 0) {
            for (var x = 0; x < selectedPlaces.length; x++) {
                geoids += selectedPlaces[x].ResID;
                if (x !== selectedPlaces.length - 1) {
                    geoids += ',';
                }
            }
        } else {
            geoids = '41';
        }
        //var chartScope = this;
        if (this.tileType === 'map' && !this.isStatewide) {
            //if (this.viewType === 'advanced') {
            //LOGIC
            //1. for each selected place get all of the placetype data to show on map.
            //2. If already have the data, then check to see if new place type selected
            let placeTypes = '';
            for (var p = 0; p < this.places.length; p++) {
                //See if place type already in list (CDP/City/Town all translate to Places)
                //If only one type selected need to add State, if not State
                //console.log('888888888888888888888888888');
                //console.log(this.dataStore[this.translatePlaceTypes(this.places[p].TypeCategory)]);
                if (this.dataStore[this.translatePlaceTypes(this.places[p].TypeCategory)] !== undefined) {
                    console.log('not undefined yet', this.dataStore[this.translatePlaceTypes(this.places[p].TypeCategory)]);
                    if (this.dataStore[this.translatePlaceTypes(this.places[p].TypeCategory)].indicatorData[this.indicator] === undefined) {
                        console.log('now it is undefined', placeTypes.indexOf(this.places[p].TypeCategory) === -1 ? this.places[p].TypeCategory : '');
                        placeTypes += placeTypes.indexOf(this.places[p].TypeCategory) === -1 ? this.places[p].TypeCategory : '';
                        placeTypes += p === this.places.length - 1 ? '' : ',';
                    }
                }
            }

            if (placeTypes === '' || placeTypes === 'State,') {
                if (this.dataStore[this.selectedPlaceType].indicatorData[this.indicator] === undefined) {
                    placeTypes += this.selectedPlaceType === 'Counties' ? 'County' : this.selectedPlaceType;
                } else {
                    placeTypes += this.selectedPlaceType === 'Counties' ? 'County' : this.selectedPlaceType;
                }
            }
            //console.log('GET DATA HOT DIGIDIGDIGIDGIG I');
            //console.log(placeTypes);
            if (placeTypes === 'State' || placeTypes === '' || this.isCountyLevel) {
                placeTypes = 'County,State';
            }

            this._dataService.getAllbyGeoType(placeTypes, this.indicator).subscribe(
                (data: any) => {
                    //this.placeTypeData = data;
                    this._selectedDataService.add(data);
                },
                (err: any) => console.error(err),
                () => console.log('done loading data for map')
            );
        } else {
            //check for combined requests
            let combinedGroups = this.checkCombineGroups();
            let indicatorForService = this.indicator.replace(/\%28/g, '(')
                .replace(/\%29/g, ')')
                .replace(/\%2C/g, ',')
                .replace(/\%24/g, '$')
                .replace(/\+/g, '%2B');
            if (combinedGroups.length > 0) {
                this._dataService.getIndicatorDetailDataWithMetadata(geoids, indicatorForService).subscribe(
                    (data: any) => {
                        //console.log('detailed data response', data);
                        //combine data by group-names
                        let combinedData = this.processCombinedData(data);
                        this.updateDataStore([combinedData], 'indicator');
                        this.onChartDataUpdate.emit(combinedData);
                        this.createGraphChart();
                    });
            } else {
                console.log('geoids for data service', geoids);
                this._dataService.getIndicatorDataWithMetadata(geoids, indicatorForService).subscribe(
                    (data: any) => {
                        console.log('regular indicator data', data);
                        this.updateDataStore([data], 'indicator');
                        ////this.placeTypeData = data;
                        //this.placeTypeData = this.dataStore.indicatorData[this.indicator].crt_db;
                        ////this.Data = data.length > 0 ? data : [];
                        //this.offsetYear = this.offsetYear === undefined ? this.getDefaultYear() : this.offsetYear;
                        //this.selectedYear = this.placeTypeData.Years[this.placeTypeData.Years.length - this.offsetYear];
                        //this.processDataYear();
                        //this.processYearTicks();
                        //this.selectedYearIndex = this._tickArray.length - this.offsetYear;
                        //this.Data = this.placeTypeData.Data;
                        this.onChartDataUpdate.emit(data);
                        this.createGraphChart();
                    },
                    (err: any) => console.error(err),
                    () => console.log('done loading data for graph')
                );
            }
        }
    }


    checkCombineGroups() {
        let combineArray: any[] = [];
        //find group-names, if more than one with group-name add to combine array
        var groupNames: any[] = [];
        this.places.forEach((place: SearchResult) => {
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
                this.places.forEach(place => {
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
        this.hasCombined = groupNames.length > 0 ? true : false;
        return combineArray;
    }

    processCombinedData(data: any) {
        let combinedData = data;
        if (!data.Metadata[0].isPreCalc && data.Metadata[0].Variable_Represent.trim() !== 'Text') {
            var groups = this.checkCombineGroups();
            //build data output combining data by group
            for (var group of groups) {
                //console.log('group of groups', group);
                let combinedGroupData: any = new Object;
                combinedGroupData.community = group[0].GroupName;
                combinedGroupData.Variable = group[0].Variable;
                combinedGroupData.geoid = '';
                var multiplyBy = parseInt(data.Metadata[0].MultiplyBy);

                for (var year of data.Years) {
                    var isACS = year.Year.indexOf('-') !== -1;
                    let combinedNumerators = 0;
                    let combinedDenoms = 0;
                    let combinedNumMOEs = 0;
                    let combinedDenomMOEs = 0;
                    for (var place of group) {
                        //console.log('this place', place);
                        let placeData = combinedData.Data.filter((pData: any) => {
                            //console.log('pData Group', pData);
                            return pData.geoid === place.ResID;
                        });
                        let numValue = placeData[0][year.Year + '_N'];
                        let denomValue = placeData[0][year.Year + '_D'];
                        let numMOEValue = isACS ? placeData[0][year.Year + '_MOE_N'] : null;
                        let denomMOEValue = isACS ? placeData[0][year.Year + '_MOE_D'] : null;

                        //console.log('place comb data', placeData);
                        //console.log('num value', numValue);
                        //console.log('denom value', denomValue);
                        combinedNumerators = numValue !== '' && numValue !== null ? (combinedNumerators + parseFloat(numValue)) : combinedNumerators;
                        combinedDenoms = denomValue !== '' && denomValue !== null ? (combinedDenoms + parseFloat(denomValue)) : combinedDenoms;
                        if (isACS) {
                            combinedNumMOEs = numMOEValue !== '' && numMOEValue !== null ? (combinedNumMOEs + parseFloat(numMOEValue)) : combinedNumMOEs;
                            combinedDenomMOEs = denomMOEValue !== '' && denomMOEValue !== null ? (combinedDenomMOEs + parseFloat(denomValue)) : combinedDenomMOEs;
                        }
                    }
                    //console.log('combined num values', combinedNumerators);
                    //console.log('combined denom values', combinedDenoms);
                    combinedDenoms = combinedDenoms === 0 || combinedDenoms === null ? 1 : combinedDenoms;
                    combinedGroupData[year.Year] = combinedNumerators / combinedDenoms * multiplyBy;
                    if (isACS) {
                        let displayMOE: any;
                        if (combinedDenomMOEs !== 0) {
                            let calcVal = (combinedNumerators / combinedDenoms) / multiplyBy;
                            //Math.Round(((Math.Sqrt(Math.Pow(num_moe_cummulative, 2) + ((Math.Pow(calc_value, 2) * (Math.Pow(denom_moe_cummulative, 2))))) / denom_cummulative)) * intMultiplyBy, 1);

                            displayMOE = Math.round(((Math.sqrt(Math.pow(combinedNumMOEs, 2) + ((Math.pow(calcVal, 2) * (Math.pow(combinedDenomMOEs, 2))))) / combinedDenoms)) * multiplyBy * 10) / 10;
                        } else {
                            displayMOE = Math.round(combinedNumMOEs * 10) / 10;
                        }
                        combinedGroupData[year.Year + '_MOE'] = displayMOE;
                    }
                }
                //remove place from combined data
                for (var place of group) {
                    combinedData.Data = combinedData.Data.filter((pData: any) => { return pData.geoid !== place.ResID && pData.community !== place.Name; });
                    //console.log('filtered combinedData', combinedData.Data);
                }
                combinedData.Data.push(combinedGroupData);
                console.log('combined data added', combinedData);
            }
        }
        return combinedData;
    }



    checkUpdateData() {
        let loadMoreData = false;
        for (var d = 0; d < this.places.length; d++) {
            console.log('Check UpdateData', this.places[d].TypeCategory);
            if (this.places[d].TypeCategory !== 'State') {
                if (this.dataStore[this.pluralize(this.places[d].TypeCategory)].indicatorData !== undefined) {
                    console.log('already have this type data');
                    console.log(this.dataStore[this.pluralize(this.places[d].TypeCategory)]);
                    //loadMoreData = false;
                } else {
                    loadMoreData = true;
                }
            }
        }
        //also check if selected place type changed and does not have included place selected
        if (this.dataStore[this.selectedPlaceType] !== undefined) {
            if (this.dataStore[this.selectedPlaceType].indicatorData === undefined) {
                loadMoreData = true;
            }
        }
        return loadMoreData;
    }

    onSelectedDataChanged(data: any) {
        console.log('Community Data throwing event');
        this.updateDataStore(data, 'indicator');
        //add check to see if place indicator set does not equal input send add request
        if (data.length > 0) {
            //check to see if data loaded contains current report params
            console.log('giddy up');
            console.log(this.dataStore);
            console.log(this.selectedPlaceType);
            this.placeTypeData = this.dataStore[this.selectedPlaceType].indicatorData[this.indicator].crt_db;
            //need to set to last year which has data, not last year that might have data
            this.offsetYear = this.getDefaultYear();//retrieve offset value from end
            this.selectedYear = this.placeTypeData.Years[data[0].Years.length - this.offsetYear];
            if (this.tileType === 'map' && !this.isStatewide) {
                //TODO make contextual to actual place type selection--defaulting to County
                console.log('on selected data changed', this.isStatewide);
                console.log(this.geoJSONStore);
                this.selectedMapData = this.getSelectedMapData();
            }
            //Process the data for it to work with Highmaps
            this.processDataYear();
            this.processYearTicks();
            this.selectedYearIndex = this._tickArray.length - this.offsetYear;
            this.hasDrillDowns = this.placeTypeData.Metadata[0].Sub_Topic_Name !== 'none' ? true : false;
            if (this.tileType === 'map' && !this.isStatewide) {
                this.initMapChart();
                if (!this.isSliderInit) {
                    this.setupTimeSlider();
                    this.isSliderInit = true;
                }
            }
            //else {
            //    this.Data = this.placeTypeData.Data;
            //    if (this.isCountyLevel) {
            //        this.createGraphChart();
            //    }
            //}
        } else {
            console.log('DATA SUBSCRIPTION thinks there is no data');
            //this.getData();
        }
    }

    updateDataStore(data: any, dataType?: string) {
        //identify what type of data and add to proper place type object
        //console.log('SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS', data, dataType);
        if (dataType === 'indicator') {
            //check if data is statewide, county or not combinable
            for (var d = 0; d < data.length; d++) {
                let indicatorData: any = {};
                indicatorData[this.indicator] = { crt_db: data[d] };
                if (data[d].Metadata.length > 0) {
                    let metadata = data[d].Metadata[0];
                    this.isStatewide = metadata.Variable_Geog_Desc === 'State' ? true : false;
                    this.isCountyLevel = metadata.CountyLevel;
                    this.isNotCombinable = metadata.isPreCalc && !this.isStatewide && this.hasCombined;
                }
                if (this.tileType === 'map' && !this.isStatewide) {
                    //console.log('problem data', data[d]);
                    if (this.dataStore[this.pluralize(data[d].GeoTypes[0].geoType).toString()].indicatorData[this.indicator] === undefined) {
                        //console.log(data[d].GeoTypes[0].geoType);
                        //let chart_data = {};
                        //let add_back_chart_data = false;
                        //if (this.dataStore[this.pluralize(data[d].GeoTypes[0].geoType).toString()].indicatorData[this.indicator].chart_data !== undefined) {
                        //    chart_data = this.dataStore[this.pluralize(data[d].GeoTypes[0].geoType).toString()].indicatorData[this.indicator].chart_data;
                        //    add_back_chart_data = true;
                        //}
                        this.dataStore[this.pluralize(data[d].GeoTypes[0].geoType).toString()].indicatorData = indicatorData;
                        //if (add_back_chart_data) {
                        //    this.dataStore[this.pluralize(data[d].GeoTypes[0].geoType).toString()].indicatorData[this.indicator].chart_data = chart_data;
                        //}
                        //console.log('AFTER ADDING INDICATOR DATA FOR PLACETYPE', this.dataStore);
                    }
                } else {
                    this.dataStore.indicatorData = indicatorData;
                }
            }
        }
        if (dataType === 'mapData') {
            //console.log('hlaskjdf;ldskjf;ldasjflk;sdjf;jsdafkjsdakjfdj');
            let mapData: any = {};
            mapData = data;
            //console.log(data.layerId);
            this.dataStore[this.pluralize(data.layerId)].mapData = mapData;

        }
        //console.log(this.dataStore);
    }

    getPlaceData() {
        //console.log('Checking on place data', this.dataStore[this.selectedPlaceType].indicatorData[this.indicator].chart_data.place_data);
        if (this.tileType === 'map' && !this.isStatewide) {
            return this.dataStore[this.selectedPlaceType].indicatorData[this.indicator].chart_data.place_data;
        } else {
            return this.dataStore.indicatorData[this.indicator].chart_data.place_data;
        }
    }

    getSelectedMapData() {
        //identify the array to check
        //console.log(this.selectedPlaceType);
        let selectedGeoJSONType: any = this.geoJSONStore.filter(data => { return data.layerId === this.pluralize(this.selectedPlaceType); });
        //check the selected year and get layer accordingly
        var selectedYearGeoJSONIndex: any = 0;
        for (var y = 0; y < selectedGeoJSONType[0].features.length; y++) {
            var year = selectedGeoJSONType[0].features[y];
            if (this.selectedYear.Year.split('-').length > 1) {
                selectedYearGeoJSONIndex = (parseInt(year.Year) <= parseInt('20' + this.selectedYear.Year.split('-')[1])) ? y : selectedYearGeoJSONIndex;
            } else {
                selectedYearGeoJSONIndex = parseInt(year.Year) <= parseInt(this.selectedYear.Year) ? y : selectedYearGeoJSONIndex;
            }
        }
        //console.log('que pasa');
        //console.log(selectedGeoJSONType);
        //console.log(selectedGeoJSONType[0].features[selectedYearGeoJSONIndex]);
        return selectedGeoJSONType[0].features[selectedYearGeoJSONIndex];
    }

    setupTimeSlider() {
        if ($.ui === undefined) {
            var temp = $.noConflict();
            console.log(temp);
        }
        var sliderScope = this;
        $(this.elementRef.nativeElement).find('#dateSlider').labeledslider(
            {
                min: 0,
                max: this.placeTypeData.Years.length - 1,
                value: this.placeTypeData.Years.length - 1,
                tickInterval: 1,
                step: 1,
                autoScaleSlider: false,
                tickArray: this._tickArray,
                tickLabels: this._tickLabelsTime,
                change: function (event: any, ui: any) {
                    //console.log('slider changed');
                    sliderScope.selectedYear = sliderScope.placeTypeData.Years[ui.value];
                    sliderScope.selectedYearIndex = sliderScope.selectedYearIndexArray[sliderScope.selectedYear.Year];//  ui.value;
                    sliderScope.processDataYear();
                    sliderScope.mapChart.setTitle(null, {
                        text: sliderScope.selectedPlaceType + ' (' + sliderScope.selectedYear.Year + ')'
                    });
                    let seriesIndex = sliderScope.mapChart.series.length - 1;
                    let mapData = sliderScope.getSelectedMapData();
                    let data: any = sliderScope.dataStore[sliderScope.selectedPlaceType].indicatorData[sliderScope.indicator].chart_data.place_data;
                    sliderScope.mapChart.series[seriesIndex].name = sliderScope.pluralize(sliderScope.selectedPlaceType) + ' (' + sliderScope.selectedYear.Year + ')';
                    sliderScope.mapChart.series[seriesIndex].mapData = mapData;
                    sliderScope.mapChart.series[seriesIndex].setData(data);
                    //detailChart.xAxis[0].removePlotLine('plot-line-1');
                    //detailChart.xAxis[0].addPlotLine({
                    //    value: selectedYearIndex,
                    //    color: 'gray',
                    //    dashStyle: 'longdashdot',
                    //    width: 2,
                    //    id: 'plot-line-1'
                    //});
                }
            });
    }

    onPlayBtnClick(evt: any) {
        let runScope = this;
        var runInterval = setInterval(runCheck, 2000);
        function runCheck() {
            if (runScope.sliderState === 'pause') {
                runScope.animationCounter = runScope.animationCounter < (runScope.placeTypeData.Years.length - 1) ? ++runScope.animationCounter : 0;
                $(runScope.elementRef.nativeElement).find('#dateSlider').labeledslider({ value: runScope.animationCounter });
            } else {
                clearInterval(runInterval);
            }
        }
        //if state shows play, means we need to run animation
        this.sliderState = this.sliderState === 'play' ? 'pause' : 'play';
    }

    translatePlaceTypes(placeType: string) {
        switch (placeType) {
            case 'County':
            case 'Counties':
            case 'State':
                return 'Counties';
            case 'Census Designated Place':
            case 'Incorporated City':
            case 'Incorporated Town':
            case 'City':
            case 'Cities':
                return 'Places';
            case 'Census Tract':
            case 'Census Tracts':
            case 'Unicorporated Place':
                return 'Tracts';
            default:
                return placeType;
        }
    }

    initMapChart() {
        //console.log('CREATIN MAP CHART');
        //this.mapChart.destroy();
        //this.mapChart = new Highcharts.Map(this.mapOptions);
        var mapScope = this;
        this.mapChart.legend.title.attr({ text: this.placeTypeData.Metadata[0]['Y-Axis'] ? this.placeTypeData.Metadata[0]['Y-Axis'] : '' });
        //set tooltip display
        this.mapChart.tooltip.options.formatter = function () {
            var displayValue = mapScope.formatValue(this.point.value, false) + '</b>';
            if (this.point.value === undefined) {
                return '<span>' + this.point.properties.name + ' County</span><br/><span style="font-size: 10px">Not Available or Insufficient Data</span>';
            } else {
                if (this.point.year !== undefined) {
                    if (this.point.year.match('-')) {
                        let chart_data = mapScope.dataStore[mapScope.selectedPlaceType].indicatorData[mapScope.indicator].chart_data;
                        displayValue += '<span style="font-size:8px">  (+/- ';
                        displayValue += mapScope.formatValue(((parseFloat(chart_data.place_data_years_moe[this.point.id].data[mapScope.selectedYearIndexArray[this.point.year]][1]) - parseFloat(chart_data.place_data_years_moe[this.point.id].data[mapScope.selectedYearIndexArray[this.point.year]][0])) / 2), false);
                        displayValue += ' )</span>';
                    }
                    var SeriesName = this.point.series.name.split(':').length > 1 ? this.point.series.name.split(':')[0] + ':<br />' + this.point.series.name.split(':')[1] : this.point.series.name;
                    var returnHTML = '<span style="fill: ' + this.series.color + ';"> ● </span><span style="font-size: 10px"> ' + SeriesName + '</span>';
                    returnHTML += '<br/><b>' + this.point.id + ' ' + (mapScope.selectedPlaceType === 'Counties' ? 'County' : '') + ': ' + displayValue;
                    returnHTML += '<br/><span style="color:#a7a7a7;">-----------------------------------------</span><br/><em><span style="font-size:10px; color:' + mapScope.placeTypeData.Metadata[0].Color_hex;
                    returnHTML += '; font-weight:bold; font-style:italic">( Click to view chart  ---   To compare: Hold Shift + Click )</span></em>';
                    return returnHTML;
                } else {
                    return '<span style="font-size: 10px">Not Available or Insufficient Data</span>';
                }
            }
        };
        var colorAxis = this.mapChart.colorAxis[0];
        //set legend/chloropleth settings
        colorAxis.update({
            type: this.getMinData(true, true) > 0 ? 'logarithmic' : null,// 'logarithmic',
            //min: 0,//null,//0,
            min: this.getMinData(true),
            max: this.getMaxData(true),
            endOnTick: false,
            startOnTick: true,
            //maxColor: this.placeTypeData.Metadata[0].Color_hex,
            labels: {
                formatter: function () {
                    return mapScope.formatValue(this.value, true);
                }
            }
        });
        //clear out and add again for sync purposes
        //while (this.mapChart.series.length > 1) {
        //    this.mapChart.series[0].remove(false);
        //}
        var seriesLength = this.mapChart.series.length;
        //this.mapChart.showLoading();
        for (var i = seriesLength - 1; i > -1; i--) {
            this.mapChart.series[i].remove();
        }

        let ptSeriesIndexes: any[] = [];
        if (this.selectedPlaceType === 'Places') {
            //add boundary layer to help see what is going on
            console.log('BOUNDARY Data');
            console.log(this.dataStore.Boundary.mapData);
            var boundarySeries = {
                name: 'Boundary',
                //borderColor: 'red',
                //index: 21,
                enableMouseTracking: false,
                color: 'rgba(0,128,0,0.1)', // #080
                negativeColor: 'rgba(128,0,0,0.1)', // #800
                mapData: this.dataStore.Boundary.mapData.features[0]
            };
            //this.mapChart.series[0].update(boundarySeries);
            this.mapChart.addSeries(boundarySeries);
            ptSeriesIndexes.push(this.mapChart.series.length - 1);
        }
        //console.log('a;lskdddddddddddddddddfj;alskdjf;lajsdfl;aksdjfal;skdfjkl');
        //console.log(this.selectedPlaceType);
        //let data = this.getSelectedMapData();
        //let mapData = this.dataStore[this.selectedPlaceType].indicatorData[this.indicator].chart_data.place_data;
        var series = {
            borderColor: 'white',
            data: this.getPlaceData(),//this.place_data
            mapData: this.getSelectedMapData(),//selectedMapData,
            //index: 0,//bowser.msie ? 1 : 0,
            joinBy: ['NAME', 'name'],
            name: this.indicator + this.selectedPlaceType + ' (' + this.selectedYear.Year + ')',
            allowPointSelect: true,
            cursor: 'pointer',
            states: {
                select: {
                    color: '#BADA55',
                    //color: '#990033',
                    //borderColor: 'red',
                    //borderWidth: '2px',
                    //dashStyle: 'shortdot'
                },
                hover: {
                    color: '#BADA55'
                }
            }
        };
        this.mapChart.addSeries(series, true);
        this.mapChart.series[this.selectedPlaceType === 'Places' ? 1 : 0].mapData = this.getSelectedMapData();
        this.mapChart.series[this.selectedPlaceType === 'Places' ? 1 : 0].setData(this.dataStore[this.selectedPlaceType].indicatorData[this.indicator].chart_data.place_data);
        this.mapChart.setTitle(null,
            {
                text: this.pluralize(this.selectedPlaceType) + ' (' + this.selectedYear.Year + ')',
                verticalAlign: 'bottom',
                y: -5,
                x: -10,
                style: {
                    fontSize: '.8em',
                    fontStyle: 'italic'
                }
            });
        this.mapChart.redraw();
        this.mapChart.hideLoading();
        this.selectedMapPoints = this.mapChart.getSelectedPoints();
    }


    createGraphChart() {
        //this.placeTypeData = data;
        this.placeTypeData = this.dataStore.indicatorData[this.indicator].crt_db;
        //this.Data = data.length > 0 ? data : [];
        this.offsetYear = this.offsetYear === undefined ? this.getDefaultYear() : this.offsetYear;
        this.selectedYear = this.placeTypeData.Years[this.placeTypeData.Years.length - this.offsetYear];
        this.processDataYear();
        this.processYearTicks();
        this.selectedYearIndex = this._tickArray.length - this.offsetYear;
        this.Data = this.placeTypeData.Data;
        //this.onChartDataUpdate.emit(data);
        //check if metadata, if not custom chart, need to do other stuff
        //TODO catch custom chart scenarios
        if (this.placeTypeData.Metadata.length > 0) {
            //console.log('making graph chart');
            var chartScope = this;
            this.chart.xAxis[0].setCategories(this._tickLabels);

            this.chart.xAxis[0].update({
                min: 0,
                max: this._tickArray.length - 1,
                tickInterval: this._tickArray.length > 10 ? 2 : null,
                plotLines: [{
                    color: 'gray',
                    dashStyle: 'longdashdot',
                    width: 2,
                    value: this.selectedYearIndex,
                    id: 'plot-line-1'
                }],
                plotOptions: {
                    series: {
                        fillOpacity: 0.85,
                        animation: {
                            duration: 500
                        },
                        marker: {
                            lineWidth: 1,
                            symbol: 'circle'
                        },
                        connectNulls: true,
                        threshold: 0
                    }
                }
            });

            this.chart.legend.update(this.setLegendOptions());

            this.chart.tooltip.options.shared = false;
            this.chart.tooltip.options.useHTML = true;
            this.chart.tooltip.options.formatter = function (): any {
                //console.log('hovering', this);
                //highlight corresponding map geography
                //if (hoveredPlace !== undefined && hoveredPlace !== "Oregon") {
                //    try { mapChart.get(hoveredPlace).setState(''); } catch (ex) { }
                //}
                let hoveredPlace = this.series.name
                    .replace(' County', '')
                    .replace(' School District', '')
                    .replace(' Margin of Error', '');
                ////if (hoveredPlace !== undefined) {
                ////    try {
                ////        mapChart.get(hoveredPlace).setState('hover');
                ////    }
                ////    catch (ex) {
                ////    }
                ////}
                if (this.series.name.match('Error')) {
                    return false;
                    //var moe = formatValue((this.point.high - this.point.low) / 2);
                    //return '<span style="fill: ' + this.series.color + ';"> ● </span><span style="font-size: 10px"> ' + this.point.series.name + ' (' + this.x + ')</span><br/><b>+/-' + moe + '</b><br/>';
                } else {
                    var displayValue = chartScope.formatValue(this.y, false) + '</b>';
                    if (this.x.match('-')) {
                        //if (!drilldownShowing) {
                        //console.log('hoevered place: ', hoveredPlace);
                        //console.log('data store', chartScope.dataStore);
                        let value1 = parseFloat(chartScope.dataStore.indicatorData[chartScope.indicator].chart_data.place_data_years_moe[hoveredPlace].data[chartScope.selectedYearIndexArray[this.x]][1]);
                        let value2 = parseFloat(chartScope.dataStore.indicatorData[chartScope.indicator].chart_data.place_data_years_moe[hoveredPlace].data[chartScope.selectedYearIndexArray[this.x]][0]);
                        let moeValue = (value1 - value2) / 2;
                        //console.log(moeValue);
                        displayValue += '<span style="font-size:8px">  (+/- ' + chartScope.formatValue(moeValue, false) + ' )</span>';
                        //}
                        //else {//only show MOE drill downs for State right now
                        //    try {
                        //        displayValue += '<span style="font-size:8px">  (+/- ' + formatValue((drill_data.years_moe[this.series.name].data[selectedYearIndexArray[this.x]][1] - drill_data.years_moe[this.series.name].data[selectedYearIndexArray[this.x]][0]) / 2) + ' )</span>';
                        //    }
                        //    catch (ex)
                        //    { }
                        //}
                    }

                    //var drillDownMsg = hasDrillDowns && !drilldownShowing && !isGPI && (isStateDDOnly && this.point.series.name === "Oregon" || !isStateDDOnly) && !hasDrillDownCategories ? '<span style="font-size:10px"><em>(Click on line to see demographics)</em></span>' : "";

                    return '<span style="fill: ' + this.series.color + ';"> ● </span><span style="font-size:10px"> ' + this.point.series.name + ' (' + this.x + ')</span><br/><span><b>' + displayValue + '</span><br/>';// + drillDownMsg;
                }
            };

            let indicatorYaxis = this.placeTypeData.Metadata[0]['Y-Axis'] !== null ? this.placeTypeData.Metadata[0]['Y-Axis'] : this.indicator;
            this.chart.yAxis[0].update({
                title: {
                    text: this.viewType === 'advanced' ? indicatorYaxis : '',
                    margin: this.viewType === 'advanced' ? indicatorYaxis.length > 30 ? 40 : null : null,
                    style: { 'line-height': '.8em' }
                },
                labels: {
                    formatter: function () {
                        return chartScope.formatValue(this.value, true);
                    }
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }],
                floor: 0,
                min: 0
            });
            let title = this.placeTypeData.Metadata[0]['Dashboard_Chart_Title'] !== null ? this.placeTypeData.Metadata[0]['Dashboard_Chart_Title'] : this.indicator;
            this.chart.setTitle(
                {
                    text: this.viewType === 'basic' ? title.replace('<br>', ' ') : null,
                    align: this.viewType === 'basic' ? 'left' : null,
                    style: {
                        fontSize: '1.25em',
                        fontWeight: '200'
                    },
                    widthAdjust: -10,
                    x: -30
                    //y: 0
                },
                {
                    text: this.viewType === 'basic' ? (this.isCountyLevel ? '<span class="glyphicon glyphicon-flag"></span><span>County Level Data</span>' : this.isStatewide ? '<span class="glyphicon glyphicon-flag"></span><span>Statewide Data Only</span>' : '') : null,
                    align: 'right',
                    style: {
                        fontStyle: 'italic',
                        fontSize: '.8em',
                        color: '#a7a7a7'
                    },
                    //y: title.length > 90 ? 60 : title.length > 50 ? 40 : 20,
                    useHTML: true
                }
            );

            this.addSeriesDataToGraphChart();
            this.chart.hideLoading();
        } else {
            //console.log('no chart for' + this.indicator);
        }
    }

    addSeriesDataToGraphChart(mapPlaces?: any[]) {
        //console.log('this.Data at addSeries...', this.Data, this.tileType);
        //clear out and add again for sync purposes
        while (this.chart.series.length > 0) {
            this.chart.series[0].remove(false);
        }
        //show selected places on chart only
        //var selectedPlaceData = this.Data.filter((placeData: any) => {
        //    var isSelected = false;
        //    //selections come from the place selector box, not high-maps
        //    for (var p = 0; p < this.places.length; p++) {
        //        isSelected = (placeData.community.trim() === this.places[p].Name.replace(' County', '').trim() && placeData.geoid.trim() === this.places[p].ResID.trim()) ? true : isSelected;
        //        if (isSelected) {
        //            break;
        //        }
        //    }
        //    if (!isSelected && mapPlaces !== undefined) {
        //        for (var m = 0; m < mapPlaces.length; m++) {
        //            if (mapPlaces[m].id !== null) {
        //                isSelected = (placeData.community.trim() === mapPlaces[m].id.replace(' County', '').trim() && placeData.geoid.trim() === mapPlaces[m].geoid.trim()) ? true : isSelected;
        //                if (isSelected) {
        //                    break;
        //                }
        //            }
        //        }
        //    }
        //    //check for county level since place will not match selected county in data
        //    //adds combined to display since no geoids
        //    isSelected = placeData.geoid === '' ? true : isSelected;
        //    return isSelected;
        //});
        //pull out statewide layers and add first then add the rest
        let oregonGeoids = ['41', '41r', '41u'];
        let californiaGeoids = ['06', '06r', '06u'];
        //let statewideGeoids = oregonGeoids.concat(californiaGeoids);
        //let sortedPlaceData = selectedPlaceData.sort((a: any, b: any) => b.geoid.localeCompare(a.geoid));

        let sortedPlaceData = this.Data.sort((a: any, b: any) => b.geoid.localeCompare(a.geoid));
        //process data series
        sortedPlaceData.forEach((pd: any) => {
            //for (var x = 0; x < selectedPlaceData.length; x++) {
            let isOregon = oregonGeoids.indexOf(pd.geoid) !== -1 ? true : false;
            let isCalifornia = californiaGeoids.indexOf(pd.geoid) !== -1 ? true : false;
            var isState = isOregon || isCalifornia ? true : false;
            let isCombined = pd.geoid === '';
            this.chart.addSeries({
                id: pd.community + pd.geoid,
                name: pd.community + (pd.geoid.length === 5 ? ' County' : ''),
                type: 'line',
                lineWidth: isState ? 4 : 2,
                lineColor: isState ? '#A3A3A4' : null,
                lineOpacity: 1.0,
                data: this.dataStore.indicatorData[this.indicator].chart_data.place_data_years[pd.community].data,
                connectNulls: true,
                threshold: 0,
                fillOpacity: 0.85,
                animation: {
                    duration: 500
                },
                marker: {
                    fillColor: isState ? '#FFFFFF' : null,
                    lineWidth: isState ? 4 : 2,
                    lineColor: isOregon ? '#244068' : isCalifornia ? '#C34500' : isCombined ? '#98BD85' : null,
                    radius: this.placeTypeData.Years.length > 10 ? 3.5 : 4,
                    symbol: 'circle'
                }
            }, true);
            if (this.hasMOEs) {
                this.chart.addSeries({
                    name: pd.community + pd.geoid + ' Margin of Error',
                    whiskerLength: 10,
                    whiskerColor: 'gray',
                    stemColor: 'gray',
                    stemDashStyle: 'Dash',
                    type: 'errorbar',
                    data: this.dataStore.indicatorData[this.indicator].chart_data.place_data_years_moe[pd.community].data,
                    linkedTo: pd.community + pd.geoid,
                    visible: this.showMOES
                }, false);
                var maxMoe = this.getMaxMOE(this.dataStore.indicatorData[this.indicator].chart_data.place_data_years_moe[pd.community].data);
                var minMoe = this.getMinMOE(this.dataStore.indicatorData[this.indicator].chart_data.place_data_years_moe[pd.community].data);
                if (maxMoe !== undefined) {
                    var extremes = this.chart.yAxis[0].getExtremes();
                    maxMoe = maxMoe < extremes.max ? extremes.max : maxMoe;
                    minMoe = minMoe > 0 ? 0 : minMoe;
                    this.chart.yAxis[0].setExtremes(minMoe, maxMoe);
                }
                this.chart.redraw();
            }
        });
    }

    toggleMOEs() {
        this.showMOES = !this.showMOES;
        this.chart.series.forEach((series: any, idx: number) => {
            console.log('series', idx, series);
            if (series.options.type === 'errorbar' && this.showMOES) {
                console.log('should show errorbars');
                series.show();
            }
            if (series.options.type === 'errorbar' && !this.showMOES) {
                console.log('should hide errorbars');
                series.hide();
            }
        });
    }

    checkScreenSize() {
        if ($(window).width() < 481) {
            this.isHandheld = true;
        }
    }

    onResize(event: any) {
        if (this.chart) {
            this.chart.legend.update(this.setLegendOptions());
            var runInterval = setInterval(runCheck, 1050);
            var resizeScope = this;
            function runCheck() {
                let newWidth = resizeScope.elementRef.nativeElement.offsetWidth - 100 > $('.map-chart').width() ? resizeScope.elementRef.nativeElement.offsetWidth - 100 : $('.map-chart').width();
                $('.ui-slider-wrapper').css('width', newWidth - 93 + 'px');
                clearInterval(runInterval);
            }
        }
    }

    setLegendOptions() {
        //console.log('legendOptions', $('#data-tile-wrapper').width(), this.elementRef.nativeElement.offsetWidth, $(this.elementRef.nativeElement).width());
        let domTileWidth = $('#data-tile-wrapper').width();
        return {
            width: this.viewType === 'basic' ? domTileWidth - 80 : 400,
            itemWidth: this.viewType === 'basic' ? domTileWidth - 20 : 200,
            itemStyle: {
                width: this.viewType === 'basic' ? domTileWidth - 40 : 180,
                color: '#4d4d4d'
            },
            title: {
                text: this.isStatewide ? null : 'LEGEND: <span style="font-size: 9px; color: #666; font-weight: normal">(Click to hide series in chart)</span>'
            }
        };
    }

    //getDrillDownData(place: any, subsubtopic: any) {
    //    $.ajax({
    //        type: "POST",
    //        async: true,
    //        url: 'crt_services.asmx/get_indicator_drilldown_data', //front end service that connects to crt GeoSearchService for searching
    //        contentType: "application/json; charset=utf-8",
    //        data: '{"subtopic":"' + indicatorData.Metadata[0].Sub_Topic_Name + '", "subsubtopic":' + (subsubtopic !== undefined ? '"' + subsubtopic + '"' : null) + ', "removeIndicator":"' + indicatorData.Metadata[0].Variable + '", "geoid":"' + place_data_years[place.replace(isSchoolDist ? " School District" : " County", "")].geoid + '", "geoType":"' + (params.geoType !== undefined ? params.geoType : "County") + '"}',
    //        dataType: "json",
    //        success: function (response) {
    //            var isStateWide = place === "Oregon" || place === "Statewide" ? true : false;
    //            if (isStateWide && !$("#map_container").hasClass("hidden"))
    //            { deselectAll(); }
    //            $('#ckbxShowAll')[0].checked = false;
    //            $('#showAll').css("display", "none");
    //            $('#spHideOregon')[0].style.display = 'none';
    //            showAllReset = true;
    //            if (place !== "Oregon" && place !== "Statewide") {
    //                mapChart.get(place.replace(isSchoolDist ? ' School District' : ' County', '')).select();
    //            }
    //            drillDownData = JSON.parse(response.d);
    //            drill_data = processDrillDownData(drillDownData.Data);
    //            drilldownShowing = true;
    //            $('#title').html(place);
    //            //$('#info .subheader').html('<h4>' + drillDownData.Metadata[0].Sub_Topic_Name + '</h4>');
    //            $('#info .subheader').html('<h4>' + drillDownData.Metadata[0].Sub_Topic_Name.replace((' by ' + drillDownData.Metadata[0].Sub_Sub_Topic), '') + (drillDownData.Metadata[0].Sub_Sub_Topic !== "Total" ? ' by ' + drillDownData.Metadata[0].Sub_Sub_Topic : '') + '</h4>');
    //            //$('#chart_tip_2').css("display", "none");

    //            //remove current series
    //            while (detailChart.series.length > 0) {
    //                detailChart.series[detailChart.series.length - 1].remove(false);
    //            }
    //            var removeText = getRemoveText(drillDownData.Metadata);

    //            $.each(drill_data.years, function () {
    //                detailChart.addSeries({
    //                    id: toCamelCase(this.name.replace(removeText, '')),
    //                    name: toCamelCase(this.name.replace(removeText, '')),
    //                    type: 'line',
    //                    lineWidth: 2,
    //                    lineColor: isState && subsubtopic === "Total" ? '#A3A3A4' : null,
    //                    lineOpacity: 1.0,
    //                    marker: {
    //                        symbol: isState && subsubtopic === "Total" ? 'url(./css/img/oe_marker.png)' : 'circle',
    //                        lineColor: null
    //                    },
    //                    data: drill_data.years[this.name].data
    //                }, false);
    //            });
    //            if (hasMOEs) {
    //                $.each(drill_data.years_moe, function () {
    //                    detailChart.addSeries({
    //                        whiskerLength: 30,
    //                        name: toCamelCase(this.name.replace(removeText, '')) + ' Margin of Error',
    //                        type: 'errorbar',
    //                        data: drill_data.years_moe[this.name].data,
    //                        visible: $('#chbxShowMoe')[0].checked,
    //                        linkedTo: toCamelCase(this.name.replace(removeText, ''))
    //                    }, false);
    //                });
    //                setYextremes(false);
    //            }
    //            var subTopicYaxis = drillDownData.Metadata[0]['Y-Axis'] !== null ? drillDownData.Metadata[0]['Y-Axis'] : drillDownData.Metadata[0].Sub_Topic_Name;
    //            detailChart.yAxis[0].setTitle({
    //                text: subTopicYaxis,
    //                //margin: subTopicYaxis.length > 30 ? 25 : null,
    //                style: { "font-size": subTopicYaxis.length > 30 ? ".8em" : "1em" }
    //            });

    //            detailChart.legendShow();
    //            detailChart.redraw();
    //            generateACSTooltips();
    //            detailChart.hideLoading();
    //            drilldownShowing = true;
    //            $('#chbxShowMoe')[0].style.display = hasMOEs ? 'block' : 'none';
    //            $('#lblShowMoe')[0].style.display = hasMOEs ? 'block' : 'none';
    //            $('#related-indicators').css("display", indicatorData.SubTopicCategories && (isGPI || isState) ? "block" : "none");
    //            $('#drill-down-categories').css("display", indicatorData.SubTopicCategories && !(isGPI && isState) ? "block" : "none");
    //        },
    //        error: function (e) {
    //            $("#divResult").html("WebSerivce unreachable");
    //        }
    //    });
    //}

    //generateACSTooltips() {
    //    $jq('.hastip').tooltipsy(
    //        {
    //            css: {
    //                'padding': '10px',
    //                'max-width': '200px',
    //                'color': '#303030',
    //                'background-color': '#f5f5b5',
    //                'border': '1px solid #deca7e',
    //                '-moz-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
    //                '-webkit-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
    //                'box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
    //                'text-shadow': 'none'
    //            },
    //            delay: 0
    //        });
    //}

    getMaxMOE(data: any) {
        var max = 0;
        for (var x = 0; x < data.length; x++) {
            if (data[x] !== null) {
                max = max < data[x][1] ? data[x][1] : max;
            }
        }
        return max;
    }

    getMinMOE(data: any) {
        var min = 0;
        for (var x = 0; x < data.length; x++) {
            if (data[x] !== null) {
                min = min > data[x][0] ? data[x][0] : min;
            }
        }
        return min;
    }

    setYextremes() {
        var extremes = this.chart.yAxis[0].getExtremes();
        var maxData = this.getMaxData(false);
        var minData = this.getMinData(false);
        maxData = maxData < extremes.max ? extremes.max : maxData;
        minData = minData > 0 ? 0 : minData;
        this.chart.yAxis[0].setExtremes(minData, maxData);
    }

    checkSelectedPlaceOnLoad(place: any) {
        let isSelected = false;
        for (var p = 0; p < this.places.length; p++) {
            isSelected = place.geoid === this.places[p].ResID ? true : isSelected;
        }
        return isSelected;
    }

    processDataYear() {
        this.yearStartOffset = 0;
        let place_data = [{}];
        let place_data_years: any = {};
        let place_data_years_moe: any = {};
        let hasData = false;
        for (var d = 0; d < this.placeTypeData.Data.length; d++) {
            var pData: any = this.placeTypeData.Data[d];
            //FOR MAP VIEW
            let statewideFilter: any[] = ['Oregon', 'Rural Oregon', 'Urban Oregon', 'California', 'Rural California', 'Urban California'];
            if (statewideFilter.indexOf(pData.community) === -1) {
                place_data.push({
                    name: pData.community,
                    geoid: pData.geoid,
                    value: pData[this.selectedYear.Year] === -1 ? 0 : pData[this.selectedYear.Year],
                    year: this.selectedYear.Year,
                    id: pData.community,
                    selected: this.checkSelectedPlaceOnLoad(pData),
                    placeType: statewideFilter.indexOf(pData.community) === -1 ? this.translatePlaceTypes(this.selectedPlaceType) : 'Statewide'
                });
            }
            let year_data: any[] = [];
            let year_data_moe: any[] = [];

            var prevYear: string;
            for (var y = 0; y < this.placeTypeData.Years.length; y++) {
                var _year = this.placeTypeData.Years[y].Year;
                var yearsToAdd = 0;
                if (prevYear) {
                    var firstYr = prevYear.split('-')[0];
                    var secondYr = _year.split('-')[0];
                    yearsToAdd = parseInt(secondYr) - parseInt(firstYr);
                }
                if (hasData) {
                    for (var x = 0; x < yearsToAdd - 1; x++) {//add in between values for chart display
                        year_data.push(null);
                        year_data_moe.push(null);
                    }
                } else {
                    hasData = $.isNumeric(pData[_year]) ? true : hasData;
                    this.yearStartOffset = !hasData ? this.yearStartOffset + 1 : this.yearStartOffset;
                }
                if (hasData) {
                    year_data.push($.isNumeric(pData[_year]) ? parseFloat(pData[_year]) : null);
                    if (_year.match('-')) {
                        year_data_moe.push([parseFloat(pData[_year]) - parseFloat(pData[_year + '_MOE']), parseFloat(pData[_year]) + parseFloat(pData[_year + '_MOE'])]);
                    } else {
                        year_data_moe.push(null);
                    }
                }
                prevYear = _year;
            }
            place_data_years[pData.community] = {
                id: pData.community,
                name: pData.community,
                geoid: pData.geoid,
                data: year_data
            };
            place_data_years_moe[pData.community] = {
                id: pData.community,
                name: pData.community,
                geoid: pData.geoid,
                data: year_data_moe
            };
        }
        let chart_data: any = {
            place_data: place_data,
            place_data_years: place_data_years,
            place_data_years_moe: place_data_years_moe
        };
        if (this.tileType === 'map' && !this.isStatewide) {
            this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].chart_data = chart_data;
        } else {
            this.dataStore.indicatorData[this.indicator].chart_data = chart_data;
        }
        //console.log('funions');
        //console.log(this.dataStore);
        //add a dataset for no data MAP DISPLAY ONLY
        //if (this.tileType === 'map') {
        //    for (var x = 0; x < this.selectedMapData.features.length; x++) {
        //        var mData: any = this.selectedMapData.features[x];
        //        var lookupResult = this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].chart_data.place_data.filter((place: any) => {
        //            return place.geoid === mData.properties.GEOID && place.value === null;
        //        });
        //        if (lookupResult.length === 1) {
        //            this.county_map_no_data.push(mData);
        //            //add to place_data for empty results.
        //            this.county_no_data.push({
        //                geoid: mData.properties.GEOID,
        //                id: mData.properties.GEOID,
        //                name: mData.properties.NAME,
        //                value: 0,
        //                year: this.selectedYear.Year
        //            });
        //        }
        //    }
        //}
    }

    processYearTicks() {
        console.log('yearStartOffset', this.yearStartOffset, this.tileType);
        var counter = 0;// this.yearStartOffset;
        var counterTime = 0;// this.yearStartOffset;
        var prevYear: any;
        var labelEveryYear = this.placeTypeData.Years.length - this.yearStartOffset > 10 ? false : true;
        var labelEveryThirdYear = this.placeTypeData.Years.length - this.yearStartOffset > 20 ? true : false;
        var labelYear = true;
        var labelThirdYear = true;
        var labelYearCounter = 1;
        this._tickArray = [];
        this._tickLabels = [];
        this._tickLabelsTime = [];
        for (var y = this.yearStartOffset; y < this.placeTypeData.Years.length; y++) {
            var yearsToAdd = 0;
            var Year = this.placeTypeData.Years[y].Year;
            if (prevYear) {
                var firstYr = prevYear.split('-')[0];
                var secondYr = Year.split('-')[0];
                yearsToAdd = parseInt(secondYr) - parseInt(firstYr);
            }
            for (var x = 1; x < yearsToAdd; x++) {//add in between values for chart display
                this._tickLabels[counter] = (parseInt(prevYear.split('-')[0]) + x).toString();
                this._tickArray.push(counter);
                counter++;
            }
            this._tickLabels[counter] = Year;
            this._tickArray.push(counter);
            this.selectedYearIndexArray[Year] = counter;
            this._tickLabelsTime[counterTime] = labelEveryThirdYear ? (labelYearCounter === 3 || counter === 0 ? Year : '') : (labelEveryYear ? Year : (labelYear ? Year : ''));
            this._tickArrayTime.push(labelEveryThirdYear ? (labelYearCounter === 3 || counter === 0 ? counterTime : '') : (labelEveryYear ? counterTime : (labelYear ? counterTime : '')));
            counter++;
            counterTime++;
            if (Year.match('-')) {
                this.hasMOEs = true;
            }
            prevYear = Year;
            labelYear = !labelYear;
            labelYearCounter = (labelThirdYear && labelYearCounter === 3) ? 1 : labelYearCounter + 1;
        }
    }

    getDefaultYear() {
        //start at the end and move back until you find data
        //console.log('looking for year data');
        let counter = 0;
        for (var y = this.placeTypeData.Years.length - 1; y > 0; y--) {
            counter++;
            let hasData = false;
            for (var d = 0; d < this.placeTypeData.Data.length; d++) {
                //console.log(this.placeTypeData.Data[d][this.placeTypeData.Years[y].Year]);
                if (this.placeTypeData.Data[d][this.placeTypeData.Years[y].Year] !== null) {
                    hasData = true;
                    break;
                }
            }
            if (hasData) {
                break;
            }
        }
        return counter;
    }

    getMinData(isMap: boolean, chartType?: boolean) {
        var min: any;
        var notLogrithmic = false;
        //console.log('checking chart_data', this.selectedPlaceType, this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].chart_data, this.dataStore);
        let chart_data = this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].chart_data;
        //need to combine data with moes to get proper min/ max
        var pdy = $.extend(true, {}, isMap ? chart_data.place_data_years : this.hasMOEs ? chart_data.place_data_years_moe : chart_data.place_data_years);
        $.each(pdy, function () {
            //removes statewide data
            if (this.geoid.length > 4) {
                var arr = $.grep(this.data, function (n: any) { return (n); });//removes nulls
                if (chartType && arr.length !== this.data.length) {
                    notLogrithmic = true;
                }
                var PlaceMin = isMap ? arr.sort(function (a: any, b: any) { return a - b; })[0] : this.hasMOEs ? arr.sort(function (a: any, b: any) { return a[1] - b[1]; })[0] : null;
                min = min === undefined ? isMap ? PlaceMin : this.hasMOEs ? PlaceMin[0] : min : min;// (min > isMap ? PlaceMin : hasMOEs ? PlaceMin[0] : min) ? PlaceMin : min;
                if (isMap) {
                    min = min > PlaceMin ? PlaceMin : min;
                } else if (this.hasMOEs) {
                    min = min > PlaceMin[0] ? PlaceMin[0] : min;
                } else {
                    min = min > PlaceMin ? PlaceMin : min;
                }
            }
        });
        return notLogrithmic ? 0 : min < 10 ? 0 : min;
    }

    getMaxData(isMap: boolean) {
        var max: any = 0;
        let chart_data = this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].chart_data;
        var pdy = $.extend(true, {}, isMap ? chart_data.place_data_years : this.hasMOEs ? chart_data.place_data_years_moe : chart_data.place_data_years);
        $.each(pdy, function () {
            //removes statewide data
            if (this.geoid.length > 4) {
                var arr = $.grep(this.data, function (n: any) { return (n); });//removes nulls
                var PlaceMax = isMap ? arr.sort(function (a: any, b: any) { return b - a; })[0] : this.hasMOEs ? arr.sort(function (a: any, b: any) {
                    return b[1] - a[1];
                })[0] : null;
                if (isMap) {
                    max = parseFloat(max) < parseFloat(PlaceMax) ? parseFloat(PlaceMax) : parseFloat(max);
                } else if (this.hasMOEs) {
                    max = parseFloat(max) < parseFloat(PlaceMax[1]) ? parseFloat(PlaceMax[1]) : parseFloat(max);
                } else {
                    max = parseFloat(max) < parseFloat(PlaceMax) ? parseFloat(PlaceMax) : parseFloat(max);
                }
            }
        });
        return max;
    }

    formatValue(val: any, isLegend: boolean) {
        var returnVal = val;
        switch (this.placeTypeData.Metadata[0].Variable_Represent.trim()) {
            case '%':
                returnVal = Math.round(parseFloat(val) * 100) / 100 + '%';
                break;
            case '%1':
                returnVal = Math.round(parseFloat(val) * 10) / 10 + '%';
                break;
            case '%Tenth':
                returnVal = Math.round(parseFloat(val) * 10) / 10 + '%';
                break;
            case '0':
                returnVal = isLegend ? this.formatAbvNumbers(val, true, 0) : this.addCommas(Math.round(parseInt(val)).toString());
                //isLegend ? (val > 999 ? addCommas((val / 1000).toFixed(0)) + 'k' : val) : addCommas(Math.round(parseInt(val)));
                break;
            case '2':
                returnVal = this.addCommas((Math.round(parseFloat(val) * 100) / 100).toString());
                break;
            case '$':
                returnVal = '$' + this.formatAbvNumbers(val, isLegend, 1);
                //addCommas(Math.round(parseFloat(val) * 10) / 10)
                break;
            case '$0':
                returnVal = '$' + this.formatAbvNumbers(val, isLegend, 0);
                break;
            case '$Thousand':
                returnVal = '$' + this.formatAbvNumbers((val * 1000), isLegend, 2);
                break;
            case '$Bill2009':
                returnVal = '$' + Math.round(parseFloat(val) * 100) / 100 + 'bn';
                break;
            case '#Jobs':
                returnVal = val > 999 ? (val / 1000).toFixed(0) + 'k Jobs' : val;
                break;
            default:
                break;
        }
        return returnVal;
    }

    formatAbvNumbers(val: any, isLegend: boolean, numDecimals: number) {
        return (val > 999999999 ? (this.addCommas((val / 1000000000).toFixed(isLegend ? (val / 1000000000) < 10 ? 1 : 0 : numDecimals)) + 'bn') : val > 999999 ? (this.addCommas((val / 1000000).toFixed(isLegend ? (val / 1000000) < 10 ? 1 : 0 : numDecimals)) + 'mil') : val > 999 ? (this.addCommas((val / 1000).toFixed(isLegend ? (val / 1000) < 10 ? 1 : 0 : numDecimals)) + 'k') : val);
    }

    pluralize(value: string) {
        switch (value) {
            case 'County':
            case '':
                return 'Counties';
            case 'Census Tract':
                return 'Census Tracts';
            case 'Incorpor':
            case 'Incorporated City':
            case 'Place':
            case 'Towns':
            case 'Census Designated Place':
                return 'Places';
            default:
                return value;
        }
    }

    addCommas(nStr: string) {
        nStr += '';
        let x = nStr.split('.');
        let x1 = x[0];
        let x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }

    toCamelCase(str: string) {
        return str !== null ? str.replace(/([^\W_]+[^\s-]*) */g, function (txt: string) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) : null;
    }

    gotoDetails() {
        //console.log('placename', this.placeNames);
        this._router.navigate(['Explore', { indicator: encodeURI(this.indicator.replace(/\(/g, '%28').replace(/\)/g, '%29')).replace('%2528', '%28').replace('%2529', '%29').replace(/\+/g, '%2B'), places: this.placeNames }]);
        window.scrollTo(0, 0);
    }

    onTimeSliderChange(evt: any) {
        //console.log('well hot digity dog');
    }

    onSelectedMapViewChange(evt: any) {
        if (this.selectedPlaceType !== this.translatePlaceTypes(evt)) {
            this.selectedPlaceType = this.translatePlaceTypes(evt);
            this.mapChart.showLoading();
            this.checkDataStateForCharts('mapViewChange');
        }
    }

    reflowChart() {
        if (this.tileType !== 'map') {
            this.chart.reflow();
        }
    }

    zoomToPlace(evt: any, point: any) {
        //console.log('point', point);
        this.mapChart.get(point).zoomTo();
    }

    getCollectionIcon(collection: any) {
        let collInfo = this.collections.filter((coll: any) => coll.collection === collection);
        return collInfo.length > 0 ? collInfo[0].icon_path : '';
    }

    ngOnInit() {
        console.log(this.defaultAdvChartOptions);
        this.defaultChartOptions.title = { text: this.indicator };
        this.defaultChartOptions.chart.spacingTop = this.viewType === 'advanced' ? 50 : this.defaultChartOptions.chart.spacingTop;
        if (this.tileType === 'map' && !this.isStatewide) {
            for (var pt in this.dataStore) {
                //console.log('place type in data store', pt, this.dataStore);
                this.dataStore[pt].indicatorData = {};
                this.dataStore[pt].mapData = {};
            }
        } else {
            //gets set in datawrapper
            //TODO: turn into observable service, or roll into indicator info as optional separate table
            this.collections = window.crt_collections ? window.crt_collections : [];
        }
    }

    ngOnDestroy() {
        if (this.subscription !== undefined) {
            this.subscription.unsubscribe();
        }
        if (this.geoSubscription !== undefined) {
            this.geoSubscription.unsubscribe();
        }
        if (this.dataSubscription !== undefined) {
            this.dataSubscription.unsubscribe();
        }
    }
}

Highcharts.Legend.prototype.update = function (options: any) {
    this.options = Highcharts.merge(this.options, options);
    this.chart.isDirtyLegend = true;
    this.chart.isDirtyBox = true;
    this.chart.redraw();
};

/**
 * Highstock plugin for zooming out X-Axis by dragging from right to left.
 *
 * Author: Roland Banguiran
 * Email: banguiran@gmail.com
 *
 * Usage: Set zoomType to 'x'.
 */

// JSLint options:
/*global Highcharts */

(function (H: any) {

    H.wrap(H.Chart.prototype, 'init', function (proceed: any) {

        // Run the original proceed method
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));

        var chart = this,
            options = chart.options,
            zoomType = options.chart.zoomType,
            container = chart.container,
            xAxis = chart.xAxis[0],
            extremes: any,
            dataMin: any,
            dataMax: any,
            min: any,
            max: any,
            selectFromPixels: any,
            selectToPixels: any,
            pixelDiff: any,
            valueDiff: any,
            newMin: any,
            newMax: any;

        if (zoomType === 'x') {

            H.addEvent(container, 'mousedown', function (e: any) {
                selectFromPixels = chart.pointer.normalize(e).chartX;
            });

            H.addEvent(container, 'mouseup', function (e: any) {
                selectToPixels = chart.pointer.normalize(e).chartX;
                pixelDiff = selectToPixels - selectFromPixels;
            });

            H.addEvent(chart, 'selection', function (e: any) {
                //console.log(e);

                if (pixelDiff < 0) {
                    extremes = xAxis.getExtremes();
                    dataMin = extremes.dataMin;
                    dataMax = extremes.dataMax;
                    min = extremes.min;
                    max = extremes.max;

                    valueDiff = Math.abs(xAxis.toValue(selectToPixels) - xAxis.toValue(selectFromPixels));
                    newMin = min - valueDiff;
                    newMax = max + valueDiff;

                    newMin = (newMin > dataMin) ? newMin : dataMin;
                    newMax = (newMax < dataMax) ? newMax : dataMax;

                    xAxis.setExtremes(newMin, newMax);

                    e.preventDefault();
                }
            });
        }
    });
} (Highcharts));
