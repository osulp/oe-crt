import {Component, Input, OnInit, ElementRef, Output, EventEmitter, Inject, OnDestroy, ViewChild, OnChanges} from '@angular/core';
import {JSONP_PROVIDERS}  from '@angular/http';
import {Router} from '@angular/router';
import {CHART_DIRECTIVES, Highcharts} from 'angular2-highcharts';
import * as Highchmap from 'highcharts/modules/map';
import * as HighchartsMore from 'highcharts/highcharts-more';
//import * as HighchDD from 'highcharts/modules/drilldown';
import {Subscription}   from 'rxjs/Subscription';
import {HmapMenuComponent} from './hmap-menu/hmap.menu.component';
import {Year, CommunityData, SearchResult} from '../../data_models/index';
import {SelectedDataService, DataService, GeoJSONStoreService, GetGeoJSONService, PlaceTypeService, SelectedPlacesService, IndicatorDescService} from '../../services/index';
import {MapChartPlaceZoomPipe} from '../../pipes/index';

declare var $: any;
declare var window: any;

Highcharts.setOptions({
    colors: ['#058DC7', '#50B432', '#ED561B', '#24CBE5', '#64E572', '#FF9655', '#6AF9C4', '#705c3b', '#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#FFF263',
        '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1']
});



// Make monochrome colors and set them as default for all pies
//Highcharts.getOptions().plotOptions.pie.colors = (function () {
//    var colors:any[] = [],
//        base = Highcharts.getOptions().colors[0],
//        i:number;

//    for (i = 10; i > 0; i -= 1) {
//        // Start out with a darkened base color (negative brighten), and end
//        // up with a much brighter color
//        colors.push(Highcharts.Color(base).brighten((i - 3) / 7).get());
//    }
//    return colors;
//} ());

//// Radialize the colors
//Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color:any) {
//    return {
//        radialGradient: {
//            cx: 0.5,
//            cy: 0.5,
//            r: 0.45
//        },
//        stops: [
//            [0, color],
//            [1, color],
//            [2, color],
//            [3, color],
//            [4, color],
//            [5, color],
//            [6, color],
//            [7, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
//        ]
//    };
//});

Highchmap(Highcharts);
HighchartsMore(Highcharts);
//HighchDD(Highcharts);

interface Chart {
    //xAxis: [{
    //    setCategories: any;
    //    options: any;
    //}];
    xAxis: any;
    yAxis: any;
    events: any;
    series: any;
    drilldown: { series: any[] };
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
    destroy: any;
    zoomOut: any;
    renderer: any;
    zoomGroupButton: any;
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


export class DataTileComponent implements OnInit, OnDestroy, OnChanges {
    @Input() indicator: any;//Just name pull rest of info from desc service
    @Input() tileType: any;//map/graph/table
    @Input() viewType: any;//basic/advanced
    @Input() featured: any;//variable and geoids
    @Input() related: boolean;
    @Input() collections: any[];
    @Input() _selectedYear: any;
    @ViewChild(HmapMenuComponent) hMapMenu: HmapMenuComponent;
    @Output() onChartDataUpdate = new EventEmitter();
    @Output() onSelectedYearChange = new EventEmitter();
    public geoJSONStore: any[] = [];
    elementRef: ElementRef;
    public places = new Array<SearchResult>();
    private subscription: Subscription;
    private geoSubscription: Subscription;
    private dataSubscription: Subscription;
    private placeNames: string = '';
    private tempPlaces: Array<SearchResult>;
    private placeTypeData: CommunityData;
    private dataStore: any;
    private Data: any;
    private AllData: any;
    private placeTypes: string[] = [];
    private selectedPlaceType: string = 'County';
    private selectedMapData: any;
    private selectedYear: Year;
    private selectedYearIndex: number;
    private selectedYearIndexArray: any = {};
    private _tickArray: number[] = [];
    private _tickLabels: any[] = [];
    private _tickLabelsTime: any[] = [];
    private hasDrillDowns: boolean = false;
    private hasMOEs: boolean;
    private showMOES: boolean = true;

    private county_no_data: any = [];
    private county_map_no_data: any = [];
    private animationCounter: number = -1;
    private sliderState: string = 'play';
    private isHandheld: boolean = $(window).width() < 481;// false;
    private placeTypeGeoYears: any;
    private showSlider: boolean = true;
    private isSliderInit: boolean = false;
    private isCountyLevel: boolean = false;
    private isStatewide: boolean = false;
    private isSchool: boolean = false;
    private isNotCombinable: boolean = false;
    private hasCombined: boolean = false;
    private isTOP: boolean = false;
    private is10yr: boolean = false;
    //private collections: any[] = [];
    private indicator_collections: any[] = [];
    private indicator_geo: any = 'County';
    private yearStartOffset: number = 0;
    private yearEndOffset: number = 0;
    private indicator_info: any;
    private showMap: boolean = true;
    private selectedCustomChartYear: string;
    private customChartYears: any[] = [];
    private isCustomChart: boolean = false;
    private selectedPlaceCustomChart: any;
    private selectedPlaceColor: any;
    private dataAttempts: any = 0;
    private isDrilldown: boolean = false;
    private drillDownPlace: any;
    private drillDownType: any = 'Race/Ethnicity';


    private xAxisCategories: any = {};
    private defaultChartOptions = {
        chart: {
            type: 'line',
            //marginRight: 15,
            //marginLeft: 15,
            //spacingLeft: 60,
            //spacingRight: 15,
            events: {
                drilldown: function (e: any) {
                    console.log('benny is drillin', e);
                }
            },
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

        plotOptions: {
            series: {
                events: {
                    legendItemClick: function (event: any) {
                        console.log('series hidden');
                    }
                }
            },
            column: {
                maxPointWidth: 50
            }
        },
        title: {
            text: '',
            style: {
                align: this.viewType === 'basic' ? 'left' : null,
                style: {
                    fontSize: '1.25em',
                    fontWeight: '200'
                },
                //widthAdjust: -10,
                //x: -30
            }
        },
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
            marginRight: this.isHandheld ? null : 15,
            marginLeft: this.isHandheld ? null : 70,
            spacingLeft: this.isHandheld ? 10 : 30,
            spacingRight: this.isHandheld ? 10 : 35,
            spacingTop: this.isHandheld ? 0 : 55,
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
        plotOptions: {
            series: {
                events: {
                    legendItemClick: function (event: any) {
                        this.chart.yAxis[0].setExtremes();
                    }
                }
            }
        },
        title: {
            text: ''
        },
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
    private mapChartZoomSettings: any = {};
    private selectedMapPoints: any = [];

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
                type: 'map',
                spacingTop: this.isHandheld ? 20 : null
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
                text: this.isHandheld ? 'Oregon Explorer and OSU Rural Studies Program' : 'Maps and Charts provided by Oregon Explorer and OSU Rural Studies Program',
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
                        x: this.isHandheld ? 0 : 8,
                        y: -8
                    },
                    zoomOut: {
                        x: this.isHandheld ? 0 : 8,
                        y: 20
                    }
                }
            },
            plotOptions: {
                map: {
                    point: {
                        events: {
                            //select: function (selectScope: any,funk:any) {
                            //    console.log('juniper', selectScope,funk);
                            //    scope.selectedPlaceColor = selectScope.target.color;
                            //    return true;
                            //}
                            //mouseOver: function (mouseinscope: any) {
                            //    console.log('mouse in', mouseinscope, scope);
                            //    if (mouseinscope.target['NAME'] && mouseinscope.target['selected'] === true) {
                            //        console.log('lemons', mouseinscope.target.color);
                            //        //mouseinscope.target
                            //        //    .series.update({
                            //        //    states: {
                            //        //        select: {
                            //        //            color: mouseinscope.target.color
                            //        //        }
                            //        //    }
                            //        //});
                            //        //scope.mapChart.series[0].data.forEach((d:any)=> {
                            //        //    if (d.geoid === mouseinscope.target.geoid) {
                            //        //        console.log('updating color?', scope.temp_map_path_color);
                            //        //        d.update({ color: mouseinscope.target.color });
                            //        //        //d.update({ color: 'Red'});
                            //        //    }
                            //        //});
                            //    }
                            //    //scope.selectAndOrderMapPaths();
                            //}

                            //    console.log('mousein', mouseinscope);
                            //    if (mouseinscope.target.selected) {
                            //        scope.temp_map_path_color = mouseinscope.target.color;
                            //    }
                            //},
                            //mouseOut: function (mouseoutscope:any) {
                            //    console.log('mouse out', mouseoutscope, scope.temp_map_path_color);
                            //    if (mouseoutscope.target.selected) {
                            //        scope.mapChart.series[0].data.forEach((d:any)=> {
                            //            if (d.geoid === mouseoutscope.target.geoid) {
                            //                console.log('updating color?', scope.temp_map_path_color);
                            //                //d.update({ color: scope.temp_map_path_color });
                            //                //d.update({ color: 'Red'});
                            //            }
                            //        });
                            //    }
                            //    //scope.selectAndOrderMapPaths();
                            //}
                        }
                    }
                }
            },
            colorAxis: {},
            xAxis: {},
            yAxis: {},
            tooltip: {
                hideDelay: 1,
                followPointer: false,
                borderWidth: 1,
                shadow: false
            }
        };
        this.dataStore = {
            Counties: {},
            Places: {},
            Tracts: {},
            SchoolDistricts: {},
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

        this._indicatorDescService.getIndicator(this.indicator.replace(/\+/g, '%2B').replace(/\&/g, '%26').replace(/\=/g, '%3D')).subscribe(
            (indicatorDesc: any) => {
                this.indicator_info = indicatorDesc.Desc[0];
                if (this.indicator_info) {
                    console.log('this.indicator_info', this.indicator_info);
                    this.isStatewide = this.indicator_info.Geog_ID === 8 ? true : false;
                    this.indicator_geo = this.indicator_info.indicator_geo;
                    this.isCountyLevel = this.indicator_info.CountyLevel || this.indicator_geo === 'County';
                    this.isTOP = this.indicator_info.isTOP;
                    this.is10yr = this.indicator_info.is10yrPlan;
                    this.isSchool = this.indicator_geo.indexOf('School') !== -1;
                    this.isCustomChart = this.indicator_info.ScriptName !== null && !this.isSchool;
                    this.showMap = this.isStatewide || this.isCustomChart ? false : true;
                    if (this.hMapMenu) {
                        this.hMapMenu.setIndicatorGeoFilter(this.indicator_geo);
                    }
                    this.indicator_collections = this.indicator_info.collections ? this.indicator_info.collections.split(', ') : [];

                    if (this.indicator_info.Represented_ID === 10 && this.tileType === 'graph' && this.viewType === 'basic') {
                        this.chart.showLoading('Chart not available. See map and table view');
                        this.chart.setTitle({
                            text: this.viewType === 'basic' || this.isHandheld ? this.indicator.replace('<br>', ' ') : null,
                            align: this.viewType === 'basic' ? 'left' : this.isHandheld ? 'center' : null,
                            style: {
                                fontSize: '1.25em',
                                fontWeight: '200'
                            },
                            //widthAdjust: -10,
                            //x: -30
                        });
                        try {
                            this.chart.legend.update(this.setLegendOptions(false));
                        } catch (ex) {
                            console.log('failed', ex);
                        }
                    } else {
                        this.subscription = this._selectedPlacesService.selectionChanged$.subscribe(
                            data => {
                                console.log('selected places subscribe throwing event', data);
                                this.onPlacesChanged(data);
                            },
                            err => console.error(err),
                            () => console.log('done with subscribe event places selected')
                        );
                        if (this.tileType === 'map' && this.showMap) {
                            this.geoSubscription = this._geoStore.selectionChanged$.subscribe(
                                data => {
                                    this.geoJSONStore = data;
                                    console.log('new geojson file loaded', data);
                                    //this.onGeoJSONChanged(data);
                                },
                                err => console.error(err),
                                () => console.log('done loading geojson')
                            );
                        }

                        this.dataSubscription = this._selectedDataService.selectionChanged$.subscribe(
                            data => {
                                this.AllData = data;
                                this.onSelectedDataChanged(data);
                            },
                            err => console.error(err),
                            () => console.log('done with subscribe event places selected')
                        );

                        if (this.featured) {
                            console.log('featured chart', this.featured);
                            //need to add places to selected places
                            this.checkDataStateForCharts();
                        }
                    }
                }
            },
            (err: any) => console.log('error getting indicator description', err),
            () => console.log('loaded the indicator description in data tile')
        );

        var chartScope = this;
        // Wrap point.select to get to the total selected points
        Highcharts.wrap(Highcharts.Point.prototype, 'select', function (proceed: any) {
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));
            console.log('selecting via map', proceed, this, chartScope);
            //LOGIC:
            //For map tiles, need to handle the selection of map places, "points"
            //For map based selections, need to add to place search bin
            //For place bin selections, don' add again since it should already be in bin
            if (chartScope.tileType === 'map' && chartScope.showMap) {
                chartScope.selectedPlaceColor = this.color;
                var points = chartScope.mapChart.getSelectedPoints();
                chartScope.selectedMapPoints = points;
                var pointsAsPlacesForBin: any[] = [];
                for (var p = 0; p < points.length; p++) {
                    let place = points[p];
                    let binPlace: any;
                    var isInBin = false;
                    for (var b = 0; b < chartScope.places.length; b++) {
                        console.log('map point', points[p]);
                        console.log('place bin', chartScope.places[b]);
                        if (chartScope.isSchool) {
                            if (chartScope.places[b].GeoInfo) {
                                chartScope.places[b].GeoInfo.forEach((gi: any) => {
                                    isInBin = gi.School_District.indexOf(points[p].community) !== -1 ? true : isInBin;
                                });
                            }
                        } else {
                            isInBin = points[p].geoid === chartScope.places[b].ResID ? true : isInBin;
                        }

                        if (isInBin) {
                            console.log('IS in BIn', chartScope.places[b]);
                            binPlace = chartScope.places[b];
                            pointsAsPlacesForBin.push(binPlace);
                        }
                    }

                    if (!isInBin) {
                        console.log('is not in bin!', points[p]);
                        pointsAsPlacesForBin.push({ Name: place.id + (chartScope.selectedPlaceType === 'Counties' ? ' County' : ''), ResID: place.geoid, Type: 'Place', TypeCategory: chartScope.selectedPlaceType, Source: 'map', GeoInfo: [] });
                    }
                    //pointsAsPlacesForBin.push({ Name: place.id + (chartScope.selectedPlaceType === 'Counties' ? ' County' : ''), ResID: place.geoid, Type: 'Place', TypeCategory: chartScope.selectedPlaceType, Source: 'map', Combined: false });
                }
                pointsAsPlacesForBin = pointsAsPlacesForBin.filter((place: any, index: number, self: any) => self.findIndex((t: any) => { return t.ResID === place.ResID && t.Name === place.Name; }) === index);
                console.log('queue adding from map', chartScope.tileType, pointsAsPlacesForBin, chartScope.selectedPlaceType);
                console.log('queue here are the places from map click', chartScope.places, points);
                chartScope._selectedPlacesService.setAllbyPlaceType(pointsAsPlacesForBin, chartScope.selectedPlaceType, chartScope.indicator_geo);
                //if (chartScope.indicator_info.Represented_ID === 10) {
                //    chartScope.onChartDataUpdate.emit({ data:chartScope.dataStore, customPlace: chartScope.selectedPlaceCustomChart, customYear:chartScope.selectedCustomChartYear, metadata:chartScope.indicator_info });
                //}
            }
        });
    }

    onPlacesChanged(selectedPlaces: SearchResult[]) {
        console.log('adding DataTile place change', selectedPlaces, this.tempPlaces);
        this.places = selectedPlaces;
        this.placeNames = '';
        this.isDrilldown = false;
        let checkDataState: boolean = false;
        //check if repeated event with same places
        if (this.tempPlaces.length !== this.places.length) {
            checkDataState = true;
            //console.log('temp place not the same as place length, adding ...');
            for (var x = 0; x < this.places.length; x++) {
                //console.log('place: ', this.places[x]);
                //set selected place type based on new addition place type
                if (this.tempPlaces.indexOf(this.places[x]) === -1 && this.getGeoIndicator(this.places[x])) {
                    //is the new addition
                    this.selectedPlaceType = this.isCountyLevel ? 'Counties' : this.translatePlaceTypes(this.places[x].TypeCategory);
                    this.selectedPlaceType = this.isSchool ? 'SchoolDistricts' : this.selectedPlaceType;

                    this.selectedPlaceCustomChart = this.places[x];
                    //console.log('selectedPlaceType set:', this.selectedPlaceType);
                }
                this.tempPlaces.push(this.places[x]);
                //used for goto details link creation
                this.placeNames += encodeURIComponent(JSON.stringify(this.places[x]));
                this.placeNames += (x < this.places.length - 1) ? ',' : '';
            }

        } else {
            //check if just updated geoinfo but same places
            let hasSamePlaces = true;
            this.places.forEach((place: any) => {
                // let tPlace = this.tempPlaces.filter((tp: any) => tp.Name === place.Name && tp.GroupName === place.GroupName);
                let tPlace = this.tempPlaces.filter((tp: any) => tp.Name === place.Name);
                console.log('place length the same', tPlace);
                //also check if combined

                if (tPlace.length === 0 || place.Combined) {
                    hasSamePlaces = false;
                    //return;
                }
                checkDataState = !hasSamePlaces;
            });
        }
        //console.log('prague', checkDataState, this.selectedPlaceType, this.getGeoIndicator(this.selectedPlaceType));
        if (checkDataState) {
            if (this.getGeoIndicator({ TypeCategory: this.selectedPlaceType })) {
                console.log('thinks it needs to update');
                this.checkDataStateForCharts();
                if (this.tileType === 'graph') {
                    if (this.chart) {
                        this.chart.showLoading();
                    }
                } else {
                    if (this.mapChart) {
                        this.mapChart.showLoading();
                    }
                }
            }
        }
        this.tempPlaces = this.places;
    }

    checkDataStateForCharts(source?: any) {
        console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbb', this.indicator_info);
        let loadingGeoJSON = this.tileType === 'map' && this.showMap ? this.checkLoadGeoJSON() : false;
        console.log('lodaindGeoJSON', loadingGeoJSON, this.tileType);
        if (this.tileType === 'graph') {
            //sets placetypes for graph knowing about county level data warnings, etc.
            this.getPlaceTypes('graph');
        }
        let loadMoreData = this.tileType === 'graph' ? true : this.checkUpdateData();
        console.log('loadMoreData', loadMoreData, this.tileType);
        if (!loadingGeoJSON && loadMoreData) {
            console.log('need to load data.  chart type: ', this.tileType);
            //check that if on advanced page only load for indicator not all indicators
            if (window.location.href.indexOf('indicator=') !== -1) {
                //console.log('on indicator detail page', this.indicator, window.location.href);
                //console.log('decode for data call', decodeURI(window.location.href).replace('%28', '(').replace('%29', ')'));
                if (decodeURI(window.location.href)
                    .replace(/\%28/g, '(')
                    .replace(/\%29/g, ')')
                    .replace(/\%2C/g, ',')
                    .replace(/\%24/g, '$')
                    .replace(/\%2B/g, '+')
                    .replace(/\%3D/g, '=')
                    //.replace(/\%26/g, '&')
                    .replace(/\%3D/g, '=')
                    //.replace(/\%3A/g, ':')
                    .indexOf(this.indicator) !== -1) {
                    console.log('yes siree');
                    this.getData();
                } else if (this.related) {
                    this.getData();
                }
            } else {
                this.getData();
            }
        } else if (!loadingGeoJSON) {
            console.log('NEED TO UPDATE MAP/CHART', this.tileType);
            if (this.tileType === 'map' && this.showMap) {
                //deselect to clear if place removed
                let selectedPlaces = this.mapChart.getSelectedPoints();
                //console.log('highmap selectedPlaces', selectedPlaces);
                //logic
                //1. if in selectedPlaces (selected from map), then already selected.
                //2. If not in selectedPlaces, then deselect

                selectedPlaces.forEach((selPt: any, idx: number) => {
                    var inSelectedPlaces = false;

                    this.places.forEach((place: any) => {
                        inSelectedPlaces = place.Name.replace(' County', '') === selPt.id.replace(' County', '') && place.ResID === selPt.geoid ? true : inSelectedPlaces;
                        //console.log('inselectedplaces', inSelectedPlaces, place, selectedPlaces);
                        if (!inSelectedPlaces && place.TypeCategory !== 'Counties') {
                            if (place.GeoInfo.length > 0) {
                                place.GeoInfo.forEach((gi: any) => {
                                    inSelectedPlaces = gi.geoid === selPt.geoid ? true : inSelectedPlaces;
                                });
                            }
                        }
                    });
                    if (!inSelectedPlaces) {
                        console.log('deselecting');
                        //get index of place to remove from series
                        let ptIndex: number;
                        this.mapChart.series[this.mapChart.series.length - 1].data.forEach((d: any, idx: number) => {
                            ptIndex = d.id === selPt.id ? idx : ptIndex;
                        });
                        this.mapChart.series[this.mapChart.series.length - 1].data[ptIndex].update({ selected: false });
                        //selPt.select(false, true);
                    }
                });

                //for (var s = 0; s < selectedPlaces.length; s++) {
                //    //deselect only if not currently still active
                //    //console.log('checking selected place',selectedPlaces[s]);
                //    //console.log(selectedPlaces[s]);
                //    var inSelectedPlaces = false;
                //    for (var z = 0; z < this.places.length; z++) {
                //        if (selectedPlaces[s].id !== null) {
                //            inSelectedPlaces = (this.places[z].Name.replace(' County', '') === selectedPlaces[s].id.replace(' County', '') && this.places[z].ResID === selectedPlaces[s].geoid) ? true : inSelectedPlaces;
                //            console.log('highmaps first check', inSelectedPlaces, this.places[z],selectedPlaces[s]);
                //            if (!inSelectedPlaces && this.places[z].TypeCategory !== 'Counties') {
                //                if (this.places[z].GeoInfo.length > 0) {
                //                    this.places[z].GeoInfo.forEach((gi: any) => {
                //                        console.log('highmaps second check', gi, this.places[z]);
                //                        inSelectedPlaces = gi.geoid === this.places[z].ResID ? true : inSelectedPlaces;
                //                    });
                //                }
                //            }
                //        }
                //        //inSelectedPlaces = this.isCountyLevel ? this.places[z].Desc.split(', ').length > 1 ? this.places[z].Desc.split(', ')[1].replace(' County', '') === selectedPlaces[s].id.replace(' County', '') : inSelectedPlaces : inSelectedPlaces;
                //    }
                //    console.log('highmaps in selected places', selectedPlaces[s], inSelectedPlaces, this.places);
                //    if (!inSelectedPlaces) {
                //        //deselect
                //        //console.log('deselecting!!!!!!!!!!!!!!!!!!!!1', selectedPlaces[s]);
                //        try {
                //            selectedPlaces[s].select(false, true);
                //        } catch (ex) {
                //            console.log('couldnt deselect place', selectedPlaces);

                //        }
                //    }
                //}
                //console.log('selectedplaces', this.places, this.mapChart.getSelectedPoints());
                if (this.places.length !== this.mapChart.getSelectedPoints().length) {
                    console.log('Place length is different', this.places, this.mapChart.getSelectedPoints());
                    //assume a search box entry not showing
                    for (var p = 0; p < this.places.length; p++) {
                        let place = this.places[p];

                        let isSelected = false;
                        for (var sp of this.mapChart.getSelectedPoints()) {
                            isSelected = place.ResID === sp.geoid ? true : isSelected;
                        }
                        console.log('is selected', isSelected);
                        // if (!isSelected && place.Source === 'search' && place.TypeCategory !== 'State') {
                        if (!isSelected && place.TypeCategory !== 'State') {
                            var ptIndex: number;
                            var mapSeries = this.mapChart.series.length - 1;
                            for (var pt = 0; pt < this.mapChart.series[mapSeries].data.length; pt++) {
                                //console.log('ceskyplace', this.mapChart.series[mapSeries].data[pt], place.ResID);
                                if (this.mapChart.series[mapSeries].data[pt].geoid === place.ResID) {
                                    ptIndex = pt;
                                    break;
                                }
                                if (this.isCountyLevel && place.Desc ? place.Desc.split(', ').length > 1 : false) {
                                    //console.log('cesky', place.Desc, this.mapChart.series[mapSeries].data[pt]);
                                    if (this.mapChart.series[mapSeries].data[pt].id) {
                                        if (place.Desc.split(', ')[1].replace(' County', '') === this.mapChart.series[mapSeries].data[pt].id.replace(' County', '')) {
                                            ptIndex = pt;
                                            break;
                                        }
                                    }
                                }
                                if (place.GeoInfo.length > 0 && ['Counties', 'SchoolDistricts'].indexOf(this.selectedPlaceType) !== -1 && this.indicator_geo.indexOf('Place') === -1) {
                                    console.log('looking up geopolis', this.mapChart.series);
                                    place.GeoInfo.forEach((gi: any) => {
                                        ptIndex = this.selectedPlaceType === 'Counties'
                                            ? (this.mapChart.series[mapSeries].data[pt].id ? gi.County === this.mapChart.series[mapSeries].data[pt].id.replace(' County', '')
                                                ? pt : ptIndex : ptIndex)
                                            : gi.School_District === this.mapChart.series[mapSeries].data[pt].id
                                                ? pt : ptIndex;
                                    });
                                }
                            }
                            console.log('ptIndex', ptIndex);
                            if (ptIndex !== undefined) {
                                console.log('selecting!!!!!!!!!!!!!!!!!!!!1', this.mapChart.series[mapSeries].data[ptIndex]);
                                //this.mapChart.series[0].data[ptIndex].select(true, true);
                                this.selectedPlaceColor = this.mapChart.series[mapSeries].data[ptIndex].color;
                                this.mapChart.series[mapSeries].data[ptIndex].update({ selected: true });
                            }
                        }
                    }
                }
                this.initMapChart();
                if (source) {
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
            let placeTypeLoaded = this.geoJSONStore.indexOf(this.translatePlaceTypes(this.places[x].TypeCategory)) !== -1 || this.places[x].TypeCategory === 'State' ? true : false;
            if (!placeTypeLoaded && ((this.isCountyLevel && this.places[x].TypeCategory === 'County') || !this.isCountyLevel)) {
                //check that geotype has data for this indicator
                let isGeoIndicator = this.getGeoIndicator(this.places[x]);
                if (isGeoIndicator) {
                    geoJSON_to_load.push(this.translatePlaceTypes(this.places[x].TypeCategory));
                    this.placeTypes.push(source ? this.translatePlaceTypes(this.places[x].TypeCategory) : this.places[x].TypeCategory);
                }
            }
        }
        return geoJSON_to_load;
    }

    getGeoIndicator(place: any) {
        let isIndGoe = place.TypeCategory === 'State' ? true : false;
        if (place.TypeCategory !== 'State') {
            let tPlaceType = this.translatePlaceTypes(place.TypeCategory);
            //console.log('margin in geo', tPlaceType, place.TypeCategory, this.indicator_geo);
            switch (this.indicator_geo) {
                case 'Place, Tract & County':
                    isIndGoe = ['Counties', 'Places', 'Tracts'].indexOf(tPlaceType) !== -1;
                    break;
                case 'Place and Counties':
                    isIndGoe = ['Places', 'Counties', 'State'].indexOf(tPlaceType) !== -1;
                    break;
                case 'County':
                    isIndGoe = ['Counties'].indexOf(tPlaceType) !== -1;
                    break;
                case 'School only':
                    isIndGoe = ['SchoolDistricts', 'Counties'].indexOf(tPlaceType) !== -1;
                    break;
                case 'School and County':
                    isIndGoe = ['Counties', 'SchoolDistricts'].indexOf(tPlaceType) !== -1;
                    break;
                case 'Place only':
                    isIndGoe = ['Places'].indexOf(tPlaceType) !== -1;
                    break;
                case 'Tract only':
                    isIndGoe = ['Tracts'].indexOf(tPlaceType) !== -1;
                    break;
                default:
                    isIndGoe = true;
                    break;
            }
        }
        return isIndGoe;
    }

    checkLoadGeoJSON() {
        let loadingGeoJSON = false;
        //check for missing placetype geojson
        let geoJSON_to_load: any[] = this.getPlaceTypes();
        //also check selected place to see if loaded
        let selPTCheck = geoJSON_to_load.filter(layer => { return this.translatePlaceTypes(layer) === this.translatePlaceTypes(this.selectedPlaceType); });
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
            geoJSON_to_load.push('oregon_siskiyou_boundary');
            //let addBoundary = geoJSON_to_load.indexOf('Places') !== -1 ? true : false;
            //if (addBoundary) {
            //}
        }

        if (geoJSON_to_load.length > 0) {
            geoJSON_to_load = $.unique(geoJSON_to_load);
            let geoJSON_to_load_filtered = geoJSON_to_load.filter((gtl: any) => {
                return this.geoJSONStore.filter(geo => {
                    //console.log('geoStore check', geo, gtl);
                    return geo.layerId === gtl || (geo.layerId === 'Boundary' && gtl === 'oregon_siskiyou_boundary');
                }).length === 0;
            });
            console.log('filtered gtl', geoJSON_to_load_filtered);
            if (geoJSON_to_load_filtered.length > 0) {
                console.log('geojson to load', geoJSON_to_load_filtered);
                if (this.placeTypeGeoYears === undefined) {
                    this._placeTypesService.get().subscribe((data: any) => {
                        this.placeTypeGeoYears = data;
                        this.getGeoJSON(geoJSON_to_load_filtered);
                    });
                } else {
                    this.getGeoJSON(geoJSON_to_load_filtered);
                }
                loadingGeoJSON = true;
            }
        }
        return loadingGeoJSON;
    }

    getGeoJSON(placeTypeToLoad: any[]) {
        console.log('spew', placeTypeToLoad, this.placeTypeGeoYears);
        for (var pt of placeTypeToLoad) {
            this._geoService.getByPlaceType(this.translatePlaceTypes(pt), this.placeTypeGeoYears).subscribe(
                (data: any) => {
                    console.log('got response from NEWWWWWWWWWWWWWWWWWWWWWWW geoservice', this.translatePlaceTypes(pt), pt);
                    console.log(data);
                    if (data.length > 0) {
                        let mapData = { layerId: data[0].layerType, features: data };
                        this._geoStore.add(mapData);
                        this.updateDataStore(mapData, 'mapData');
                        console.log('got geojson, updated data store and checking place type to get indicator data');
                        console.log(this.selectedPlaceType, data);
                        //if (this.selectedPlaceType === data[0].layerType || this.selectedPlaceType === 'SchoolDistricts') {
                        if (data[0].layerType !== 'State' && data[0].layerType !== 'Boundary') {
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
        let geonames = '';
        let schooldistricts = '';
        let counties = '';
        let cts = '';
        console.log('getting data', this.places);
        //console.log(selectedPlaces);
        //let selectedPlaces = this.places;

        this.places.forEach((place: any, idx: number) => {
            //console.log('ginfo1', this.places[idx].GeoInfo);
            geoids += place.ResID + (idx !== this.places.length - 1 ? ',' : '');
            geonames += place.Name + (idx !== this.places.length - 1 ? ',' : '');
            if (place.TypeCategory === 'SchoolDistricts') {
                schooldistricts += place.Name + (idx !== this.places.length - 1 ? ',' : '');
            } else {
                place.GeoInfo.forEach((ginfo: any, gidx: number) => {
                    console.log('ginfo2', ginfo);
                    schooldistricts += (schooldistricts.indexOf(ginfo.School_District) === -1 && ginfo.School_District !== null ?
                        ginfo.School_District :
                        '') + (idx !== this.places.length - 1 || (idx === this.places.length && gidx !== place.GeoInfo.length - 1) ?
                            ',' :
                            '');
                    cts += (['Tracts', 'Census Tracts', 'Unincorporated Place'].indexOf(place.TypeCategory) !== - 1 ?
                        (ginfo.geoid +
                            //(gidx !== place.GeoInfo.length - 1 && idx <= this.places.length ?
                            (idx !== this.places.length - 1 || (idx === this.places.length && gidx !== place.GeoInfo.length - 1) ?
                                ',' :
                                '')) :
                        '');
                    counties += this.isCountyLevel ? ginfo.county_geoid + (idx !== this.places.length - 1 || (idx === this.places.length && gidx !== place.GeoInfo.length - 1) ?
                        ',' :
                        '') : '';
                    geoids += this.isCountyLevel ? ((geoids.lastIndexOf(',') !== geoids.length - 1 ? ',' : '') + (ginfo.county_geoid + ',')) : '';
                });
            }
            counties += (place.TypeCategory === 'Counties' ? place.Name.replace(' County', '') + (idx !== this.places.length - 1 ? ',' : '') : '');
            cts += (['Tracts', 'Census Tracts', 'Unincorporated Place'].indexOf(place.TypeCategory) !== - 1 && cts.indexOf(place.ResID) === -1 ? place.ResID + (idx !== this.places.length - 1 ? ',' : '') : '');
            if (place.ResID === '41') {
                schooldistricts += 'Statewide' + (idx !== this.places.length - 1 ? ',' : '');
            }
        });

        counties = counties.replace(/(^,)|(,$)/g, '');
        console.log('cough', schooldistricts);
        schooldistricts = schooldistricts.replace(/(^,)|(,$)/g, '');

        geoids = this.places.length === 0 ? '41' : geoids;
        geonames = this.places.length === 0 ? 'Oregon' : geonames;
        schooldistricts = this.places.length === 0 ? 'Statewide' : schooldistricts;

        console.log('fall', counties, cts);

        let indicatorForService = this.indicator.replace(/\%28/g, '(')
            .replace(/\%29/g, ')')
            .replace(/\%2C/g, ',')
            .replace(/\%24/g, '$')
            .replace(/\+/g, '%2B')
            .replace(/\=/g, '%3D')
            .replace(/\&/g, '%26');

        if (this.tileType === 'map' && this.showMap) {
            //if (this.viewType === 'advanced') {
            //LOGIC
            //1. for each selected place get all of the placetype data to show on map.
            //2. If already have the data, then check to see if new place type selected
            let placeTypes = '';
            if (this.isSchool) {
                placeTypes = 'Schools';
            } else {
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

                //console.log(placeTypes);
                if (placeTypes === 'State' || placeTypes === '' || this.isCountyLevel) {
                    placeTypes = 'County,State';
                }
                //remove any trailing commas and whitespace
                placeTypes = placeTypes.replace(/,\s*$/, '').replace(/\,,/g, ',');
                //order by selected place type first for map display
                placeTypes = placeTypes.split(',').sort((a: any, b: any) => {
                    if (this.translatePlaceTypes(b) === this.translatePlaceTypes(this.selectedPlaceType)) {
                        return 1;
                    } else if (a === 'State') {
                        return 1;
                    } else {
                        return 0;
                    }
                }).toString();
            }
            console.log('GET DATA HOT DIGIDIGDIGIDGIG I', placeTypes, this.selectedPlaceType);
            this._dataService.getAllbyGeoType(placeTypes, indicatorForService).subscribe(
                (data: any) => {
                    //this.placeTypeData = data;
                    console.log('data direct from service', data);
                    this._selectedDataService.add(data);
                },
                (err: any) => console.error(err),
                () => console.log('done loading data for map')
            );
        } else {
            //check for combined requests
            let combinedGroups = this.checkCombineGroups();

            if (combinedGroups.length > 0 && !this.isStatewide && !this.isSchool) {
                console.log('combine data call', geoids);
                this._dataService.getIndicatorDetailDataWithMetadata(geoids, indicatorForService).subscribe(
                    (data: any) => {
                        console.log('detailed data response', data);
                        //combine data by group-names
                        let combinedData = this.processCombinedData(data);
                        console.log('hotdog', combinedData);
                        this.updateDataStore([combinedData], 'indicator');
                        //TODO:  check for custom chart and process accordingly
                        this.onChartDataUpdate.emit({ data: combinedData, customPlace: this.selectedPlaceCustomChart, customYear: this.selectedCustomChartYear, metadata: data.Metadata[0] });
                        this.createGraphChart();
                    });
            } else {
                console.log('geoids for data service', geoids, geonames, schooldistricts);
                if (this.isSchool) {
                    console.log('SCHOOL DATA', schooldistricts, geonames, geoids, this.tileType);
                    //get school districts from places, else statewide value
                    this._dataService.getSchoolDistrictData(schooldistricts, this.indicator, counties, cts).subscribe((data: any) => {
                        console.log('SCHOOL DATA', data);
                        this.updateDataStore([data], 'indicator');
                        console.log('updated data store');
                        this.createGraphChart();
                        this.onChartDataUpdate.emit({ data: this.isCustomChart ? this.dataStore.indicatorData[this.indicator].chart_data : data, customPlace: this.selectedPlaceCustomChart, customYear: this.selectedCustomChartYear, metadata: data.Metadata[0] });

                    }, (err: any) => {
                        console.error('error getting data!', err, this.indicator, this.dataAttempts);
                        if (this.dataAttempts < 3) {
                            this.dataAttempts++;
                            this.getData();
                        } else {
                            this.dataAttempts = 0;
                        }
                    },
                        () => console.log('done loading data for graph')
                    );
                } else {
                    console.log('prague', geoids, geonames, indicatorForService);
                    this._dataService.getIndicatorDataWithMetadata(geoids, geonames, indicatorForService).subscribe(
                        (data: any) => {
                            console.log('regular indicator data', data);
                            if (data.Data.length > 0) {
                                //if (this.isCustomChart) {
                                //    let uniqueDataPlaces = [];
                                //    data.Data.forEach((dp: any) => {
                                //        if (uniqueDataPlaces.indexOf(dp.geoid) === -1) {
                                //            uniqueDataPlaces.push(dp.geoid);
                                //            this.selectedPlacesCustomChart.push({
                                //                Name: dp.community,
                                //                ResID: dp.geoid
                                //            })
                                //        }
                                //    }
                                //}
                                this.updateDataStore([data], 'indicator');
                                this.createGraphChart();

                                this.onChartDataUpdate.emit({ data: this.isCustomChart ? this.dataStore.indicatorData[this.indicator].chart_data : data, customPlace: this.selectedPlaceCustomChart, customYear: this.selectedCustomChartYear, metadata: data.Metadata[0] });
                            } else {
                                this.chart.showLoading('Sorry, indicator data is not available for this place.');
                                this.chart.setTitle({
                                    text: this.viewType === 'basic' || this.isHandheld ? this.indicator.replace('<br>', ' ') : null,
                                    align: this.viewType === 'basic' ? 'left' : this.isHandheld ? 'center' : null,
                                    style: {
                                        fontSize: '1.25em',
                                        fontWeight: '200'
                                    },
                                    //widthAdjust: -10,
                                    //x: -30
                                });
                                this.chart.legend.enabled = false;
                            }
                        },
                        (err: any) => console.error(err),
                        () => console.log('done loading data for graph')
                    );
                }
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
                combineArray.push(groupArray);
                //if (idx === groupNames.length - 1 && groupArray.length > 1) {
                //    combineArray.push(groupArray);
                //}
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
            console.log('groups', groups, data);
            //build data output combining data by group
            for (var group of groups) {
                console.log('group of groups', group);
                let combinedGroupData: any = new Object;
                combinedGroupData.community = group[0].GroupName;
                combinedGroupData.Variable = group[0].Variable;
                combinedGroupData.geoid = '';
                var multiplyBy = parseInt(data.Metadata[0].MultiplyBy);
                var notCombined = false;
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
                        console.log('chickens', placeData);
                        if (placeData.length > 0) {
                            let numValue = placeData[0][year.Year + '_N']
                                ? placeData[0][year.Year + '_N'].trim()
                                : null;
                            let denomValue = placeData[0][year.Year + '_D']
                                ? placeData[0][year.Year + '_D'].trim()
                                : null;
                            let numMOEValue = isACS
                                ? placeData[0][year.Year + '_MOE_N']
                                    ? placeData[0][year.Year + '_MOE_N'].trim()
                                    : null
                                : null;
                            let denomMOEValue = isACS
                                ? placeData[0][year.Year + '_MOE_D']
                                    ? placeData[0][year.Year + '_MOE_D'].trim()
                                    : null
                                : null;
                            //console.log('place comb data', placeData);
                            //console.log('num value', numValue);
                            //console.log('denom value', denomValue);
                            let denomValCheck: any[] = [];
                            denomValCheck.push(denomValue);
                            combinedNumerators = (numValue !== '' && numValue !== null) ? (combinedNumerators + parseFloat(numValue)) : combinedNumerators;
                            combinedDenoms = ['', 1, null].indexOf(denomValue) === -1
                                ? combinedDenoms === 1 && parseFloat(denomValue) === 1
                                    ? 1
                                    : (combinedDenoms + parseFloat(denomValue))
                                : combinedDenoms;
                            if (isACS) {
                                combinedNumMOEs = numMOEValue !== '' && numMOEValue !== null ? (combinedNumMOEs + parseFloat(numMOEValue)) : combinedNumMOEs;
                                combinedDenomMOEs = denomMOEValue !== '' && denomMOEValue !== null ? (combinedDenomMOEs + parseFloat(denomValue)) : combinedDenomMOEs;
                            }
                            console.log('combinedNumerators', year.Year, combinedNumerators, numValue, combinedDenoms, denomValue, denomValCheck);

                        } else {
                            notCombined = true;
                        }
                    }
                    if (!notCombined) {
                        //console.log('chickens combined num values', combinedNumerators,year.Year);
                        //console.log('chickens combined denom values', combinedDenoms);
                        let hasEnoughData = !(combinedDenoms === 0 || combinedDenoms === null) && combinedNumerators !== 0;
                        //combinedDenoms = combinedDenoms === 0 || combinedDenoms === null
                        //    ? 1
                        //    : combinedDenoms;
                        combinedGroupData[year.Year] = hasEnoughData ? combinedNumerators / combinedDenoms * multiplyBy : null;
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
                }
                //remove place from combined data
                for (var place of group) {
                    //console.log('chicken filtered combinedData', combinedData.Data);
                    combinedData.Data = combinedData.Data.filter((pData: any) => { return pData.geoid !== place.ResID && pData.community !== place.Name; });
                    //console.log('chicken filtered combinedData2', combinedData.Data);
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
                console.log('is this where', this.dataStore);
                try {
                    loadMoreData = this.dataStore[this.pluralize(this.places[d].TypeCategory)].indicatorData[this.indicator] ? false : true;
                    if (!loadMoreData) {
                        //check that it has been processed.
                        if (!this.dataStore[this.pluralize(this.places[d].TypeCategory)].indicatorData[this.indicator].chart_data) {
                            this.onSelectedDataChanged(this.AllData);
                        }
                    }
                } catch (ex) {
                    console.log('yep, guess so', ex);
                }
                //if (this.dataStore[this.pluralize(this.places[d].TypeCategory)].indicatorData !== undefined) {
                //    console.log('already have this type data');
                //    console.log(this.dataStore[this.pluralize(this.places[d].TypeCategory)]);
                //    //loadMoreData = false;
                //} else {
                //    loadMoreData = true;
                //}
            }
        }
        //also check if selected place type changed and does not have included place selected
        if (this.dataStore[this.selectedPlaceType] !== undefined) {
            if (this.dataStore[this.selectedPlaceType].indicatorData[this.indicator] === undefined) {
                loadMoreData = true;
            }
        }
        return loadMoreData;
    }

    getDrillDownData(evt: any) {
        console.log('getting drilldown data for ', evt.point.series.name, evt);
        let searchGeoid = this.places.find((p: any) => p.Name === evt.point.series.name).ResID;
        console.log('search Geoid is:  ', searchGeoid);
        if (searchGeoid) {
            this.drillDownPlace = evt.point.series.name;
            let subtopic = this.placeTypeData.Metadata[0].Sub_Topic_Name;
            this._dataService.getDrilldownIndicatorData(subtopic, searchGeoid).subscribe(
                (data: any) => {
                    //this.placeTypeData = data;
                    console.log('drilldown data direct from service', data);
                    let ddObj = {
                        place: evt.point.series.name,
                        subtopic: subtopic,
                        data: data
                    }
                    this.isDrilldown = true;
                    this.updateDataStore(data, 'indicator', ddObj);
                    this.processDataYear(ddObj);
                    this.addSeriesDataToGraphChart(null, ddObj);

                    this.chart.renderer.button('< Go Back', null, null,
                        (drillup: any) => {
                            this.drillUp();
                        }, {
                            zIndex: 20
                        }).attr({
                            align: 'left',
                            title: 'Reset zoom level 1:1'
                        }).add(this.chart.zoomGroupButton).align({
                            align: 'left',
                            x: 10,
                            y: 10
                        }, false, null);


                    //this.showDrillDownData();
                    //this._selectedDataService.add(data);
                },
                (err: any) => console.error(err),
                () => console.log('done loading data for map')
            );
        }
    }

    drillUp() {
        this.isDrilldown = false;
        this.createGraphChart();
    }
    showDrillDownData() {
        //if (this.dataStore.indicatorData[this.indicator].chart_dd_data) {
        //    if (this.dataStore.indicatorData[this.indicator].chart_dd_data.place_data_year_dd) {
        //        for (let ddSeries in this.dataStore.indicatorData[this.indicator].chart_dd_data.place_data_year_dd) {

        //        }
        //    }
        //}
        //console.log('attaching drilldown data', this.placeTypeData);
    }

    onSelectedDataChanged(data: any) {
        console.log('Community Data throwing event', this.Data);
        this.updateDataStore(data, 'indicator');
        //add check to see if place indicator set does not equal input send add request
        if (data.length > 0) {
            //check to see if data loaded contains current report params
            console.log('giddy up', this.dataStore, this.selectedPlaceType);
            try {
                this.placeTypeData = this.dataStore[this.selectedPlaceType].indicatorData[this.indicator].crt_db;
                //need to set to last year which has data, not last year that might have data
                this.yearEndOffset = this.getEndYear();

                //this.offsetYear = this.getDefaultYear();//retrieve offset value from end
                this.selectedYear = this.placeTypeData.Years[data[0].Years.length - (this.yearEndOffset + 1)];
                if (this.tileType === 'map' && this.showMap) {
                    this.selectedMapData = this.getSelectedMapData();
                }
                console.log('ptd', this.placeTypeData);
                this.hasDrillDowns = this.placeTypeData.Metadata[0].Sub_Topic_Name !== 'none';
                //Process the data for it to work with Highmaps
                this.processDataYear();
                this.processYearTicks();
                this.selectedYearIndex = this._tickArray.length;// - 1;// this.yearEndOffset -1;

                //if (this.hasDrillDowns) {
                //    console.log('has drilldown! ', this.places);
                //    this.places.forEach(p => {
                //        this.getDrillDownData(p.ResID);
                //    });
                //}
                if (this.tileType === 'map' && this.showMap) {
                    //this.checkDataStateForCharts();
                    this.initMapChart();
                    console.log('shamrock');
                    if (!this.isSliderInit && this._tickArray.length > 1) {
                        this.showSlider = true;
                        this.setupTimeSlider();
                        this.isSliderInit = true;
                    } else {
                        this.showSlider = this._tickArray.length > 1;
                    }
                }
            } catch (ex) {
                console.log('CAUGHT Exception: placetype indicator data not loaded' + ex.message, this.selectedPlaceType, this.dataStore);
                if (this.tileType === 'graph') {
                    console.log('ERRoR', ex.message);
                    this.chart.showLoading('Sorry, this chart is not currently available.  ' + ('<%= ENV %>' !== 'prod' ? ex.message : ''));
                } else {
                    this.mapChart.showLoading('Sorry, this map is not currently available.  ' + ('<%= ENV %>' !== 'prod' ? ex.message : ''));
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

    updateDataStore(data: any, dataType?: string, drilldown?:any) {
        //identify what type of data and add to proper place type object
        //console.log('SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS', data, dataType);
        if (drilldown) {
            let drilldownData: any = {};
            //lookup parent level data
            console.log('adding to data store', this.dataStore.indicatorData[this.indicator]);
            if (!this.dataStore.indicatorData[this.indicator].drilldown_data) {
                this.dataStore.indicatorData[this.indicator].drilldown_data = {};
            }
            if (!this.dataStore.indicatorData[this.indicator].drilldown_data[drilldown.place]) {
                this.dataStore.indicatorData[this.indicator].drilldown_data[drilldown.place] = {};
            }
            if (!this.dataStore.indicatorData[this.indicator].drilldown_data[drilldown.place][drilldown.subtopic]) {
                this.dataStore.indicatorData[this.indicator].drilldown_data[drilldown.place][drilldown.subtopic] = {};
            }
            this.dataStore.indicatorData[this.indicator].drilldown_data[drilldown.place][drilldown.subtopic].Data = data;

            console.log('attached drilldown data', this.dataStore);

        } else if (dataType === 'indicator') {
            //check if data is statewide, county or not combinable
            console.log('fred', this.dataStore, this.tileType);
            //filter data by geoType
            for (var d = 0; d < data.length; d++) {
                let indicatorData: any = {};
                indicatorData[this.indicator] = { crt_db: data[d] };

                if (data[d].Metadata.length > 0) {
                    let metadata = data[d].Metadata[0];
                    this.isStatewide = metadata.Variable_Geog_Desc === 'State' ? true : false;
                    //this.showMap = !this.isStatewide ||
                    this.isCountyLevel = metadata.CountyLevel;
                    this.isNotCombinable = metadata.isPreCalc && this.isStatewide && this.hasCombined;
                }
                if (this.tileType === 'map' && !this.isStatewide && !this.isCustomChart) {
                    //console.log('problem data', data[d]);
                    console.log('say what', data[d].GeoTypes[0].geoType, data, this.isSchool);
                    if (this.isSchool) {
                        let geoTypeIndicatorData: any = {};
                        geoTypeIndicatorData[this.indicator] = { crt_db: data[0] };
                        this.dataStore.SchoolDistricts.indicatorData = geoTypeIndicatorData;
                    } else {
                        let geoTypes = ['Place', 'Census Tract', 'State', 'County', 'School'];
                        geoTypes.forEach((gt: any) => {
                            let geoTypeData = data[d].Data.filter((d: any) => d.geoType === gt);
                            console.log('processing', gt, geoTypeData);
                            if (geoTypeData.length > 0) {
                                if (this.dataStore[this.pluralize(gt).toString()].indicatorData[this.indicator] === undefined) {
                                    let geoInfoData = {
                                        Data: geoTypeData,
                                        GeoTypes: data[d].GeoTypes,
                                        GeoYears: data[d].GeoYears,
                                        Metadata: data[d].Metadata,
                                        RelatedIndicators: data[d].RelatedIndicators,
                                        SubTopicCategories: data[d].SubTopicCategories,
                                        Years: data[d].Years
                                    };
                                    let geoTypeIndicatorData: any = {};
                                    geoTypeIndicatorData[this.indicator] = { crt_db: geoInfoData };
                                    this.dataStore[this.pluralize(gt).toString()].indicatorData = geoTypeIndicatorData;
                                }
                            }
                        });
                        console.log('processing: finished', this.dataStore);
                        //if (this.dataStore[this.pluralize(data[d].GeoTypes[0].geoType).toString()].indicatorData[this.indicator] === undefined) {
                        //    //console.log('say what',data[d].GeoTypes[0].geoType);
                        //    //let chart_data = {};
                        //    //let add_back_chart_data = false;
                        //    //if (this.dataStore[this.pluralize(data[d].GeoTypes[0].geoType).toString()].indicatorData[this.indicator].chart_data !== undefined) {
                        //    //    chart_data = this.dataStore[this.pluralize(data[d].GeoTypes[0].geoType).toString()].indicatorData[this.indicator].chart_data;
                        //    //    add_back_chart_data = true;
                        //    //}
                        //    this.dataStore[this.pluralize(data[d].GeoTypes[0].geoType).toString()].indicatorData = indicatorData;
                        //    //if (add_back_chart_data) {
                        //    //    this.dataStore[this.pluralize(data[d].GeoTypes[0].geoType).toString()].indicatorData[this.indicator].chart_data = chart_data;
                        //    //}
                        //    //console.log('AFTER ADDING INDICATOR DATA FOR PLACETYPE', this.dataStore);
                        //}
                    }
                } else {
                    console.log('countycheck-2', indicatorData);
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

    }

    getPlaceData() {
        console.log('Checking on place data', this.dataStore[this.selectedPlaceType].indicatorData[this.indicator].chart_data.place_data);
        let returnData: any;
        if (this.tileType === 'map' && this.showMap) {
            returnData = this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].chart_data.place_data;
        } else {
            returnData = this.dataStore.indicatorData[this.indicator].chart_data.place_data;
        }

        if (this.indicator_info.Represented_ID !== 10) {
            returnData.forEach((data: any) => data.value ? data.value = +data.value : false);
        }
        return returnData.filter((data: any) => typeof data.value === 'number');
    }

    getPlaceTypeData() {
        if (this.tileType === 'map' && this.showMap) {
            return this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].crt_db;
        } else {
            return this.dataStore.indicatorData[this.indicator].crt_db;
        }
    }



    getSelectedMapData() {
        //identify the array to check
        console.log('que pasa', this.selectedPlaceType, this.selectedYear);
        let selectedGeoJSONType: any = this.geoJSONStore.filter(data => { return data.layerId === this.pluralize(this.selectedPlaceType) || 'School Districts' === data.layerId; });
        //check the selected year and get layer accordingly
        console.log('que pasa geotype', selectedGeoJSONType);
        var selectedYearGeoJSONIndex: any = 0;
        for (var y = 0; y < selectedGeoJSONType[0].features.length; y++) {
            var year = selectedGeoJSONType[0].features[y];
            if (this.selectedYear.Year.split('-').length > 1) {
                selectedYearGeoJSONIndex = (parseInt(year.Year) <= parseInt('20' + this.selectedYear.Year.split('-')[1])) ? y : selectedYearGeoJSONIndex;
            } else {
                selectedYearGeoJSONIndex = parseInt(year.Year) <= parseInt(this.selectedYear.Year) ? y : selectedYearGeoJSONIndex;
            }
        }
        console.log('que pasa', selectedGeoJSONType);
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
        //console.log('slider', this.customChartYears, this._tickArray, this._tickLabelsTime);
        $(this.elementRef.nativeElement).find('#dateSlider').labeledslider(
            {
                min: 0,
                max: this.isCustomChart ? this.customChartYears.length - 1 : this.placeTypeData.Years.length - (this.yearStartOffset + 1 + this.yearEndOffset),
                value: this.isCustomChart ? this.customChartYears.length - 1 : this.placeTypeData.Years.length - (this.yearStartOffset + 1 + this.yearEndOffset),
                tickInterval: 1,
                step: 1,
                autoScaleSlider: false,
                tickArray: this._tickArray,
                tickLabels: this._tickLabelsTime,
                change: function (event: any, ui: any) {
                    console.log('slider changed');
                    if (sliderScope.isCustomChart) {
                        sliderScope.selectedCustomChartYear = sliderScope.customChartYears[ui.value];
                        sliderScope.processCustomChart();
                        sliderScope.onChartDataUpdate.emit({
                            data: sliderScope.isCustomChart ? sliderScope.dataStore.indicatorData[sliderScope.indicator].chart_data : sliderScope.dataStore.indicatorData[sliderScope.indicator].crt_db,
                            customPlace: sliderScope.selectedPlaceCustomChart,
                            customYear: sliderScope.selectedCustomChartYear,
                            metadata: sliderScope.dataStore.indicatorData[sliderScope.indicator].crt_db.Metadata[0]
                        });
                    } else {
                        sliderScope.selectedYear = sliderScope.placeTypeData.Years[ui.value + sliderScope.yearStartOffset];
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
                        sliderScope.mapChart.series[seriesIndex].joinBy = sliderScope.selectedPlaceType === 'Tracts' ? ['GEOID', 'geoid'] : (sliderScope.selectedPlaceType === 'SchoolDistricts' ? ['ODE_ID', 'geoid'] : ['NAME', 'name']);
                        sliderScope.mapChart.series[seriesIndex].setData(data);
                        sliderScope.selectedMapPoints = sliderScope.mapChart.getSelectedPoints();
                        sliderScope.mapChart.redraw();
                        sliderScope.onSelectedYearChange.emit({ year: sliderScope.selectedYear, index: sliderScope.selectedYearIndex, indicator: sliderScope.indicator });

                        if (sliderScope.indicator_info.Represented_ID === 10) {
                            console.log('sliderscope?', sliderScope.dataStore);
                            sliderScope.initMapChart();
                            sliderScope.onChartDataUpdate.emit({ data: sliderScope.dataStore[sliderScope.selectedPlaceType].indicatorData[sliderScope.indicator].chart_data });
                        } else {
                            window.setTimeout(sliderScope.selectAndOrderMapPaths(), 500);
                        }

                        //detailChart.xAxis[0].removePlotLine('plot-line-1');
                        //detailChart.xAxis[0].addPlotLine({
                        //    value: selectedYearIndex,
                        //    color: 'gray',
                        //    dashStyle: 'longdashdot',
                        //    width: 2,
                        //    id: 'plot-line-1'
                        //});
                    }
                }
            });
    }

    onPlayBtnClick(evt: any) {
        let runScope = this;
        var runInterval = setInterval(runCheck, 2000);
        function runCheck() {
            if (runScope.sliderState === 'pause') {
                if (runScope.isCustomChart) {
                    runScope.animationCounter = runScope.animationCounter < (runScope.customChartYears.length - 1) ? ++runScope.animationCounter : 0;
                } else {
                    runScope.animationCounter = runScope.animationCounter < (runScope.placeTypeData.Years.length - 1) ? ++runScope.animationCounter : 0;
                }
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
            case 'Places':
            case 'Cities':
                return 'Places';
            case 'Census Tract':
            case 'Census Tracts':
            case 'Unincorporated Place':
                return 'Tracts';
            case 'Schools':
            case 'School Districts':
                return 'SchoolDistricts';
            default:
                return placeType;
        }
    }


    initMapChart() {
        console.log('CREATIN MAP CHART', this.mapChart, this.mapOptions);

        var mapScope = this;
        var isTextData: boolean = false;
        (this.mapOptions as any).xAxis = {
            min: mapScope.mapChartZoomSettings.xMin ? parseInt(mapScope.mapChartZoomSettings.xMin) : null,
            max: mapScope.mapChartZoomSettings.xMax ? parseInt(mapScope.mapChartZoomSettings.xMax) : null,
            events: {
                afterSetExtremes: function (x: any) {
                    mapScope.mapChartZoomSettings.xMax = x.max;
                    mapScope.mapChartZoomSettings.xMin = x.min;
                }
            }
        };
        (this.mapOptions as any).yAxis = {
            min: mapScope.mapChartZoomSettings.yMin ? parseInt(mapScope.mapChartZoomSettings.yMin) : null,
            max: mapScope.mapChartZoomSettings.yMax ? parseInt(mapScope.mapChartZoomSettings.yMax) : null,
            events: {
                afterSetExtremes: function (y: any) {
                    mapScope.mapChartZoomSettings.yMax = y.max;
                    mapScope.mapChartZoomSettings.yMin = y.min;
                }
            }
        };

        this.mapChart.destroy();
        this.mapChart = new Highcharts.Map(this.mapOptions);


        this.mapChart.legend.title.attr({ text: this.placeTypeData.Metadata[0]['Y-Axis'] ? this.placeTypeData.Metadata[0]['Y-Axis'] : '' });
        //set tooltip display
        this.mapChart.tooltip.options.formatter = function () {
            var displayValue = mapScope.formatValue(this.point.value, false) + '</b>';
            //console.log('keep select', this.point.color);
            //if (this.point.selected) {
            //    this.point.setState('select');
            //}
            if (this.point.value === undefined) {
                return '<span>' + this.point.properties.name + ' County</span><br/><span style="font-size: 10px">Not Available or Insufficient Data</span>';
            } else {
                if (this.point.year !== undefined) {
                    //console.log('mouseover', mapScope.selectedYearIndexArray, this.point.year, mapScope.dataStore[mapScope.selectedPlaceType].indicatorData[mapScope.indicator].chart_data.place_data_years_moe[this.point.id]);
                    if (this.point.year.match('-')) {
                        let chart_data = mapScope.dataStore[mapScope.selectedPlaceType].indicatorData[mapScope.indicator].chart_data;
                        displayValue += '<span style="font-size:8px">  (+/- ';
                        displayValue += mapScope.formatValue(((parseFloat(chart_data.place_data_years_moe[this.point.id].data[mapScope.selectedYearIndexArray[this.point.year]][1]) - parseFloat(chart_data.place_data_years_moe[this.point.id].data[mapScope.selectedYearIndexArray[this.point.year]][0])) / 2), false);
                        displayValue += ' )</span>';
                    }
                    var SeriesName = (this.point.series.name.split(':').length > 1 ? this.point.series.name.split(':')[0] + ':<br />' + this.point.series.name.split(':')[1] : this.point.series.name).replace('%3A', ':').replace('%26', '&');
                    var returnHTML = '<span style="fill: ' + this.series.color + ';"> ● </span><span style="font-size: 10px"> ' + SeriesName + '</span>';
                    returnHTML += '<br/><b>' + this.point.id + ' ' + (mapScope.selectedPlaceType === 'Counties' ? 'County' : '') + ': ' + displayValue;
                    if (mapScope.placeTypeData.Metadata[0].Variable_Represent.trim() !== 'Text') {
                        returnHTML += '<br/><span style="color:#a7a7a7;">-----------------------------------------</span><br/><em><span style="font-size:10px; color:' + mapScope.placeTypeData.Metadata[0].Color_hex;
                        returnHTML += '; font-weight:bold; font-style:italic">( Click to view chart  ---   To compare: Hold Shift + Click )</span></em>';
                    }
                    return returnHTML;
                } else {
                    return '<span style="font-size: 10px">Not Available or Insufficient Data</span>';
                }
            }
        };
        var colorAxis = this.mapChart.colorAxis[0];
        //console.log('logarithmic?', this.getMinData(true, true), this.getMinData(true, true) > 0 ? 'logarithmic' : null, this.indicator_info);
        if (this.indicator_info.Represented_ID === 10) {
            isTextData = true;
            let dataClasses = this.getDataClasses();
            console.log('dataClasses', dataClasses);
            colorAxis.update({
                dataClasses: dataClasses,
                showInLegend: false,
                minColor: 'white',
                maxColor: 'white',
                tickColor: 'white',
                lineColor: 'white',
                labels: {
                    enabled: false
                },
                gridLineWidth: 0,
                //dataClassColors:'category'
                //min: null,
                //max: null,
                //type: null,
                //endOnTick: null,
                //startOnTick: null,
                //maxColor: null,

            });
            this.mapChart.legend.update(this.setLegendOptions(true));
        } else {
            colorAxis.update({
                type: this.getMinData(true, true) > 0 ? 'logarithmic' : null,// 'logarithmic',
                //min: 0,//null,//0,
                min: this.getMinData(true),
                max: this.getMaxData(true),
                endOnTick: false,
                startOnTick: true,
                maxColor: this.placeTypeData.Metadata[0].Color_hex ? this.placeTypeData.Metadata[0].Color_hex : '#003399',
                labels: {
                    formatter: function () {
                        return mapScope.formatValue(this.value, true);
                    }
                }
            });
        }
        //console.log('colorAxis min', this.getMinData(true));
        //console.log('colorAxis max', this.getMaxData(true));

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
                color: '#FBCF76',//'#080',// 'rgba(0,128,0,0.1)',
                negativeColor: '#F6F6F5',// 'rgba(128,0,0,0.1)',
                mapData: this.dataStore.Boundary.mapData.features[0]
            };
            //this.mapChart.series[0].update(boundarySeries);
            this.mapChart.addSeries(boundarySeries);
            ptSeriesIndexes.push(this.mapChart.series.length - 1);
        }
        console.log('placedata from map', this.getPlaceData());
        var series = {
            borderColor: this.selectedPlaceType === 'Places' ? '#a7a7a7' : 'white',
            //borderWidth: this.selectedPlaceType === 'Places' ? '0px' : '1px',
            data: this.getPlaceData(),//this.place_data
            mapData: this.getSelectedMapData(),//selectedMapData,
            //index: 0,//bowser.msie ? 1 : 0,
            joinBy: this.selectedPlaceType === 'Tracts'
                ? ['GEOID', 'geoid']
                : (this.selectedPlaceType === 'SchoolDistricts'
                    ? ['ODE_ID', 'geoid'] : ['NAME', 'name']),
            name: this.indicator + ' ' + this.selectedPlaceType + ' (' + this.selectedYear.Year + ')',
            allowPointSelect: true,
            cursor: 'pointer',
            states: {
                hover: {
                    //enabled: false
                    color: '#a7a7a7'
                },
                select: {
                    color: this.getSelectColor(this), // '#BADA55', // : 'red' //  this.getSelectColor(this),//; '#BADA55'
                    borderColor: '#C34500',// isTextData ? 'black' : null
                    borderWidth: '3px'
                }
            },
        };
        console.log('checkshit', series);
        this.mapChart.addSeries(series, true);
        console.log('checkshit2', series);
        this.mapChart.series[this.selectedPlaceType === 'Places' ? 1 : 0].mapData = this.getSelectedMapData();
        this.mapChart.series[this.selectedPlaceType === 'Places' ? 1 : 0].setData(this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].chart_data.place_data);
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
        //this.mapChart.redraw();
        window.setTimeout(function () {
            //console.log('sausage', sessionStorage);
            //mapScope.mapChart.hideLoading();
            ////mapScope.mapChart.redraw();
            //mapScope.selectedMapPoints = mapScope.mapChart.getSelectedPoints();
            //mapScope.mapChart.series[0].data.forEach((d: any) => {
            //    if (mapScope.selectedMapPoints.map((mp: any) => mp.geoid).indexOf(d.geoid) !== -1) {
            //        d.update({ selected: true });
            //    }
            //});
            mapScope.selectAndOrderMapPaths();
        }, 500);
        if (this.indicator_info.Represented_ID === 10) {
            this.onChartDataUpdate.emit({ data: this.dataStore[this.selectedPlaceType].indicatorData[this.indicator].chart_data, customPlace: this.selectedPlaceCustomChart, textYears: this.placeTypeData.Years, metadata: this.placeTypeData.Metadata[0] });
        }
        //this.selectedMapPoints = this.mapChart.getSelectedPoints();
    }

    selectAndOrderMapPaths() {
        console.log('sausage', sessionStorage);
        this.mapChart.hideLoading();
        //mapScope.mapChart.redraw();
        this.selectedMapPoints = this.mapChart.getSelectedPoints();
        this.mapChart.series[0].data.forEach((d: any) => {
            if (this.selectedMapPoints.map((mp: any) => mp.geoid).indexOf(d.geoid) !== -1) {
                d.update({ selected: false });
                d.update({ selected: true });
            }
        });
        let mapPathGroup = $("#highmap path[class*='highcharts-name-']").parent();
        let mapPaths = $("#highmap path[class*='highcharts-name-']");
        mapPaths.detach().sort((a: any, b: any) => {
            return parseInt($(a).attr('stroke-width').replace('px', '')) - parseInt($(b).attr('stroke-width').replace('px', ''));
        });
        mapPathGroup.append(mapPaths);
    }

    getSelectColor(context: any) {
        //let color = '#BADA55';
        //let returnColor = {
        //    radialGradient: {
        //        cx: 0.5,
        //        cy: 0.5,
        //        r: 0.45
        //    },
        //    stops: [
        //        [0, color],
        //        [1, color],
        //        [2, color],
        //        [3, color],
        //        [4, color],
        //        [5, color],
        //        [6, color],
        //        [7, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
        //    ]
        //};
        let returnColor = this.selectedPlaceColor;
        if (!this.selectedPlaceColor) {
            returnColor = '#a7a7a7';// this.temp_map_path_color;// null;// '#a7a7a7';
        }
        console.log('return select color', returnColor);
        return returnColor;
    }

    createGraphChart() {
        try {
            if (!this.isCustomChart) {
                //console.log('fred2 dss', this.dataStore.indicatorData[this.indicator].crt_db);
                //this.placeTypeData = data;
                this.placeTypeData = this.dataStore.indicatorData[this.indicator].crt_db;
                //this.Data = data.length > 0 ? data : [];
                //this.offsetYear = this.offsetYear === undefined ? this.getDefaultYear() : this.offsetYear;
                this.selectedYear = this.placeTypeData.Years[this.placeTypeData.Years.length - this.yearEndOffset - 1];
                this.processDataYear();
                this.processYearTicks();
                this.selectedYearIndex = this._tickArray.length - 1;// - this.yearEndOffset;
                //console.log('countycheck-1', this.placeTypeData);
                this.Data = this.placeTypeData.Data;
                //this.onChartDataUpdate.emit(data);
                //check if metadata, if not custom chart, need to do other stuff
                //TODO catch custom chart scenarios
                if (this.placeTypeData.Metadata.length > 0) {
                    //console.log('making graph chart');
                    var chartScope = this;
                    this.hasDrillDowns = this.placeTypeData.Metadata[0]['Sub_Topic_Name'] !== 'none';
                    this.chart.xAxis[0].setCategories(this._tickLabels);
                    //Highcharts.addEvent(this.chart, 'drilldown', (e:any) => { alert('drilldown called'); console.log('drilled down event: ',e) });
                    this.chart.xAxis[0].update({
                        min: 0,
                        max: this._tickArray.length - 1,// - (chartScope.yearEndOffset + 1),
                        tickInterval: this._tickArray.length - (chartScope.yearStartOffset + chartScope.yearEndOffset) > 10 ? 2 : null,
                        plotLines: [{
                            color: 'gray',
                            dashStyle: 'longdashdot',
                            width: this._tickArray.length > 1 && this.viewType === 'advanced' ? 2 : 0,
                            value: this.selectedYearIndex,
                            id: 'plot-line-1'
                        }],
                        plotOptions: {
                            series: {
                                events: {
                                    hide: function () {
                                        console.log('The series was just hidden');
                                        chartScope.chart.yAxis[0].setExtremes();
                                    },
                                    show: function () {
                                        chartScope.chart.yAxis[0].setExtremes();
                                    }

                                },
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

                    this.chart.tooltip.options.shared = false;
                    this.chart.tooltip.options.useHTML = true;
                    this.chart.tooltip.options.formatter = function (): any {
                        console.log('hovering', this);
                        //highlight corresponding map geography
                        //if (hoveredPlace !== undefined && hoveredPlace !== "Oregon") {
                        //    try { mapChart.get(hoveredPlace).setState(''); } catch (ex) { }
                        //}
                        let hoveredPlace = this.series.name
                            .replace(' County', '')
                            .replace(' School District', '')
                            .replace(' Margin of Error', '')
                            .split('<br>')[0];
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
                            var isMoeYear = this.x.match('-') && ['American Community Survey', 'Combined Decennial/ACS', 'County Level Census/ACS', 'MaritalStatusEstimate'].indexOf(chartScope.placeTypeData.Metadata[0].data_source) !== -1;
                            if (isMoeYear) {
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

                            let drillDownMsg = this.hasDrillDowns && !this.drilldownShowing && (this.isStateDDOnly && this.point.series.name === "Oregon" || !this.isStateDDOnly) && !this.hasDrillDownCategories ? '<span style="font-size:10px"><em>(Click on line to see demographics)</em></span>' : "";

                            return '<span style="fill: ' + this.series.color + ';"> ● </span><span style="font-size:10px"> ' + this.point.series.name + ' (' + this.x + ')</span><br/><span><b>' + displayValue + '</span><br/>';// + drillDownMsg;
                        }
                    };

                    let indicatorYaxis = this.placeTypeData.Metadata[0]['Y-Axis'] !== null ? this.placeTypeData.Metadata[0]['Y-Axis'] : this.indicator;
                    console.log('pissant', this.indicator);
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
                        floor: this.indicator.indexOf('Net Job Loss') === -1 ? 0 : null,
                        min: this.indicator.indexOf('Net Job Loss') === -1 ? 0 : null,
                        max: this.placeTypeData.Metadata[0]['Y-Axis_Max']
                    });
                    //let title = this.placeTypeData.Metadata[0]['Sub_Sub_Topic_ID'] !== null ? this.placeTypeData.Metadata[0]['Variable'] : this.placeTypeData.Metadata[0]['Dashboard_Chart_Title'] !== null ? this.placeTypeData.Metadata[0]['Dashboard_Chart_Title'] : this.indicator;
                    let title = this.placeTypeData.Metadata[0]['Dashboard_Chart_Title'] !== null ? this.placeTypeData.Metadata[0]['Dashboard_Chart_Title'] : this.indicator;
                    this.chart.setTitle(
                        {
                            text: this.viewType === 'basic' || this.isHandheld ? title.replace('<br>', ' ') : null,
                            align: this.viewType === 'basic' ? 'left' : this.isHandheld ? 'center' : null,
                            style: {
                                fontSize: '1.25em',
                                fontWeight: '200'
                            },
                            //widthAdjust: -10,
                            //x: -30
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
                    try {
                        this.chart.legend.update(this.setLegendOptions(true));
                    } catch (ex) {
                        console.log('failed', ex);
                    }
                    this.chart.redraw();
                } else {
                    //console.log('no chart for' + this.indicator);
                }
            } else {
                if (this.tileType === 'graph') {
                    this.createCustomChart();
                    this.chart.hideLoading();
                }
            }
        } catch (ex) {
            if (this.chart) {
                console.log('ERROR', ex.message);
                this.chart.showLoading('Sorry, this chart is not currently available' + ex.message);
            }
        }
    }

    getDataClasses() {
        //get unique classes from data and create data classes for map
        let uniqueVals: any[] = [];
        let dataClasses: any[] = [];
        let uniqueIdx: number = 0;
        this.dataStore[this.selectedPlaceType].indicatorData[this.indicator].chart_data.place_data.forEach((cd: any, idx: number) => {
            if (uniqueVals.indexOf(cd.value) === -1 && cd.value !== undefined && cd.value !== null && cd.value !== '') {
                uniqueVals.push(cd.value);
                //let dataClass: {} = {
                //    from: cd.value,
                //    to: cd.value,
                //    color: Highcharts.getOptions().colors[uniqueIdx],
                //    name: cd.value
                //}
                //dataClasses.push(dataClass);
                uniqueIdx++;
            }
        });
        uniqueVals
            .sort((a: any, b: any) => {
                if (a !== null && b !== null) {
                    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
                }
            })
            .forEach((cd: any, idx: number) => {
                let dataClass: {} = {
                    from: cd,
                    to: cd,
                    color: Highcharts.getOptions().colors[idx],
                    name: cd
                };
                dataClasses.push(dataClass);
            });
        return dataClasses;
        //return dataClasses.sort((a: any, b: any) => {
        //    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
        //});
    }

    onSelectedPlaceChangedCustomChart(selected: any) {
        console.log('place changed', selected, this.dataStore);
        this.selectedPlaceCustomChart = selected; // { Name: select.value };
        this.processCustomChart();
        this.onChartDataUpdate.emit({
            data: this.isCustomChart ? this.dataStore.indicatorData[this.indicator].chart_data : this.dataStore.indicatorData[this.indicator].crt_db,
            customPlace: this.selectedPlaceCustomChart,
            customYear: this.selectedCustomChartYear,
            metadata: this.dataStore.indicatorData[this.indicator].crt_db.Metadata[0]
        });
    }

    processCustomChart() {
        console.log('thinks it is custom chart', this.indicator_info.ScriptName);
        let chartScope = this;
        let categories: any[];
        try {
            switch (this.indicator_info.ScriptName) {
                case 'PopulationPyramid':
                case 'PopulationPyramidEstimate':
                case 'PropOwnByAge':
                case 'PropOwnByAgeEstimate':
                    let isHousing = this.indicator_info.ScriptName.indexOf('Pyramid') === -1;
                    let maxPadding = isHousing ? 5 : 2;
                    console.log('padding', this.dataStore.indicatorData[this.indicator].chart_data.place_data_years[this.selectedPlaceCustomChart.Name].maxVal);
                    categories = this.dataStore.indicatorData[this.indicator].chart_data.place_data_years[this.selectedPlaceCustomChart.Name].categories
                        .filter((cat: any) => {
                            return !isHousing
                                ? true
                                : this.selectedCustomChartYear !== '1990'
                                    ? cat !== 'under 25' && cat !== '75+'
                                    : (cat !== '85+' && cat !== '75-84');
                            //return this.selectedCustomChartYear !== '1990' ? cat !== 'under 25' && cat !== '75+' : (cat !== '85+' && cat !== '75-84' && cat !== '15-24');
                        });
                    console.log('custom chart categories', categories);
                    let pyramidOptions = {
                        chart: {
                            renderTo: 'highchart' + this.indicator,
                            type: 'bar'
                        },
                        colors: this.indicator_info.ScriptName.indexOf('Pyramid') === -1 ? ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
                            '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'] : ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#705c3b'],
                        credits: {
                            enabled: false
                        },
                        title: {
                            text: ''
                        },
                        subtitle: {
                            text: this.viewType === 'advanced' ? this.selectedPlaceCustomChart.Name + ': ' + this.selectedCustomChartYear : this.selectedCustomChartYear
                        },
                        xAxis: this.viewType === 'advanced' ? [{
                            categories: categories,
                            reversed: false,
                            labels: {
                                step: 1
                            }
                        }, { // mirror axis on right side
                                opposite: true,
                                reversed: false,
                                categories: categories,
                                linkedTo: 0,
                                labels: {
                                    step: 1
                                }
                            }] : [{
                                categories: categories,
                                reversed: false,
                                labels: {
                                    step: 2
                                }
                            }],
                        yAxis: {
                            title: {
                                text: isHousing ? '' : 'Percent of Total Population'
                            },
                            labels: {
                                formatter: function () {
                                    return (Math.abs(this.value)) + '%';
                                }
                            },
                            max: this.dataStore.indicatorData[this.indicator].chart_data.place_data_years[this.selectedPlaceCustomChart.Name].maxVal + maxPadding,
                            min: -(this.dataStore.indicatorData[this.indicator].chart_data.place_data_years[this.selectedPlaceCustomChart.Name].maxVal) - maxPadding
                        },
                        plotOptions: {
                            series: {
                                stacking: 'normal',
                                animation: false
                            }
                        },

                        tooltip: {
                            formatter: function () {
                                //check if year is span year
                                let moeVal: any = '';
                                if (chartScope.selectedCustomChartYear.indexOf('-') !== -1) {
                                    let pData = chartScope.dataStore.indicatorData[chartScope.indicator].chart_data.place_data_years[chartScope.selectedPlaceCustomChart.Name];
                                    //get cat index
                                    let idx: number = 0;
                                    pData.categories.forEach((cat: any, cidx: number) => {
                                        idx = this.point.category === cat ? cidx : idx;
                                    });
                                    moeVal = pData.data[this.series.name.toLowerCase()][chartScope.selectedCustomChartYear].data_moe[idx] ? chartScope.formatValue(pData.data[this.series.name.toLowerCase()][chartScope.selectedCustomChartYear].data_moe[idx], false) : '';
                                }
                                return '<b>' + this.series.name + ', age '
                                    + this.point.category + '</b><br/>'
                                    + chartScope.selectedPlaceCustomChart.Name + ': '
                                    + chartScope.selectedCustomChartYear
                                    + '<br/>'
                                    + (this.series.name === 'Owners'
                                        ? '% of owners: '
                                        : (this.series.name === 'Renters'
                                            ? '% of renters: '
                                            : '% of Population: '))
                                    + Highcharts.numberFormat(Math.abs(this.point.y), 2)
                                    + '%' + (!isHousing && moeVal !== '' ? '<span style="font-size:.8em"> (+/- ' + moeVal + ')</span>' : '');
                            }
                        },

                        series: [{
                            name: isHousing ? 'Owners' : 'Males',
                            data: isHousing ? this.dataStore.indicatorData[this.indicator].chart_data.place_data_years[this.selectedPlaceCustomChart.Name].data.owners[this.selectedCustomChartYear].data
                                .filter((data: any, idx: number) => {
                                    return this.indicator_info.ScriptName.indexOf('Estimate') !== -1 ? true : this.selectedCustomChartYear !== '1990' ? [6].indexOf(idx) === -1 : [7, 8].indexOf(idx) === -1;
                                })
                                : this.dataStore.indicatorData[this.indicator].chart_data.place_data_years[this.selectedPlaceCustomChart.Name].data.males[this.selectedCustomChartYear].data
                        }, {
                                name: isHousing ? 'Renters' : 'Females',
                                data: isHousing ? this.dataStore.indicatorData[this.indicator].chart_data.place_data_years[this.selectedPlaceCustomChart.Name].data.renters[this.selectedCustomChartYear].data
                                    .filter((data: any, idx: number) => {
                                        return this.indicator_info.ScriptName.indexOf('Estimate') !== -1 ? true : this.selectedCustomChartYear !== '1990' ? [6].indexOf(idx) === -1 : [7, 8].indexOf(idx) === -1;
                                    })
                                    : this.dataStore.indicatorData[this.indicator].chart_data.place_data_years[this.selectedPlaceCustomChart.Name].data.females[this.selectedCustomChartYear].data
                            }
                        ]
                    };
                    this.chart.destroy();
                    this.chart = new Highcharts.Chart(pyramidOptions);
                    break;
                case 'IncomeHistogram':
                case 'FoodProcessEmps':
                    categories = this.dataStore.indicatorData[this.indicator].chart_data.place_data_years[this.selectedPlaceCustomChart.Name].categories
                        .filter((cat: any) => {
                            return this.selectedCustomChartYear !== '1990' ? cat !== '> $150,000' : (cat !== '$150,000 - 199,999' && cat !== '> $200,000');
                        });
                    console.log('income cat', categories);

                    let incomeDistOptions = {
                        chart: {
                            type: 'column',
                            renderTo: 'highchart' + this.indicator
                        },
                        credits: {
                            enabled: false
                        },
                        title: {
                            text: ''
                        },
                        subtitle: {
                            text: this.viewType === 'advanced' ? this.selectedPlaceCustomChart.Name + ': ' + this.selectedCustomChartYear : this.selectedCustomChartYear
                        },
                        xAxis: {
                            categories: categories,
                            crosshair: true,
                            labels: {
                                formatter: function () {
                                    if (chartScope.viewType === 'basic') {
                                        return this.value.toString().replace(/\,000/g, 'K').replace(/\,999/g, 'K');
                                    } else {
                                        return this.value;
                                    }
                                }
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: this.indicator_info.ScriptName === 'IncomeHistogram' ? '# of Households' : '# of food processors'
                            }
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            },
                            series: {
                                animation: false
                            }
                        },
                        tooltip: {
                            formatter: function () {
                                //check if year is span year
                                let moeVal: any = '';
                                if (chartScope.selectedCustomChartYear.indexOf('-') !== -1) {
                                    let pData = chartScope.dataStore.indicatorData[chartScope.indicator].chart_data.place_data_years[chartScope.selectedPlaceCustomChart.Name];
                                    //get cat index
                                    let idx: number = 0;
                                    pData.categories.forEach((cat: any, cidx: number) => {
                                        idx = this.point.category === cat ? cidx : idx;
                                    });
                                    moeVal = chartScope.formatValue(pData.data[chartScope.selectedCustomChartYear].data_moe[idx], false);
                                }
                                return chartScope.selectedPlaceCustomChart.Name + ': ' + chartScope.selectedCustomChartYear + '<br/><b>' + this.point.category + '</b><br/>' + chartScope.formatValue(this.point.y, false) + (moeVal !== '' ? '<span style="font-size:.8em"> (+/- ' + moeVal + ')</span>' : '');

                            }
                            //headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                            //pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            //'<td style="padding:0"><b>{point.y::,.0f} </b></td></tr>',
                            //footerFormat: '</table>',
                            //useHTML: true
                        },

                        series: [{
                            name: this.selectedPlaceCustomChart.Name + (this.indicator_info.ScriptName === 'IncomeHistogram' ? ' Income Distribution' : ' Food Processors by Number of Employees'),
                            data: this.dataStore.indicatorData[this.indicator].chart_data.place_data_years[this.selectedPlaceCustomChart.Name].data[this.selectedCustomChartYear].data
                                .filter((data: any, idx: number) => {
                                    return this.selectedCustomChartYear !== '1990' ? idx !== 8 : idx !== 7 && idx !== 9;
                                })
                        }]
                    };
                    this.chart.destroy();
                    console.log('incomeDistOptions', incomeDistOptions);
                    this.chart = new Highcharts.Chart(incomeDistOptions);
                    console.log('incomeDistOptionsLoaded!', this.chart);
                    break;
                case 'ClientContacts211Info':
                case 'SocialServiceProviders211Info':
                case 'PovertyByRace':
                case 'NAICS_Farms':
                    console.log('carnivore', this.selectedPlaceCustomChart);
                    let chartTitle: any = this.isCountyLevel && this.selectedPlaceCustomChart.TypeCategory !== 'Counties' ?
                        this.selectedPlaceCustomChart.GeoInfo.length > 0 ?
                            this.selectedPlaceCustomChart.GeoInfo[0].County + ' County: ' + this.selectedCustomChartYear + '<br> (for ' + this.selectedPlaceCustomChart.Name + ')' :
                            this.viewType === 'advanced' ?
                                this.selectedPlaceCustomChart.Name + ': ' + this.selectedCustomChartYear :
                                this.selectedCustomChartYear :
                        this.viewType === 'advanced' ?
                            this.selectedPlaceCustomChart.Name + ': ' + this.selectedCustomChartYear :
                            this.selectedCustomChartYear;
                    let _211InfoChartOptions = {
                        chart: {

                            renderTo: 'highchart' + this.indicator,
                            type: 'pie'
                        },
                        credits: {
                            enabled: false
                        },
                        legend: {
                            enabled: (this.viewType === 'basic' || this.isHandheld) ? true : false,
                            itemStyle: {
                                fontSize: '.7em',
                                color: 'gray'
                            }
                        },
                        title: {
                            text: ''
                        },
                        subtitle: {
                            text: chartTitle
                        },
                        tooltip: {
                            pointFormat: this.indicator_info.ScriptName === 'PovertyByRace'
                                ? '<b>{point.name}</b>: {point.y:.1f}%'
                                : this.indicator_info.ScriptName === 'NAICS_Farms'
                                    ? '{series.name}: {point.y:.0f} Farms <b>{point.percentage:.1f}%</b>'
                                    : '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: this.viewType === 'advanced' && !this.isHandheld ? true : false,
                                    format: this.indicator_info.ScriptName === 'PovertyByRace'
                                        ? '<b>{point.name}</b><br> {point.y:.1f}%'
                                        : '<b>{point.name}</b><br>{point.percentage:.1f} %',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'gray',
                                        fontSize: this.viewType === 'advanced' ? '1em' : '.7em',
                                        maxWidth: this.viewType === 'advanced' ? '200px' : '75px'
                                    }
                                },
                                showInLegend: this.viewType === 'advanced' ? false : true
                            },
                            series: {
                                animation: false
                            }
                        },
                        series: [{
                            name: this.selectedPlaceCustomChart.Name,
                            colorByPoint: true,
                            data: this.dataStore.indicatorData[this.indicator].chart_data.place_data_years[this.selectedPlaceCustomChart.Name].data[this.selectedCustomChartYear].data
                        }]
                    };
                    console.log('setting chart options', _211InfoChartOptions);
                    this.chart.destroy();
                    this.chart = new Highcharts.Chart(_211InfoChartOptions);
                    break;
                case 'Other':
                    break;
                default:
                    break;
            }

        } catch (ex) {
            if (this.chart) {
                this.chart.showLoading('Sorry this chart is not currently available');
            }
        }        //this.chart.legend.update(this.setLegendOptions(false));
        //this.chart.reflow();
    }

    createCustomChart() {
        try {
            console.log('creating custom chart!', this.indicator_info.ScriptName, this.dataStore);
            this.placeTypeData = this.dataStore.indicatorData[this.indicator].crt_db;
            this.selectedYear = this.placeTypeData.Years[this.placeTypeData.Years.length - this.yearEndOffset - 1];
            this.processDataYear();
            let placeSelected: boolean = false;
            this.places.forEach((place: any) => {
                placeSelected = this.selectedPlaceCustomChart ? this.selectedPlaceCustomChart.Name === place.Name ? true : placeSelected : false;
            });
            this.selectedPlaceCustomChart = placeSelected ? this.selectedPlaceCustomChart : this.places[0];
            this.processCustomChart();
            if (this.viewType === 'advanced' && this._tickArray.length > 1) {
                this.setupTimeSlider();
            } else {
                this.showSlider = false;
            }
        } catch (ex) {
            console.log('errorballs', ex, this.tileType);
            //if (this.chart) {
            //    this.chart.showLoading('Sorry, this chart is not available');
            //}
        }
    }

    addSeriesDataToGraphChart(mapPlaces?: any[],drilldown?:any) {
        //console.log('this.Data at addSeries...', this.Data, this.tileType);
        //clear out and add again for sync purposes
        while (this.chart.series.length > 0) {
            this.chart.series[0].remove(false);
        }
        //show selected places on chart only
        console.log('countycheck0', this.Data, this.dataStore, drilldown);
        //var selectedPlaceData = this.Data.filter((placeData: any) => {
        //    var isSelected = false;
        //    //selections come from the place selector box, not high-maps
        //    console.log('countycheck1', placeData);
        //    for (var p = 0; p < this.places.length; p++) {
        //        isSelected = (placeData.community.trim() === this.places[p].Name.replace(' County', '').trim() && placeData.geoid.trim() === this.places[p].ResID.trim()) ? true : isSelected;
        //        console.log('countycheck', this.places, placeData);
        //        isSelected = this.isCountyLevel && this.places[p].Desc !== null ? this.places[p].Desc.indexOf(placeData.community.trim()) !== -1 ? true : isSelected : isSelected;
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
        let oregonGeoids = ['41', '41r', '41u', '9999'];
        let californiaGeoids = ['06', '06r', '06u'];
        //let statewideGeoids = oregonGeoids.concat(californiaGeoids);
        //let sortedPlaceData = selectedPlaceData.sort((a: any, b: any) => b.geoid.localeCompare(a.geoid));
        let sortedPlaceData = this.Data.sort((a: any, b: any) => {
            if (this.isSchool) {
                return a.geoid.localeCompare(b.geoid);
            } else {
                return b.geoid.localeCompare(a.geoid);
            }
        });

        if (drilldown) {
            sortedPlaceData = drilldown.data;
        }

        //process data series
        console.log('sortedplacedata', sortedPlaceData);
        let addedSeries: any[] = [];
        sortedPlaceData.forEach((pd: any, idx: number) => {
            //for (var x = 0; x < selectedPlaceData.length; x++) {
            console.log('sortedplacedata', pd);
            let isOregon = oregonGeoids.indexOf(pd.geoid) !== -1 ? true : false;
            let isCalifornia = californiaGeoids.indexOf(pd.geoid) !== -1 ? true : false;
            let isRural = pd.geoid.indexOf('r') !== -1;
            let isUrban = pd.geoid.indexOf('u') !== -1;
            var isState = isOregon || isCalifornia ? true : false;
            let isCombined = pd.geoid === '';
            let isBarChart = this.dataStore.indicatorData[this.indicator].chart_data.place_data_years[(this.isSchool ? pd.Name : pd.community)].data.length === 1;
            let color = isRural
                ? '#996699'
                : isUrban
                    ? '#0088CC'
                    : isOregon
                        ? '#244068'
                        : isCalifornia
                            ? '#C34500'
                            : isCombined && this.checkCombineGroups().length === 1
                                ? '#98BD85'
                                : Highcharts.getOptions().colors[idx];
            console.log('scherwma', drilldown, this.dataStore);
            let data = !drilldown
                ? (this.dataStore.indicatorData[this.indicator].chart_data.place_data_years[(this.isSchool ? pd.Name : pd.community)].data)
                : this.dataStore.indicatorData[this.indicator].chart_dd_data.place_data_years_dd[drilldown.place.replace(' County', '') + ": " + pd.Variable].data;
            //console.log('mustarddata', data, addedSeries,pd, this.hasCombined);
            if (addedSeries.indexOf((this.isSchool
                ? pd.Name
                : pd.community) + pd.geoid) === -1 && this.hasCombined
                ?
                this.dataStore.indicatorData[this.indicator].chart_data.place_data_years[(this.isSchool ? pd.Name : pd.community)].data.filter((d: any) => d !== null).length > 0
                : true) {
                let seriesID = drilldown
                    ? pd.Variable.replace(this.getDDRemoveText(drilldown.data, pd.Variable), "")
                    : (
                        this.isSchool
                            ? pd.Name
                            : pd.community) + pd.geoid;
                if (addedSeries.indexOf(seriesID) === -1) {
                    console.log('mustard', seriesID, data);
                    addedSeries.push(seriesID);
                    this.chart.addSeries({
                        id: seriesID,
                        name: drilldown? seriesID : this.getCommunityName(pd),
                        type: isBarChart ? 'column' : 'line',
                        lineWidth: isState && !drilldown ? 4 : 2,
                        lineColor: isState && !drilldown ? '#A3A3A4' : Highcharts.getOptions().colors[idx],
                        lineOpacity: 1.0,
                        data: data,
                        geoid: pd.geoid,
                        color: color,
                        connectNulls: true,
                        threshold: 0,
                        fillOpacity: 0.85,
                        drilldown: drilldown ? false : this.hasDrillDowns,
                        animation: {
                            duration: 500
                        },
                        marker: {
                            fillColor: isState && !drilldown
                                ? '#FFFFFF'
                                : Highcharts.getOptions().colors[idx],
                            lineWidth: isState ? 4 : 2,
                            lineColor: isRural
                                ? '#996699'
                                : isUrban
                                    ? '#0088CC'
                                    : isOregon && !drilldown
                                        ? '#244068'
                                        : isCalifornia && !drilldown
                                            ? '#C34500'
                                            : isCombined && this.checkCombineGroups().length === 1
                                                ? '#98BD85'
                                                : Highcharts.getOptions().colors[idx],
                            radius: this.placeTypeData.Years.length > 10 ? 3.5 : 4,
                            symbol: 'circle'
                        }
                    }, true);
                    if (!drilldown && this.hasDrillDowns) {
                        Highcharts.addEvent(this.chart.series[this.chart.series.length - 1], 'click', (evt: any) => {
                            this.getDrillDownData(evt);
                        });
                        //(evt: any) => { alert('test'); console.log('series clicked!', evt); });
                    }
                    if (this.hasMOEs) {
                        console.log('adding moe', this.dataStore.indicatorData[this.indicator].chart_data.place_data_years_moe[pd.community].data);
                        let moe_data = !drilldown ? this.dataStore.indicatorData[this.indicator].chart_data.place_data_years_moe[pd.community].data
                            : this.dataStore.indicatorData[this.indicator].chart_dd_data.place_data_years_moe_dd[drilldown.place.replace(' County','') + ': ' + pd.Variable].data
                        const moe_data_check =  moe_data
                            .filter((m: any[]) => {
                                return m ? m.filter(moe => $.isNumeric(moe)).length > 0 : false;
                            });
                        console.log('moe check?', moe_data_check);
                        if (moe_data_check.length > 0) {
                            this.chart.addSeries({
                                name: seriesID + ' Margin of Error', // pd.community + ' Margin of Error',
                                whiskerLength: 10,
                                whiskerColor: isState ? 'gray' : Highcharts.getOptions().colors[idx],
                                stemColor: isState ? 'gray' : Highcharts.getOptions().colors[idx],
                                stemDashStyle: 'Dash',
                                type: 'errorbar',
                                data: moe_data,
                                linkedTo: seriesID,  // this.getCommunityName(pd), // pd.community + pd.geoid,
                                visible: this.showMOES
                            }, false);
                            var maxMoe = this.getMaxMOE(moe_data);
                            var minMoe = this.getMinMOE(moe_data);
                            if (maxMoe !== undefined) {
                                var extremes = this.chart.yAxis[0].getExtremes();
                                maxMoe = maxMoe < extremes.max ? extremes.max : maxMoe;
                                minMoe = minMoe > 0 ? 0 : minMoe;
                                this.chart.yAxis[0].setExtremes(minMoe, maxMoe);
                            }
                        }
                    }
                }
            }
        });
        var extremes = this.chart.yAxis[0].getExtremes();
        console.log('get extremes', extremes);
        this.chart.redraw();
        this.chart.yAxis[0].setExtremes();

        //if (this.hasDrillDowns || this.placeTypeData.Metadata[0].Sub_Topic_Name !== 'none') {
        //    var options = this.chart.options;
        //    console.log('Benny', options, this.chart);
        //    options.events = {
        //        drilldown: (e: any) => {
        //            console.log('drilldown event!!!', e);
        //        }
        //    }
        //    this.chart = new Highcharts.Chart(options);
        //}
        //this.chart.redraw();

    }

    getDDRemoveText(ddMeta: any[], field: string) {
        //////////////////////
        // Function to find similiar words to remove for drilldown series name display
        // Compares the drill down categories against each other and keeps the words that are the same in the  same order
        /////////////////////
        var removeText = "";
        var prevArray: any[] = [],
            curArray: any[] = [];
        ddMeta.forEach((dd: any) => {
            //console.log('removeText', dd, field, prevArray, curArray);
            curArray = dd.Variable.split(' ');
            let removeTextArray: any[] = removeText.split(' ');
            if (prevArray.length !== 0) {
                for (var x = 0; x < prevArray.length; x++) {
                    //console.log('removeCandidate', prevArray[x]);
                    if (prevArray[x] === curArray[x] && removeTextArray[x] !== prevArray[x]) {
                        removeText += prevArray[x] + ' ';
                    }
                    else {
                        removeText = removeText;
                    }
                }
            }
            else {
                prevArray = curArray;
            }
        });
        //console.log('remove text', removeText);
        return removeText;
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
        //console.log('resizing...', this.indicator,this.tileType, this.chart);
        try {
            if (this.chart || this.mapChart) {

                var runInterval = setInterval(runCheck, 2000);
                var resizeScope = this;
                function runCheck() {

                    let newWidth = resizeScope.elementRef.nativeElement.offsetWidth - 100 > $(resizeScope.isCustomChart ? '.graph-chart' : '.map-chart').width() ? resizeScope.elementRef.nativeElement.offsetWidth - 100 : $(resizeScope.isCustomChart ? '.graph-chart' : '.map-chart').width();
                    $('.ui-slider-wrapper').css('width', newWidth - 93 + 'px');

                    if (resizeScope.mapChart && resizeScope.indicator_info.Represented_ID === 10) {
                        //console.log('foster', resizeScope.indicator, resizeScope.tileType, resizeScope.chart.legend.display);
                        if (resizeScope.mapChart.legend) {
                            //console.log('foster2', resizeScope.indicator, resizeScope.tileType, resizeScope.setLegendOptions(true));
                            try {
                                resizeScope.mapChart.legend.update(resizeScope.setLegendOptions());
                            } catch (ex) {
                                console.log('failed', ex);
                                clearInterval(runInterval);
                            }
                        }
                    }

                    clearInterval(runInterval);
                }
            }
        } catch (ex) {
            console.log('resize failed', ex);
        }
    }

    setLegendOptions(show?: boolean) {
        //console.log('legendOptions', $('#data-tile-wrapper').width(), this.elementRef.nativeElement.offsetWidth, $(this.elementRef.nativeElement).width());
        //let domTile = $('#data-tile-wrapper');
        try {
            let returnObj: any = {};
            let domTile = this.related ? $(this.elementRef.nativeElement) : $('#data-tile-wrapper');
            //let domTile = $('#data-tile-wrapper');
            let domTileWidth = $(domTile).width() !== 0
                ? $(domTile).width()
                : this.elementRef.nativeElement.offsetParent
                    ? this.elementRef.nativeElement.offsetParent.offsetWidth - 50
                    : 400;
            //let domTileWidth = $('#highchart' + this.indicator).width();
            console.log('domtilewidth', this.indicator, domTileWidth, this.elementRef.nativeElement.offsetParent.offsetWidth);
            returnObj = {
                itemStyle: {
                    // width: this.viewType === 'basic' ? (domTileWidth - 40) / 2 : 180,
                    color: '#4d4d4d'
                },
                title: {
                    text: this.isStatewide || !show ? null : 'LEGEND: <span style="font-size: 9px; color: #666; font-weight: normal">(Click to hide series in chart)</span>'
                }
            };
            if (this.indicator_info.Represented_ID === 10) {
                if ((domTileWidth < 800 && (this.getDataClasses().length > 3))) {
                    console.log('wishthati');
                    //returnObj.width = (domTileWidth * .7);
                    returnObj.align = 'center';
                    returnObj.x = domTileWidth < 400 ? 40 : 20;
                } else if (this.getDataClasses().length > 8) {
                    returnObj.x = 30;
                }
            }
            return returnObj;
        } catch (ex) {
            console.log('resize legend failed', this.indicator_info, ex);
            return null;
        }
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
            if (this.isSchool) {
                //console.log('checkselectedplaceforhighmap', this.places[p], place);
                if (this.places[p].GeoInfo.length > 0) {
                    this.places[p].GeoInfo.forEach((gi: any) => {
                        isSelected = gi.School_District !== null ? gi.School_District.indexOf(place.Name) !== -1 ? true : isSelected : false;
                    });
                } else {
                    isSelected = this.places[p].Name === place.Name ? true : isSelected;
                }
            } else {
                isSelected = place.geoid === this.places[p].ResID ? true : isSelected;
                if (!isSelected) {
                    if (this.places[p].GeoInfo.length > 0) {
                        this.places[p].GeoInfo.forEach((gi: any) => {
                            isSelected = gi.geoid.indexOf(place.geoid) !== -1 ? true : isSelected;
                        });
                    }
                }
            }
            //console.log('countylevel checking', this.places[p], place);
            //if (!this.isSchool) {
            //    if (this.places[p].Desc) {
            //        let split: number = this.places[p].ResID.length > 9 ? 1 : 0;
            //        isSelected = this.isCountyLevel ?
            //            (this.places[p].Desc.split(', ').length > split ? this.places[p].Desc.split(', ')[split].replace(' County', '') === place.community.replace(' County', '').trim() :
            //                isSelected) :
            //            isSelected;
            //    }
            //}
            if (this.isCountyLevel && this.places[p].TypeCategory !== 'Counties') {
                if (this.places[p].GeoInfo.length > 0) {
                    this.places[p].GeoInfo.forEach((gi: any) => {
                        //console.log('countylevel checking', gi, place);
                        isSelected = gi.county_geoid === place.geoid ? true : isSelected;
                    });
                }
            }
        }
        return isSelected;
    }

    getCommunityName(pData: any) {
        //find if unincorporated place or showing county level data
        console.log('getCommunityName', this.places, pData, this.isCountyLevel);
        let returnName = '';
        this.places.forEach((place: SearchResult) => {
            //console.log('returnName schoolz', place, pData);
            if (this.isSchool) {
                //console.log('returnName school', place, pData);
                //search geoinfo for district name
                if (place.GeoInfo.length > 0) {
                    place.GeoInfo.forEach((gi: any) => {
                        if (gi.School_District ? gi.School_District.indexOf(pData.Name) !== -1 : false) {
                            //console.log('returnname match', returnName, pData);
                            returnName = pData.Name + '<br><em><span style="color:#a7a7a7; font-size:.8em;">(' + (place.TypeCategory === 'Counties' ? 'in ' : 'for ') +
                                place.Name.trim() + ')</em></span> ';
                        }
                    });
                } else {
                    returnName = pData.Name === 'Statewide' ? 'Oregon' : pData.Name;
                }
            } else if (place.TypeCategory === 'Unincorporated Place'
                && pData.geoType === 'Census Tract'
                && !place.Combined
                && (pData.geoid.split(',').indexOf(place.ResID) !== -1 || place.Desc.replace(' County', '').indexOf(pData.community) !== -1)
            ) {
                //returnName = returnName === '' ? pData.community + (pData.geoid.length === 5 ? ' County' : '') + '<br><em><span style="color:#a7a7a7; font-size:.8em;">(contains ' + place.Name.trim() + ')</em></span>' : returnName.split(')</em></span>')[0] + ',' + place.Name.trim() + ')</em></span>';
                if (this.isCountyLevel) {
                    //console.log('getcommunityname', place);
                    returnName = returnName === '' ?
                        place.GeoInfo.length > 0 ?
                            (place.GeoInfo[0].County + ' County<br><em><span style="color:#a7a7a7; font-size:.8em;">(contains ' + place.Name.trim() + ')</em></span>') :
                            (place.Desc.split(', ').length > 1 ?
                                place.Desc.split(', ')[1].split('~')[0] :
                                place.Desc) + '<br><em><span style="color:#a7a7a7; font-size:.8em;">(contains ' + place.Name.trim() + ')</em></span>' :
                        returnName.split(')</em></span>')[0] + ',' + place.Name.trim() + ')</em></span>';
                } else {
                    console.log('returnName', place, returnName);
                    returnName = returnName === ''
                        ? place.Desc.split('~')[0]
                        + (place.ResID.length === 5
                            ? ' County'
                            : '')
                        + '<br><em><span style="color:#a7a7a7; font-size:.8em;">(contains '
                        + place.Name.trim() + ')</em></span>'
                        : returnName.split(')</em></span>')[0] + ',' + place.Name.trim() + ')</em></span>';
                }

            } else if (this.isCountyLevel && (place.TypeCategory === 'Incorporated City' || place.TypeCategory === 'Incorporated Town' || place.TypeCategory === 'Census Designated Place') && place.Desc.replace(' County', '') === pData.community) {
                //console.log('countylevel translation', pData.community + ' (contains ' + place.Name + ')');
                returnName = returnName === '' ? pData.community + (pData.geoid.length === 5 ? ' County' : '') + '<br><em><span style="color:#a7a7a7; font-size:.8em;">(contains ' + place.Name.trim() + ')</em></span>' : returnName.split(')</em></span>')[0] + ',' + place.Name.trim() + ')</em></span>';
            }
        });
        //console.log('returnName', returnName);
        return returnName === '' ? pData.community + (pData.geoid.length === 5 ? ' County' : '') : returnName; // pData.community;
        //return pData.community;
    }

    ageSort(a: any, b: any) {
        if (b.Variable.indexOf('under 25') !== -1) {
            return 1000;
        } else if (a.Variable.indexOf('under 25') !== -1) {
            return -1000;
        } else {
            let x = a.Variable.split('-')[0].split('+')[0].replace('Males Age ', '').replace('Females Age ', '').replace('+', '').replace(' count', '').replace('owners ', '').replace('renters ', '');
            let y = b.Variable.split('-')[0].split('+')[0].replace('Males Age ', '').replace('Females Age ', '').replace('+', '').replace(' count', '').replace('owners ', '').replace('renters ', '');
            return x - y;
        }
    }

    incomeSort(a: any, b: any) {
        if (b.Variable.indexOf('< $10,000') !== -1) {
            return 1000;
        } else if (a.Variable.indexOf('< $10,000') !== -1) {
            return -1000;
        } else {
            let x = parseInt(a.Variable.split(' -')[0].replace('<', '').replace('>', '').replace('$', ''));
            let y = parseInt(b.Variable.split(' -')[0].replace('<', '').replace('>', '').replace('$', ''));
            return x - y;
        }
    }

    employeeSort(a: any, b: any) {
        let aSimple = a.Variable.replace('Food Processor ', '').split('-')[0];
        let bSimple = b.Variable.replace('Food Processor ', '').split('-')[0];
        if (aSimple.indexOf('250+') !== -1) {
            return 1000;
        } else {
            return aSimple - bSimple;
        }
    }

    processCustomChartData(chartType: any) {
        let place_data_years: any = {};
        if (this.places.length === 0) {
            let Oregon: SearchResult = { Name: 'Oregon', ResID: '41', Type: 'Place', TypeCategory: 'State', Desc: '' };
            this.places.push(Oregon);

        }

        switch (this.indicator_info.ScriptName) {
            case 'PopulationPyramid':
            case 'PopulationPyramidEstimate':
            case 'PropOwnByAge':
            case 'PropOwnByAgeEstimate':
                //pop pyramid need data filtered by place (36 rows for each place), then arranged by year and gender
                this.places.forEach((place: any, pidx: number) => {
                    let placeData1 = this.placeTypeData.Data
                        .filter((data: any) => {
                            return data.geoid ? data.geoid === place.ResID && data.Variable.indexOf(this.indicator_info.ScriptName.indexOf('Pyramid') !== -1 ? 'Males' : 'owners') !== -1 : false;
                        }).sort(this.ageSort);

                    let placeData2 = this.placeTypeData.Data.filter((data: any) => {
                        return data.geoid ? data.geoid === place.ResID && data.Variable.indexOf(this.indicator_info.ScriptName.indexOf('Pyramid') !== -1 ? 'Females' : 'renters') !== -1 : false;
                    }).sort(this.ageSort);

                    let placeData1Years: any[] = [];
                    let placeData2Years: any[] = [];
                    let dataYears: any[] = [];
                    let categories: any[] = [];
                    let maxValue: number = 0;
                    //get years from data
                    if (placeData1.length > 0) {
                        let counter = 0;
                        for (var col in placeData1[0]) {
                            if ($.isNumeric(col.substring(0, 1)) && col.indexOf('MOE') === -1) {
                                if (placeData1[0][col] !== null || placeData1[1][col] !== null) {
                                    if (pidx === 0) {
                                        this._tickLabelsTime.push(col);
                                        this._tickArray.push(counter);
                                    }
                                    dataYears.push(col);
                                    counter++;
                                }
                            }
                        }

                        dataYears.forEach((year: any, idx: number) => {
                            let yearData1: any = {
                                year: year,
                                community: place.Name,
                                dataCategory: this.indicator_info.ScriptName.indexOf('Pyramid') !== -1 ? 'Males' : 'Owners',
                                data: [],
                                data_moe: []
                            };
                            let yearData2: any = {
                                year: year,
                                community: place.Name,
                                dataCategory: this.indicator_info.ScriptName.indexOf('Pyramid') !== -1 ? 'Females' : 'Renters',
                                data: [],
                                data_moe: []
                            };
                            //for propownbyage need to sum filtered data
                            let yearData1Sum: number = 0;
                            let yearData2Sum: number = 0;

                            placeData1.forEach((pdm: any) => {
                                yearData1Sum += pdm[year] !== null ? parseFloat(pdm[year]) : 0;
                                yearData1.data.push(-Math.abs(parseFloat(pdm[year])));
                                if (year.indexOf('-') !== -1) {
                                    yearData1.data_moe.push(parseFloat(pdm[year + '_MOE']));
                                }
                                if (idx === 0) {
                                    categories.push(pdm['Variable']
                                        .replace('Males Age ', '')
                                        .replace(' count', '')
                                        .replace(' estimate', '')
                                        .replace('owners ', '')
                                    );
                                }
                            });
                            placeData2.forEach((pdm: any) => {
                                yearData2Sum += pdm[year] !== null ? parseFloat(pdm[year]) : 0;
                                yearData2.data.push(parseFloat(pdm[year]));
                                if (year.indexOf('-') !== -1) {
                                    yearData2.data_moe.push(parseFloat(pdm[year + '_MOE']));
                                }
                            });

                            yearData1.data = yearData1.data.map((data: any) => {
                                let returnVal: any;
                                if (this.indicator_info.ScriptName.indexOf('Pyramid') !== -1) {
                                    returnVal = data;
                                } else {
                                    returnVal = (data / yearData1Sum) * 100;
                                }
                                maxValue = Math.abs(returnVal) > maxValue ? Math.abs(returnVal) : maxValue;
                                return returnVal;
                            });

                            yearData2.data = yearData2.data.map((data: any) => {
                                let returnVal: any;
                                if (this.indicator_info.ScriptName.indexOf('Pyramid') !== -1) {
                                    returnVal = data;
                                } else {
                                    returnVal = (data / yearData1Sum) * 100;
                                }
                                maxValue = Math.abs(returnVal) > maxValue ? Math.abs(returnVal) : maxValue;
                                return returnVal;
                            });
                            console.log('propown', yearData1, yearData1Sum);

                            placeData1Years[year] = yearData1;
                            placeData2Years[year] = yearData2;
                        });
                    } else {
                        console.log('no data for pyramid');
                    }
                    place_data_years[place.Name] = {
                        id: place.Name,
                        name: place.Name,
                        geoid: place.ResID,
                        maxVal: maxValue,
                        data: this.indicator_info.ScriptName.indexOf('Pyramid') !== -1 ? {
                            males: placeData1Years,
                            females: placeData2Years
                        } : {
                                owners: placeData1Years,
                                renters: placeData2Years
                            },
                        years: this._tickLabelsTime,
                        categories: categories
                    };
                    console.log('propown2', place_data_years);
                    this.selectedCustomChartYear = dataYears[dataYears.length - 1];
                    this.customChartYears = dataYears;
                });
                break;
            case 'IncomeHistogram':
            case 'ClientContacts211Info':
            case 'SocialServiceProviders211Info':
            case 'PovertyByRace':
            case 'NAICS_Farms':
            case 'FoodProcessEmps':

                this.places.forEach((place: any, pidx: number) => {
                    let placeData = this.placeTypeData.Data
                        .filter((data: any) => {
                            if (this.isCountyLevel && place.GeoInfo.length > 0) {
                                console.log('december');
                                return place.GeoInfo[0].county_geoid === data.geoid;
                            } else {
                                return data.geoid ? data.geoid === place.ResID : false;
                            }
                        })
                        .sort(this.indicator_info.ScriptName === 'FoodProcessEmps' ? this.employeeSort : this.incomeSort);
                    let placeDataYears: any[] = [];
                    let dataYears: any[] = [];
                    let categories: any[] = [];

                    //get years from data
                    if (placeData.length > 0) {
                        let counter = 0;
                        for (var col in placeData[0]) {
                            if ($.isNumeric(col.substring(0, 1)) && col.indexOf('MOE') === -1) {
                                if (placeData[0][col] !== null) {
                                    if (pidx === 0) {
                                        this._tickLabelsTime.push(col);
                                        this._tickArray.push(counter);
                                    }
                                    dataYears.push(col);
                                    counter++;
                                }
                            }
                        }
                        dataYears.forEach((year: any, idx: number) => {
                            let yearData: any = {
                                year: year,
                                community: place.Name,
                                data: [],
                                data_moe: []
                            };
                            placeData.forEach((pdm: any) => {
                                if (this.indicator_info.ScriptName.indexOf('211') !== -1 || this.indicator_info.ScriptName === 'PovertyByRace' || this.indicator_info.ScriptName === 'NAICS_Farms') {
                                    yearData.data.push({
                                        name: pdm.Variable
                                            .replace('211info ', '')
                                            .replace(' Contacts Prop', '')
                                            .replace(' Providers Prop','')
                                            .replace(' Client Contacts', '')
                                            .replace(' Providers', '')
                                            .replace('Percentage of population group in poverty: ', ''),
                                        y: $.isNumeric(parseInt(pdm[year])) ? parseInt(pdm[year]) : null
                                    });
                                } else {
                                    yearData.data.push(parseInt(Number(pdm[year]).toPrecision()));
                                    if (year.indexOf('-') !== -1) {
                                        yearData.data_moe.push(parseFloat(pdm[year + '_MOE']));
                                    }
                                }
                                if (idx === 1) {
                                    categories.push(pdm['Variable'].replace('Percentage of population group in poverty: ', ''));
                                }
                            });
                            placeDataYears[year] = yearData;
                        });
                    } else {
                        console.log('no data for income or 211 chart');
                    }
                    console.log('process custom chart poverty', categories, placeDataYears);
                    place_data_years[place.Name] = {
                        id: place.Name,
                        name: place.Name,
                        geoid: place.ResID,
                        data: placeDataYears,
                        years: this._tickLabelsTime,
                        categories: categories
                    };
                    console.log('process custom chart poverty', place_data_years[place.Name]);
                    this.selectedCustomChartYear = dataYears[dataYears.length - 1];
                    this.customChartYears = dataYears;
                });
                break;
            default:
                place_data_years = {};
                break;
        }
        return place_data_years;
    }

    processDataYear(drilldown?:any) {
        this.yearStartOffset = this.getStartYear();
        this.yearEndOffset = this.getEndYear();
        let place_data = [{}];
        let place_data_years: any = {};
        let place_data_years_moe: any = {};
        let place_data_years_dd: any = {};
        let place_data_years_moe_dd: any = {};

        if (this.isCustomChart) {
            place_data_years = this.processCustomChartData(this.indicator.ScriptName);
            let chart_data: any = {
                place_data_years: place_data_years
            };
            this.dataStore.indicatorData[this.indicator].chart_data = chart_data;
            //console.log('pyramid', chart_data);
        } else {

            console.log('place_data check', this.placeTypeData, this.dataStore, this.dataStore[this.pluralize(this.selectedPlaceType)]);
            this.placeTypeData = this.getPlaceTypeData();
            let dd_data: any[] = drilldown ? this.dataStore.indicatorData[this.indicator].drilldown_data[drilldown.place][drilldown.subtopic] : [];

            let ptdToProcess:any = drilldown ? dd_data : this.placeTypeData;

                 //this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].crt_db;
            ptdToProcess.Data.forEach((pData: any) => {
                console.log('pData in the house', pData);
                if (!drilldown) {
                    //FOR MAP VIEW
                    let statewideFilter: any[] = ['Oregon', 'Statewide', 'Rural Oregon', 'Urban Oregon', 'California', 'Rural California', 'Urban California'];
                    if (statewideFilter.indexOf(this.isSchool ? pData.Name : pData.community) === -1) {
                        place_data.push({
                            name: this.isSchool ? pData.Name : pData.community, //this.getCommunityName(pData),// pData.community,
                            geoid: pData.geoid,
                            value: pData[this.selectedYear.Year] === -1 ? 0 : pData[this.selectedYear.Year],
                            year: this.selectedYear.Year,
                            id: this.isSchool ? pData.Name : pData.community,
                            selected: this.checkSelectedPlaceOnLoad(pData),
                            placeType: statewideFilter.indexOf(this.isSchool ? pData.Name : pData.community) === -1 ? this.translatePlaceTypes(this.selectedPlaceType) : 'Statewide'
                        });
                    }
                }

                let year_data: any[] = [];
                let year_data_moe: any[] = [];
                let year_data_dd: any[] = [];
                let year_data_moe_dd: any[] = [];

                var prevYear: string;

                this.placeTypeData.Years.forEach((year: any, y: number) => {
                    var _year = year.Year;
                    if (y >= this.yearStartOffset && y <= this.placeTypeData.Years.length - this.yearEndOffset) {
                        var yearsToAdd = 0;
                        if (prevYear) {
                            var firstYr = prevYear.split('-')[0];
                            var secondYr = _year.split('-')[0];
                            yearsToAdd = parseInt(secondYr) - parseInt(firstYr);
                        }
                        for (var x = 0; x < yearsToAdd - 1; x++) {//add in between values for chart display
                            if (!drilldown) {
                                year_data.push(null);
                                year_data_moe.push(null);
                            } else {
                                year_data_dd.push(null);
                                year_data_moe_dd.push(null);
                            }
                        }

                        //check to see if data for end offset
                        //this.yearEndOffset = $.isNumeric(pData[_year]) ? 0 : this.yearEndOffset + 1;
                        //year_data.push(this.formatData(pData[_year]));
                        //console.log('pdata',pData.community, pData[_year]);
                        if (pData[_year] === '//') {
                            console.log('data suppressed');
                            year_data.push('Data suppressed');
                        } else {
                            if (!drilldown) {
                                year_data.push($.isNumeric(pData[_year]) ? parseFloat(pData[_year]) : null);
                            } else {
                                year_data_dd.push($.isNumeric(pData[_year]) ? parseFloat(pData[_year]) : null);
                            }
                        }
                        if (_year.match('-')) {
                            if (!drilldown) {
                                year_data_moe.push([parseFloat(pData[_year]) - parseFloat(pData[_year + '_MOE']), parseFloat(pData[_year]) + parseFloat(pData[_year + '_MOE'])]);
                            } else {
                                year_data_moe_dd.push([parseFloat(pData[_year]) - parseFloat(pData[_year + '_MOE']), parseFloat(pData[_year]) + parseFloat(pData[_year + '_MOE'])]);
                            }
                        } else {
                            if (!drilldown) {
                                year_data_moe.push(null);
                            } else {
                                year_data_moe_dd.push(null);
                            }
                        }
                        prevYear = _year;
                    }
                });

                if (!drilldown) {
                    place_data_years[this.isSchool ? pData.Name : pData.community] = {
                        id: this.isSchool ? pData.Name : pData.community,
                        name: this.isSchool ? pData.Name : pData.community,
                        geoid: pData.geoid,
                        data: year_data,
                        drilldown: this.hasDrillDowns
                    };
                    place_data_years_moe[this.isSchool ? pData.Name : pData.community] = {
                        id: this.isSchool ? pData.Name : pData.community,
                        name: this.isSchool ? pData.Name : pData.community,
                        geoid: pData.geoid,
                        data: year_data_moe,
                        drilldown: this.hasDrillDowns
                    };
                } else {
                    place_data_years_dd[(this.isSchool ? pData.Name : pData.community)+ ': ' +pData.Variable] = {
                        id: (this.isSchool ? pData.Name : pData.community) + ': ' + pData.Variable,
                        name: (this.isSchool ? pData.Name : pData.community) + ': ' + pData.Variable,
                        geoid: pData.geoid,
                        data: year_data_dd//,
                        //drilldown: this.hasDrillDowns
                    };
                    place_data_years_moe_dd[(this.isSchool ? pData.Name : pData.community) + ': ' + pData.Variable ] = {
                        id: (this.isSchool ? pData.Name : pData.community) + ': ' + pData.Variable,
                        name: (this.isSchool ? pData.Name : pData.community) + ': ' + pData.Variable,
                        geoid: pData.geoid,
                        data: year_data_moe_dd//,
                        //drilldown: this.hasDrillDowns
                    };
                }

            });

            //for (var d = 0; d < ptdToProcess.Data.length; d++) {
            //        var pData: any = this.placeTypeData.Data[d];
            //        //FOR MAP VIEW
            //        let statewideFilter: any[] = ['Oregon', 'Statewide', 'Rural Oregon', 'Urban Oregon', 'California', 'Rural California', 'Urban California'];
            //        if (statewideFilter.indexOf(this.isSchool ? pData.Name : pData.community) === -1) {
            //            place_data.push({
            //                name: this.isSchool ? pData.Name : pData.community, //this.getCommunityName(pData),// pData.community,
            //                geoid: pData.geoid,
            //                value: pData[this.selectedYear.Year] === -1 ? 0 : pData[this.selectedYear.Year],
            //                year: this.selectedYear.Year,
            //                id: this.isSchool ? pData.Name : pData.community,
            //                selected: this.checkSelectedPlaceOnLoad(pData),
            //                placeType: statewideFilter.indexOf(this.isSchool ? pData.Name : pData.community) === -1 ? this.translatePlaceTypes(this.selectedPlaceType) : 'Statewide'
            //            });
            //        }
            //        let year_data: any[] = [];
            //        let year_data_moe: any[] = [];
            //        let year_data_dd: any[] = [];
            //        let year_data_moe_dd: any[] = [];

            //        var prevYear: string;
            //        for (var y = 0; y < this.placeTypeData.Years.length; y++) {
            //            var _year = this.placeTypeData.Years[y].Year;
            //            if (y >= this.yearStartOffset && y <= this.placeTypeData.Years.length - this.yearEndOffset) {
            //                var yearsToAdd = 0;
            //                if (prevYear) {
            //                    var firstYr = prevYear.split('-')[0];
            //                    var secondYr = _year.split('-')[0];
            //                    yearsToAdd = parseInt(secondYr) - parseInt(firstYr);
            //                }
            //                for (var x = 0; x < yearsToAdd - 1; x++) {//add in between values for chart display
            //                    year_data.push(null);
            //                    year_data_moe.push(null);
            //                }

            //                //check to see if data for end offset
            //                //this.yearEndOffset = $.isNumeric(pData[_year]) ? 0 : this.yearEndOffset + 1;
            //                //year_data.push(this.formatData(pData[_year]));
            //                //console.log('pdata',pData.community, pData[_year]);
            //                if (pData[_year] === '//') {
            //                    console.log('data suppressed');
            //                    year_data.push('Data suppressed');
            //                } else {
            //                    year_data.push($.isNumeric(pData[_year]) ? parseFloat(pData[_year]) : null);
            //                }
            //                if (_year.match('-')) {
            //                    year_data_moe.push([parseFloat(pData[_year]) - parseFloat(pData[_year + '_MOE']), parseFloat(pData[_year]) + parseFloat(pData[_year + '_MOE'])]);
            //                } else {
            //                    year_data_moe.push(null);
            //                }
            //                prevYear = _year;
            //            }
            //        }
            //        place_data_years[this.isSchool ? pData.Name : pData.community] = {
            //            id: this.isSchool ? pData.Name : pData.community,
            //            name: this.isSchool ? pData.Name : pData.community,
            //            geoid: pData.geoid,
            //            data: year_data,
            //            drilldown: this.hasDrillDowns
            //        };
            //        place_data_years_moe[this.isSchool ? pData.Name : pData.community] = {
            //            id: this.isSchool ? pData.Name : pData.community,
            //            name: this.isSchool ? pData.Name : pData.community,
            //            geoid: pData.geoid,
            //            data: year_data_moe,
            //            drilldown: this.hasDrillDowns
            //        };
            //        //console.log('place_data', place_data_years);
            //    }


            let chart_data: any = {
                place_data: place_data,
                place_data_years: place_data_years,
                place_data_years_moe: place_data_years_moe
            };
            let chart_dd_data: any = {
                place_data_years_dd: place_data_years_dd,
                place_data_years_moe_dd: place_data_years_moe_dd
            }
            if (this.tileType === 'map' && this.showMap) {
                this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].chart_data = chart_data;
            } else {
                if (!drilldown) {
                    this.dataStore.indicatorData[this.indicator].chart_data = chart_data;
                } else {
                    if (!this.dataStore.indicatorData[this.indicator].chart_dd_data) {
                        this.dataStore.indicatorData[this.indicator].chart_dd_data = {};
                    }
                    this.dataStore.indicatorData[this.indicator].chart_dd_data = chart_dd_data;
                }
            }
            console.log('funions', this.dataStore);
            //console.log(this.dataStore);
            //add a dataset for no data MAP DISPLAY ONLY
            if (this.tileType === 'map' && this.showMap) {
                for (var x = 0; x < this.selectedMapData.features.length; x++) {
                    var mData: any = this.selectedMapData.features[x];
                    var lookupResult = this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].chart_data.place_data.filter((place: any) => {
                        return place.geoid === mData.properties.GEOID && place.value === null;
                    });
                    if (lookupResult.length === 1) {
                        this.county_map_no_data.push(mData);
                        //add to place_data for empty results.
                        this.county_no_data.push({
                            geoid: mData.properties.GEOID,
                            id: mData.properties.GEOID,
                            name: mData.properties.NAME,
                            value: 0,
                            year: this.selectedYear.Year
                        });
                    }
                }
            }
        }
    }

    processYearTicks() {
        var counter = 0;// this.yearStartOffset;
        var counterTime = 0;// this.yearStartOffset;
        //var overallCounter = 0;
        var prevYear: any;
        var labelEveryYear = this.placeTypeData.Years.length - (this.yearStartOffset + this.yearEndOffset) > 10 ? false : this.isHandheld && this.placeTypeData.Years.length - (this.yearStartOffset + this.yearEndOffset) > 5 ? false : true;
        var labelEveryThirdYear = this.placeTypeData.Years.length - (this.yearStartOffset + this.yearEndOffset) > 20 ? true : false;
        var labelYear = true;
        var labelThirdYear = true;
        var labelYearCounter = 1;
        console.log('yearStartOffset', this.yearEndOffset, this.placeTypeData.Years);
        this._tickArray = [];
        this._tickLabels = [];
        this._tickLabelsTime = [];
        for (var y = 0; y < this.placeTypeData.Years.length; y++) {
            var yearsToAdd = 0;
            var Year = this.placeTypeData.Years[y].Year;
            if (prevYear) {
                var firstYr = prevYear.split('-')[0];
                var secondYr = Year.split('-')[0];
                yearsToAdd = parseInt(secondYr) - parseInt(firstYr);
            }
            for (var x = 1; x < yearsToAdd; x++) {//add in between values for chart display
                if (y > this.yearStartOffset && y <= this.placeTypeData.Years.length - (this.yearEndOffset + 1)) {
                    //console.log('adding year', (parseInt(prevYear.split('-')[0]) + x).toString(), 'y is:', y, 'and placedata is:', this.placeTypeData.Years.length - (this.yearEndOffset + 1) );
                    this._tickLabels[counter] = (parseInt(prevYear.split('-')[0]) + x).toString();
                    this._tickArray.push(counter);
                    counter++;
                }
                //overallCounter++;
            }
            if (y >= this.yearStartOffset && y <= this.placeTypeData.Years.length - (this.yearEndOffset + 1)) {
                //console.log('adding year2', Year, 'y is:', y, 'and placedata is:', this.placeTypeData.Years.length - (this.yearEndOffset + 1));
                this._tickLabels[counter] = Year;
                this._tickArray.push(counter);
                this._tickLabelsTime[counterTime] = labelEveryThirdYear ? (labelYearCounter === 3 || counter === 0 ? Year : ' ') : (labelEveryYear ? Year : (labelYear ? Year : ' '));
                if (Year.match('-') && !this.isSchool) {
                    this.hasMOEs = true;
                }

                labelYearCounter = (labelThirdYear && labelYearCounter === 3) ? 1 : labelYearCounter + 1;
                this.selectedYearIndexArray[Year] = counter;// overallCounter;
                counter++;
                counterTime++;
            }

            //overallCounter++;
            prevYear = Year;
            labelYear = !labelYear;
            //this._tickArrayTime.push(labelEveryThirdYear ? (labelYearCounter === 3 || counter === 0 ? counterTime : '') : (labelEveryYear ? counterTime : (labelYear ? counterTime : '')));

        }
        console.log('labelyear', this._tickArray, this._tickLabels, this.selectedYearIndexArray);
    }

    //getDefaultYear() {
    //    //start at the end and move back until you find data
    //    //console.log('looking for year data');
    //    let counter = 0;
    //    for (var y = this.placeTypeData.Years.length - 1; y > 0; y--) {
    //        counter++;
    //        let hasData = false;
    //        for (var d = 0; d < this.placeTypeData.Data.length; d++) {
    //            //console.log(this.placeTypeData.Data[d][this.placeTypeData.Years[y].Year]);
    //            if (this.placeTypeData.Data[d][this.placeTypeData.Years[y].Year] !== null) {
    //                hasData = true;
    //                break;
    //            }
    //        }
    //        if (hasData) {
    //            break;
    //        }
    //    }
    //    return counter;
    //}

    getStartYear() {
        //start at the beggining and move forward until you find data
        //console.log('looking for year data');
        let counter = 0;
        for (var y = 0; y < this.placeTypeData.Years.length; y++) {
            let hasData = false;
            for (var d = 0; d < this.placeTypeData.Data.length; d++) {
                //$.isNumeric(pData[_year])
                console.log(this.placeTypeData.Data[d][this.placeTypeData.Years[y].Year]);
                if (this.placeTypeData.Data[d][this.placeTypeData.Years[y].Year] !== null) {
                    hasData = true;
                    break;
                }
            }
            if (hasData) {
                break;
            } else {
                counter++;
            }
        }
        return counter;
    }

    getEndYear() {
        //start at the end and move back until you find data
        //console.log('looking for year data');
        let counter = 0;
        for (var y = this.placeTypeData.Years.length - 1; y > 0; y--) {
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
            } else {
                counter++;
            }
        }
        return counter;
    }

    getMinData(isMap: boolean, chartType?: boolean) {
        if (isMap && this.indicator_info['Dashboard_Chart_Y_Axis_Min'] !== null) {
            return parseFloat(this.indicator_info['Dashboard_Chart_Y_Axis_Min']);
        } else {
            var min: any;
            var notLogrithmic = false;
            var hasNegativevalues = false;
            console.log('checking chart_data', this.selectedPlaceType, this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].chart_data, this.dataStore);
            let chart_data = this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].chart_data;
            //need to combine data with moes to get proper min/ max
            var pdy = $.extend(true, {}, isMap ? chart_data.place_data_years : this.hasMOEs ? chart_data.place_data_years_moe : chart_data.place_data_years);
            $.each(pdy, function () {
                //removes statewide data
                if (this.geoid.length > 3) {
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
                    hasNegativevalues = min < 0 ? true : hasNegativevalues;
                }
            });
            console.log('mindata', min, notLogrithmic, notLogrithmic ? 0 : min < 10 ? 0 : min);
            console.log('mindata2', this.getMaxData(true) / min);
            return notLogrithmic && !hasNegativevalues ? 0
                : this.getMaxData(true) / min < 400 && !hasNegativevalues
                    ? 0
                    : min;
        }
    }

    getMaxData(isMap: boolean) {
        //check if set by database else calculate dynamically
        //console.log('yaxismax', this.indicator_info['y-Axis_Max'], this.indicator_info);
        if (this.indicator_info['Dashboard_Chart_Y_Axis_Max'] !== null) {
            return parseFloat(this.indicator_info['Dashboard_Chart_Y_Axis_Max']);
        } else {
            var max: any = 0;
            let chart_data = this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].chart_data;
            var pdy = $.extend(true, {}, isMap ? chart_data.place_data_years : this.hasMOEs ? chart_data.place_data_years_moe : chart_data.place_data_years);
            $.each(pdy, function () {
                //removes statewide data
                if (this.geoid.length > 3) {
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
            console.log('yaxismax', max);
            return max;
        }
    }

    formatData(val: any) {
        console.log('formattingdata', val);
        if (val === null) {
            return null;
        }
        if (val.match(/^[-+]?[1-9]\.[0-9]+e[-]?[1-9][0-9]*$/)) {
            let precision = this.getPrecision(val);
            val = parseFloat((+val).toFixed(precision));
        }
        if ($.isNumeric(val)) {
            console.log('data is numeric');
            // Handle exponential numbers.
            return parseFloat(val);
        } else {
            console.log('data is not numeric!', val);
            return null;
        }
    }

    getPrecision(sval: any) {
        var arr = new Array();
        // Get the exponent after 'e', make it absolute.
        arr = sval.split('e');
        //var exponent = Math.abs(arr[1]);

        // Add to it the number of digits between the '.' and the 'e'
        // to give our required precision.
        //var precision = new Number(exponent);
        arr = arr[0].split('.');
        var precision = arr[1].length;

        return parseInt(precision);
    }

    formatValue(val: any, isLegend: boolean) {
        if (val === '//' || (!$.isNumeric(val) && this.placeTypeData.Metadata[0].Variable_Represent.trim() !== 'Text')) {
            return '// Data suppressed';
        } else {
            var returnVal = val;
            if (this.placeTypeData.Metadata[0].Variable_Represent !== null) {
                //console.log('stump', val, this.placeTypeData.Metadata[0].Variable_Represent.trim());
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
                        returnVal = '$' + (isLegend ? this.formatAbvNumbers(val, isLegend, 0) : this.addCommas((Math.round(parseFloat(val)).toString())));
                        //returnVal = '$' + this.formatAbvNumbers(val, isLegend, 0);
                        break;
                    case '$Thousand':
                        returnVal = '$' + this.formatAbvNumbers((val * 1000), isLegend, 2);
                        break;
                    case '$Millions':
                        returnVal = '$' + (isLegend ? this.formatAbvNumbers(val, isLegend, 0) : this.addCommas((Math.round(parseFloat(val)).toString())) + 'mil');
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
            }
            return returnVal;
        }
    }

    formatAbvNumbers(val: any, isLegend: boolean, numDecimals: number) {
        return (val > 999999999 ? (this.addCommas((val / 1000000000).toFixed(isLegend ? (val / 1000000000) < 10 ? 1 : 0 : numDecimals)) + 'bn') : val > 999999 ? (this.addCommas((val / 1000000).toFixed(isLegend ? (val / 1000000) < 10 ? 1 : 0 : numDecimals)) + 'mil') : val > 999 ? (this.addCommas((val / 1000).toFixed(isLegend ? (val / 1000) < 10 ? 1 : 0 : numDecimals)) + 'k') : val);
    }

    pluralize(value: string) {
        switch (value) {
            case 'County':
            case '':
                return 'Counties';
            case 'Tract':
            case 'Census Tract':
            case 'Unincorporated Place':
                return 'Tracts';
            case 'Incorpor':
            case 'Incorporated City':
            case 'Place':
            case 'Towns':
            case 'Census Designated Place':
                return 'Places';
            case 'School':
                return 'Schools';
            case 'School Districts':
                return 'SchoolDistricts';
            case 'State':
                return 'Boundary';
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
        if (window.location.href.indexOf('indicator=') === -1) {
            window['detailBackUrl'] = window.location.href;
        }
        console.log('gotodetails', this.placeNames, window.location.href);
        if (this.placeNames === '' && window.location.href.indexOf('places') !== -1) {
            this.placeNames = window.location.href.split('places=')[1].split(';')[0];
        }
        this._router.navigate(['Explore', {
            indicator: encodeURI(this.indicator
                .replace(/\(/g, '%28')
                .replace(/\)/g, '%29'))
                .replace('%252E', '%2E')
                .replace('%2528', '%28')
                .replace('%2529', '%29')
                .replace(/\+/g, '%2B')
                .replace(/\&/g, '%26')
            //.replace(/\=/g, '%3D')
            , places: this.placeNames
        }]);
        window.scrollTo(0, 0);
    }

    onTimeSliderChange(evt: any) {
        //console.log('well hot digity dog');
    }

    onSelectedMapViewChange(evt: any) {
        if (this.selectedPlaceType !== this.translatePlaceTypes(evt)) {
            this.selectedPlaceType = this.translatePlaceTypes(evt);
            if (this.mapChart) {
                this.mapChart.showLoading();
            }
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


    openMoeDialog() {
        $('#moe-dialog').dialog('open');
    }

    ngOnInit() {
        //console.log('Leave this so it does not squawk on build', this.defaultAdvChartOptions);
        this.defaultAdvChartOptions = this.defaultAdvChartOptions;
        //this.defaultChartOptions.title = {
        //    text: this.indicator ? this.indicator : null,
        //    align: this.viewType === 'basic' ? 'left' : null
        //};

        this.defaultChartOptions.chart.spacingTop = this.viewType === 'advanced' ? 50 : this.defaultChartOptions.chart.spacingTop;
        if (this.tileType === 'map' && this.showMap) {
            for (var pt in this.dataStore) {
                //console.log('place type in data store', pt, this.dataStore);
                this.dataStore[pt].indicatorData = {};
                this.dataStore[pt].mapData = {};
            }
        }

        $('#moe-dialog').dialog({
            autoOpen: false,
            show: {
                effect: 'blind',
                duration: 500
            },
            hide: {
                effect: 'blind',
                duration: 500
            }
        });
    }

    ngOnChanges(changes: any) {
        console.log('datatile changed', changes);
        if (changes._selectedYear && this.tileType === 'graph' && this.chart) {
            this.chart.xAxis[0].removePlotLine('plot-line-1');
            this.chart.xAxis[0].addPlotLine({
                value: changes._selectedYear.currentValue.index,
                color: 'gray',
                dashStyle: 'longdashdot',
                width: 2,
                id: 'plot-line-1'
            });
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


