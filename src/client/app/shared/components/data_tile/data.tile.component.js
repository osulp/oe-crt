var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var router_1 = require('@angular/router');
var angular2_highcharts_1 = require('angular2-highcharts');
var Highchmap = require('highcharts/modules/map');
var HighchartsMore = require('highcharts/highcharts-more');
var hmap_menu_component_1 = require('./hmap-menu/hmap.menu.component');
var index_1 = require('../../services/index');
var index_2 = require('../../pipes/index');
angular2_highcharts_1.Highcharts.setOptions({
    colors: ['#058DC7', '#50B432', '#ED561B', '#24CBE5', '#64E572', '#FF9655', '#6AF9C4', '#705c3b', '#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#FFF263',
        '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1']
});
Highchmap(angular2_highcharts_1.Highcharts);
HighchartsMore(angular2_highcharts_1.Highcharts);
var DataTileComponent = (function () {
    function DataTileComponent(elementRef, _dataService, _selectedPlacesService, _router, _geoStore, _geoService, _selectedDataService, _placeTypesService, _indicatorDescService) {
        this._dataService = _dataService;
        this._selectedPlacesService = _selectedPlacesService;
        this._router = _router;
        this._geoStore = _geoStore;
        this._geoService = _geoService;
        this._selectedDataService = _selectedDataService;
        this._placeTypesService = _placeTypesService;
        this._indicatorDescService = _indicatorDescService;
        this.onChartDataUpdate = new core_1.EventEmitter();
        this.onSelectedYearChange = new core_1.EventEmitter();
        this.geoJSONStore = [];
        this.places = new Array();
        this.placeNames = '';
        this.placeTypes = [];
        this.selectedPlaceType = 'County';
        this.selectedYearIndexArray = {};
        this._tickArray = [];
        this._tickLabels = [];
        this._tickLabelsTime = [];
        this.hasDrillDowns = false;
        this.showMOES = true;
        this.county_no_data = [];
        this.county_map_no_data = [];
        this.animationCounter = -1;
        this.sliderState = 'play';
        this.isHandheld = $(window).width() < 481;
        this.showSlider = true;
        this.isSliderInit = false;
        this.isCountyLevel = false;
        this.isStatewide = false;
        this.isSchool = false;
        this.isNotCombinable = false;
        this.hasCombined = false;
        this.isTOP = false;
        this.is10yr = false;
        this.collections = [];
        this.indicator_collections = [];
        this.indicator_geo = 'County';
        this.yearStartOffset = 0;
        this.yearEndOffset = 0;
        this.showMap = true;
        this.customChartYears = [];
        this.isCustomChart = false;
        this.xAxisCategories = {};
        this.defaultChartOptions = {
            chart: {
                type: 'line',
                spacingTop: 15,
                zoomType: 'x',
                resetZoomButton: {
                    position: {
                        align: 'left',
                        x: 0,
                        y: -10
                    },
                    theme: {
                        fill: 'white',
                        stroke: 'silver',
                        r: 0,
                        states: {
                            hover: {
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
                        legendItemClick: function (event) {
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
        this.defaultAdvChartOptions = {
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
                        align: 'left',
                        x: 0,
                        y: -10
                    },
                    theme: {
                        fill: 'white',
                        stroke: 'silver',
                        r: 0,
                        states: {
                            hover: {
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
                        legendItemClick: function (event) {
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
        this.mapChartZoomSettings = {};
        this.selectedMapPoints = [];
        this.elementRef = elementRef;
        this.tempPlaces = new Array();
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
            colorAxis: {},
            xAxis: {},
            yAxis: {},
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
            SchoolDistricts: {},
            Boundary: {}
        };
    }
    DataTileComponent.prototype.saveInstance = function (chartInstance) {
        var _this = this;
        console.log('saving chart instance', this.indicator);
        if (this.tileType === 'graph') {
            this.chart = chartInstance;
            this.chart.showLoading();
        }
        else {
            this.mapChart = chartInstance;
            this.mapChart.showLoading();
        }
        this.checkScreenSize();
        this._indicatorDescService.getIndicator(this.indicator.replace(/\+/g, '%2B').replace(/\&/g, '%26').replace(/\=/g, '%3D')).subscribe(function (indicatorDesc) {
            _this.indicator_info = indicatorDesc.Desc[0];
            if (_this.indicator_info) {
                _this.isStatewide = _this.indicator_info.Geog_ID === 8 ? true : false;
                _this.indicator_geo = _this.indicator_info.indicator_geo;
                _this.isCountyLevel = _this.indicator_info.CountyLevel || _this.indicator_geo === 'County';
                _this.isTOP = _this.indicator_info.isTOP;
                _this.is10yr = _this.indicator_info.is10yrPlan;
                _this.isSchool = _this.indicator_geo.indexOf('School') !== -1;
                _this.isCustomChart = _this.indicator_info.ScriptName !== null && !_this.isSchool;
                _this.showMap = _this.isStatewide || _this.isCustomChart ? false : true;
                if (_this.hMapMenu) {
                    _this.hMapMenu.setIndicatorGeoFilter(_this.indicator_geo);
                }
                _this.indicator_collections = _this.indicator_info.collections ? _this.indicator_info.collections.split(', ') : [];
                if (_this.indicator_info.Represented_ID === 10 && _this.tileType === 'graph' && _this.viewType === 'basic') {
                    _this.chart.showLoading('Chart not available. See map and table view');
                    _this.chart.setTitle({
                        text: _this.viewType === 'basic' || _this.isHandheld ? _this.indicator.replace('<br>', ' ') : null,
                        align: _this.viewType === 'basic' ? 'left' : _this.isHandheld ? 'center' : null,
                        style: {
                            fontSize: '1.25em',
                            fontWeight: '200'
                        },
                    });
                    try {
                        _this.chart.legend.update(_this.setLegendOptions(false));
                    }
                    catch (ex) {
                        console.log('failed', ex);
                    }
                }
                else {
                    _this.subscription = _this._selectedPlacesService.selectionChanged$.subscribe(function (data) {
                        console.log('selected places subscribe throwing event', data);
                        _this.onPlacesChanged(data);
                    }, function (err) { return console.error(err); }, function () { return console.log('done with subscribe event places selected'); });
                    if (_this.tileType === 'map' && _this.showMap) {
                        _this.geoSubscription = _this._geoStore.selectionChanged$.subscribe(function (data) {
                            _this.geoJSONStore = data;
                            console.log('new geojson file loaded', data);
                        }, function (err) { return console.error(err); }, function () { return console.log('done loading geojson'); });
                    }
                    _this.dataSubscription = _this._selectedDataService.selectionChanged$.subscribe(function (data) {
                        _this.AllData = data;
                        _this.onSelectedDataChanged(data);
                    }, function (err) { return console.error(err); }, function () { return console.log('done with subscribe event places selected'); });
                    if (_this.featured) {
                        console.log('featured chart', _this.featured);
                        _this.checkDataStateForCharts();
                    }
                }
            }
        }, function (err) { return console.log('error getting indicator description', err); }, function () { return console.log('loaded the indicator description in data tile'); });
        var chartScope = this;
        angular2_highcharts_1.Highcharts.wrap(angular2_highcharts_1.Highcharts.Point.prototype, 'select', function (proceed) {
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));
            console.log('selecting via map', proceed, this, chartScope);
            if (chartScope.tileType === 'map' && chartScope.showMap) {
                var points = chartScope.mapChart.getSelectedPoints();
                chartScope.selectedMapPoints = points;
                var pointsAsPlacesForBin = [];
                for (var p = 0; p < points.length; p++) {
                    var place = points[p];
                    var binPlace = void 0;
                    var isInBin = false;
                    for (var b = 0; b < chartScope.places.length; b++) {
                        console.log('map point', points[p]);
                        console.log('place bin', chartScope.places[b]);
                        if (chartScope.isSchool) {
                            if (chartScope.places[b].GeoInfo) {
                                chartScope.places[b].GeoInfo.forEach(function (gi) {
                                    isInBin = gi.School_District.indexOf(points[p].community) !== -1 ? true : isInBin;
                                });
                            }
                        }
                        else {
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
                }
                pointsAsPlacesForBin = pointsAsPlacesForBin.filter(function (place, index, self) { return self.findIndex(function (t) { return t.ResID === place.ResID && t.Name === place.Name; }) === index; });
                console.log('queue adding from map', chartScope.tileType, pointsAsPlacesForBin, chartScope.selectedPlaceType);
                console.log('queue here are the places from map click', chartScope.places, points);
                chartScope._selectedPlacesService.setAllbyPlaceType(pointsAsPlacesForBin, chartScope.selectedPlaceType, chartScope.indicator_geo);
            }
        });
    };
    DataTileComponent.prototype.onPlacesChanged = function (selectedPlaces) {
        var _this = this;
        console.log('adding DataTile place change', selectedPlaces, this.tempPlaces);
        this.places = selectedPlaces;
        this.placeNames = '';
        var checkDataState = false;
        if (this.tempPlaces.length !== this.places.length) {
            checkDataState = true;
            for (var x = 0; x < this.places.length; x++) {
                if (this.tempPlaces.indexOf(this.places[x]) === -1 && this.getGeoIndicator(this.places[x])) {
                    this.selectedPlaceType = this.isCountyLevel ? 'Counties' : this.translatePlaceTypes(this.places[x].TypeCategory);
                    this.selectedPlaceType = this.isSchool ? 'SchoolDistricts' : this.selectedPlaceType;
                    this.selectedPlaceCustomChart = this.places[x];
                }
                this.tempPlaces.push(this.places[x]);
                this.placeNames += encodeURIComponent(JSON.stringify(this.places[x]));
                this.placeNames += (x < this.places.length - 1) ? ',' : '';
            }
        }
        else {
            var hasSamePlaces = true;
            this.places.forEach(function (place) {
                var tPlace = _this.tempPlaces.filter(function (tp) { return tp.Name === place.Name; });
                console.log('place length the same', tPlace);
                if (tPlace.length === 0 || place.Combined) {
                    hasSamePlaces = false;
                }
                checkDataState = !hasSamePlaces;
            });
        }
        if (checkDataState) {
            if (this.getGeoIndicator({ TypeCategory: this.selectedPlaceType })) {
                console.log('thinks it needs to update');
                this.checkDataStateForCharts();
                if (this.tileType === 'graph') {
                    if (this.chart) {
                        this.chart.showLoading();
                    }
                }
                else {
                    if (this.mapChart) {
                        this.mapChart.showLoading();
                    }
                }
            }
        }
        this.tempPlaces = this.places;
    };
    DataTileComponent.prototype.checkDataStateForCharts = function (source) {
        var _this = this;
        console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbb', this.indicator_info);
        var loadingGeoJSON = this.tileType === 'map' && this.showMap ? this.checkLoadGeoJSON() : false;
        console.log('lodaindGeoJSON', loadingGeoJSON, this.tileType);
        if (this.tileType === 'graph') {
            this.getPlaceTypes('graph');
        }
        var loadMoreData = this.tileType === 'graph' ? true : this.checkUpdateData();
        console.log('loadMoreData', loadMoreData, this.tileType);
        if (!loadingGeoJSON && loadMoreData) {
            console.log('need to load data.  chart type: ', this.tileType);
            if (window.location.href.indexOf('indicator=') !== -1) {
                if (decodeURI(window.location.href)
                    .replace(/\%28/g, '(')
                    .replace(/\%29/g, ')')
                    .replace(/\%2C/g, ',')
                    .replace(/\%24/g, '$')
                    .replace(/\%2B/g, '+')
                    .replace(/\%3D/g, '=')
                    .replace(/\%3D/g, '=')
                    .indexOf(this.indicator) !== -1) {
                    console.log('yes siree');
                    this.getData();
                }
                else if (this.related) {
                    this.getData();
                }
            }
            else {
                this.getData();
            }
        }
        else if (!loadingGeoJSON) {
            console.log('NEED TO UPDATE MAP/CHART', this.tileType);
            if (this.tileType === 'map' && this.showMap) {
                var selectedPlaces = this.mapChart.getSelectedPoints();
                selectedPlaces.forEach(function (selPt, idx) {
                    var inSelectedPlaces = false;
                    _this.places.forEach(function (place) {
                        inSelectedPlaces = place.Name.replace(' County', '') === selPt.id.replace(' County', '') && place.ResID === selPt.geoid ? true : inSelectedPlaces;
                        console.log('inselectedplaces', inSelectedPlaces, place, selectedPlaces);
                        if (!inSelectedPlaces && place.TypeCategory !== 'Counties') {
                            if (place.GeoInfo.length > 0) {
                                place.GeoInfo.forEach(function (gi) {
                                    inSelectedPlaces = gi.geoid === selPt.geoid ? true : inSelectedPlaces;
                                });
                            }
                        }
                    });
                    if (!inSelectedPlaces) {
                        console.log('deselecting');
                        var ptIndex_1;
                        _this.mapChart.series[_this.mapChart.series.length - 1].data.forEach(function (d, idx) {
                            ptIndex_1 = d.id === selPt.id ? idx : ptIndex_1;
                        });
                        _this.mapChart.series[_this.mapChart.series.length - 1].data[ptIndex_1].update({ selected: false });
                    }
                });
                if (this.places.length !== this.mapChart.getSelectedPoints().length) {
                    console.log('Place length is different', this.places, this.mapChart.getSelectedPoints());
                    for (var p = 0; p < this.places.length; p++) {
                        var place = this.places[p];
                        var isSelected = false;
                        for (var _i = 0, _a = this.mapChart.getSelectedPoints(); _i < _a.length; _i++) {
                            var sp = _a[_i];
                            isSelected = place.ResID === sp.geoid ? true : isSelected;
                        }
                        console.log('is selected', isSelected);
                        if (!isSelected && place.TypeCategory !== 'State') {
                            var ptIndex;
                            var mapSeries = this.mapChart.series.length - 1;
                            for (var pt = 0; pt < this.mapChart.series[mapSeries].data.length; pt++) {
                                if (this.mapChart.series[mapSeries].data[pt].geoid === place.ResID) {
                                    ptIndex = pt;
                                    break;
                                }
                                if (this.isCountyLevel && place.Desc ? place.Desc.split(', ').length > 1 : false) {
                                    if (this.mapChart.series[mapSeries].data[pt].id) {
                                        if (place.Desc.split(', ')[1].replace(' County', '') === this.mapChart.series[mapSeries].data[pt].id.replace(' County', '')) {
                                            ptIndex = pt;
                                            break;
                                        }
                                    }
                                }
                                if (place.GeoInfo.length > 0 && ['Counties', 'SchoolDistricts'].indexOf(this.selectedPlaceType) !== -1 && this.indicator_geo.indexOf('Place') === -1) {
                                    console.log('looking up geopolis', this.mapChart.series);
                                    place.GeoInfo.forEach(function (gi) {
                                        ptIndex = _this.selectedPlaceType === 'Counties'
                                            ? (_this.mapChart.series[mapSeries].data[pt].id ? gi.County === _this.mapChart.series[mapSeries].data[pt].id.replace(' County', '')
                                                ? pt : ptIndex : ptIndex)
                                            : gi.School_District === _this.mapChart.series[mapSeries].data[pt].id
                                                ? pt : ptIndex;
                                    });
                                }
                            }
                            console.log('ptIndex', ptIndex);
                            if (ptIndex !== undefined) {
                                console.log('selecting!!!!!!!!!!!!!!!!!!!!1', this.mapChart.series[mapSeries].data[ptIndex]);
                                this.mapChart.series[mapSeries].data[ptIndex].update({ selected: true });
                            }
                        }
                    }
                }
                this.initMapChart();
                if (source) {
                }
            }
            else if (this.tileType === 'graph') {
                this.createGraphChart();
            }
        }
    };
    DataTileComponent.prototype.getPlaceTypes = function (source) {
        var geoJSON_to_load = [];
        for (var x = 0; x < this.places.length; x++) {
            var placeTypeLoaded = this.geoJSONStore.indexOf(this.translatePlaceTypes(this.places[x].TypeCategory)) !== -1 || this.places[x].TypeCategory === 'State' ? true : false;
            if (!placeTypeLoaded && ((this.isCountyLevel && this.places[x].TypeCategory === 'County') || !this.isCountyLevel)) {
                var isGeoIndicator = this.getGeoIndicator(this.places[x]);
                if (isGeoIndicator) {
                    geoJSON_to_load.push(this.translatePlaceTypes(this.places[x].TypeCategory));
                    this.placeTypes.push(source ? this.translatePlaceTypes(this.places[x].TypeCategory) : this.places[x].TypeCategory);
                }
            }
        }
        return geoJSON_to_load;
    };
    DataTileComponent.prototype.getGeoIndicator = function (place) {
        var isIndGoe = place.TypeCategory === 'State' ? true : false;
        if (place.TypeCategory !== 'State') {
            var tPlaceType = this.translatePlaceTypes(place.TypeCategory);
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
    };
    DataTileComponent.prototype.checkLoadGeoJSON = function () {
        var _this = this;
        var loadingGeoJSON = false;
        var geoJSON_to_load = this.getPlaceTypes();
        var selPTCheck = geoJSON_to_load.filter(function (layer) { return _this.translatePlaceTypes(layer) === _this.translatePlaceTypes(_this.selectedPlaceType); });
        if (selPTCheck.length === 0) {
            console.log('Selected place type not in the geoJSON to load queue based on selected places');
            console.log(this.selectedPlaceType);
            console.log(geoJSON_to_load);
            var geoCheck = this.geoJSONStore.filter(function (geo) { return geo.layerId === _this.selectedPlaceType; });
            console.log(geoCheck);
            if (geoCheck.length === 0) {
                geoJSON_to_load.push(this.selectedPlaceType);
            }
        }
        var bndryChk = geoJSON_to_load.filter(function (layer) { return _this.translatePlaceTypes(layer) === 'Places'; });
        if (bndryChk.length > 0) {
            geoJSON_to_load.push('oregon_siskiyou_boundary');
        }
        if (geoJSON_to_load.length > 0) {
            geoJSON_to_load = $.unique(geoJSON_to_load);
            var geoJSON_to_load_filtered = geoJSON_to_load.filter(function (gtl) {
                return _this.geoJSONStore.filter(function (geo) {
                    return geo.layerId === gtl || (geo.layerId === 'Boundary' && gtl === 'oregon_siskiyou_boundary');
                }).length === 0;
            });
            console.log('filtered gtl', geoJSON_to_load_filtered);
            if (geoJSON_to_load_filtered.length > 0) {
                console.log('geojson to load', geoJSON_to_load_filtered);
                if (this.placeTypeGeoYears === undefined) {
                    this._placeTypesService.get().subscribe(function (data) {
                        _this.placeTypeGeoYears = data;
                        _this.getGeoJSON(geoJSON_to_load_filtered);
                    });
                }
                else {
                    this.getGeoJSON(geoJSON_to_load_filtered);
                }
                loadingGeoJSON = true;
            }
        }
        return loadingGeoJSON;
    };
    DataTileComponent.prototype.getGeoJSON = function (placeTypeToLoad) {
        var _this = this;
        console.log('spew', placeTypeToLoad, this.placeTypeGeoYears);
        for (var _i = 0; _i < placeTypeToLoad.length; _i++) {
            var pt = placeTypeToLoad[_i];
            this._geoService.getByPlaceType(this.translatePlaceTypes(pt), this.placeTypeGeoYears).subscribe(function (data) {
                console.log('got response from NEWWWWWWWWWWWWWWWWWWWWWWW geoservice', _this.translatePlaceTypes(pt), pt);
                console.log(data);
                if (data.length > 0) {
                    var mapData = { layerId: data[0].layerType, features: data };
                    _this._geoStore.add(mapData);
                    _this.updateDataStore(mapData, 'mapData');
                    console.log('got geojson, updated data store and checking place type to get indicator data');
                    console.log(_this.selectedPlaceType, data);
                    if (data[0].layerType !== 'State' && data[0].layerType !== 'Boundary') {
                        _this.getData();
                    }
                }
            });
        }
    };
    DataTileComponent.prototype.getData = function () {
        var _this = this;
        var geoids = '';
        var geonames = '';
        var schooldistricts = '';
        var counties = '';
        var cts = '';
        this.places.forEach(function (place, idx) {
            geoids += place.ResID + (idx !== _this.places.length - 1 ? ',' : '');
            geonames += place.Name + (idx !== _this.places.length - 1 ? ',' : '');
            if (place.TypeCategory === 'SchoolDistricts') {
                schooldistricts += place.Name + (idx !== _this.places.length - 1 ? ',' : '');
            }
            else {
                place.GeoInfo.forEach(function (ginfo, gidx) {
                    console.log('ginfo2', ginfo);
                    schooldistricts += (schooldistricts.indexOf(ginfo.School_District) === -1 && ginfo.School_District !== null ?
                        ginfo.School_District :
                        '') + (idx !== _this.places.length - 1 || (idx === _this.places.length && gidx !== place.GeoInfo.length - 1) ?
                        ',' :
                        '');
                    cts += (['Tracts', 'Census Tracts', 'Unincorporated Place'].indexOf(place.TypeCategory) !== -1 ?
                        (ginfo.geoid +
                            (idx !== _this.places.length - 1 || (idx === _this.places.length && gidx !== place.GeoInfo.length - 1) ?
                                ',' :
                                '')) :
                        '');
                    counties += _this.isCountyLevel ? ginfo.county_geoid + (idx !== _this.places.length - 1 || (idx === _this.places.length && gidx !== place.GeoInfo.length - 1) ?
                        ',' :
                        '') : '';
                    geoids += _this.isCountyLevel ? ((geoids.lastIndexOf(',') !== geoids.length - 1 ? ',' : '') + (ginfo.county_geoid + ',')) : '';
                });
            }
            counties += (place.TypeCategory === 'Counties' ? place.Name.replace(' County', '') + (idx !== _this.places.length - 1 ? ',' : '') : '');
            cts += (['Tracts', 'Census Tracts', 'Unincorporated Place'].indexOf(place.TypeCategory) !== -1 && cts.indexOf(place.ResID) === -1 ? place.ResID + (idx !== _this.places.length - 1 ? ',' : '') : '');
            if (place.ResID === '41') {
                schooldistricts += 'Statewide' + (idx !== _this.places.length - 1 ? ',' : '');
            }
        });
        counties = counties.replace(/(^,)|(,$)/g, '');
        console.log('cough', schooldistricts);
        schooldistricts = schooldistricts.replace(/(^,)|(,$)/g, '');
        geoids = this.places.length === 0 ? '41' : geoids;
        geonames = this.places.length === 0 ? 'Oregon' : geonames;
        schooldistricts = this.places.length === 0 ? 'Statewide' : schooldistricts;
        console.log('fall', counties, cts);
        var indicatorForService = this.indicator.replace(/\%28/g, '(')
            .replace(/\%29/g, ')')
            .replace(/\%2C/g, ',')
            .replace(/\%24/g, '$')
            .replace(/\+/g, '%2B')
            .replace(/\=/g, '%3D')
            .replace(/\&/g, '%26');
        if (this.tileType === 'map' && this.showMap) {
            var placeTypes = '';
            if (this.isSchool) {
                placeTypes = 'Schools';
            }
            else {
                for (var p = 0; p < this.places.length; p++) {
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
                    }
                    else {
                        placeTypes += this.selectedPlaceType === 'Counties' ? 'County' : this.selectedPlaceType;
                    }
                }
                if (placeTypes === 'State' || placeTypes === '' || this.isCountyLevel) {
                    placeTypes = 'County,State';
                }
                placeTypes = placeTypes.replace(/,\s*$/, '').replace(/\,,/g, ',');
                placeTypes = placeTypes.split(',').sort(function (a, b) {
                    if (_this.translatePlaceTypes(b) === _this.translatePlaceTypes(_this.selectedPlaceType)) {
                        return 1;
                    }
                    else if (a === 'State') {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                }).toString();
            }
            console.log('GET DATA HOT DIGIDIGDIGIDGIG I', placeTypes, this.selectedPlaceType);
            this._dataService.getAllbyGeoType(placeTypes, indicatorForService).subscribe(function (data) {
                console.log('data direct from service', data);
                _this._selectedDataService.add(data);
            }, function (err) { return console.error(err); }, function () { return console.log('done loading data for map'); });
        }
        else {
            var combinedGroups = this.checkCombineGroups();
            if (combinedGroups.length > 0 && !this.isStatewide && !this.isSchool) {
                console.log('combine data call', geoids);
                this._dataService.getIndicatorDetailDataWithMetadata(geoids, indicatorForService).subscribe(function (data) {
                    var combinedData = _this.processCombinedData(data);
                    console.log('hotdog', combinedData);
                    _this.updateDataStore([combinedData], 'indicator');
                    _this.onChartDataUpdate.emit({ data: combinedData, customPlace: _this.selectedPlaceCustomChart, customYear: _this.selectedCustomChartYear, metadata: data.Metadata[0] });
                    _this.createGraphChart();
                });
            }
            else {
                console.log('geoids for data service', geoids, geonames, schooldistricts);
                if (this.isSchool) {
                    console.log('SCHOOL DATA', schooldistricts, geonames, geoids, this.tileType);
                    this._dataService.getSchoolDistrictData(schooldistricts, this.indicator, counties, cts).subscribe(function (data) {
                        console.log('SCHOOL DATA', data);
                        _this.updateDataStore([data], 'indicator');
                        console.log('updated data store');
                        _this.createGraphChart();
                        _this.onChartDataUpdate.emit({ data: _this.isCustomChart ? _this.dataStore.indicatorData[_this.indicator].chart_data : data, customPlace: _this.selectedPlaceCustomChart, customYear: _this.selectedCustomChartYear, metadata: data.Metadata[0] });
                    }, function (err) { return console.error(err); }, function () { return console.log('done loading data for graph'); });
                }
                else {
                    console.log('prague', geoids, geonames, indicatorForService);
                    this._dataService.getIndicatorDataWithMetadata(geoids, geonames, indicatorForService).subscribe(function (data) {
                        console.log('regular indicator data', data);
                        if (data.Data.length > 0) {
                            _this.updateDataStore([data], 'indicator');
                            _this.createGraphChart();
                            _this.onChartDataUpdate.emit({ data: _this.isCustomChart ? _this.dataStore.indicatorData[_this.indicator].chart_data : data, customPlace: _this.selectedPlaceCustomChart, customYear: _this.selectedCustomChartYear, metadata: data.Metadata[0] });
                        }
                        else {
                            _this.chart.showLoading('Sorry, indicator data is not available for this place.');
                            _this.chart.setTitle({
                                text: _this.viewType === 'basic' || _this.isHandheld ? _this.indicator.replace('<br>', ' ') : null,
                                align: _this.viewType === 'basic' ? 'left' : _this.isHandheld ? 'center' : null,
                                style: {
                                    fontSize: '1.25em',
                                    fontWeight: '200'
                                },
                            });
                            _this.chart.legend.enabled = false;
                        }
                    }, function (err) { return console.error(err); }, function () { return console.log('done loading data for graph'); });
                }
            }
        }
    };
    DataTileComponent.prototype.checkCombineGroups = function () {
        var _this = this;
        var combineArray = [];
        var groupNames = [];
        this.places.forEach(function (place) {
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
                _this.places.forEach(function (place) {
                    if (place.GroupName === gn) {
                        groupArray.push(place);
                    }
                });
                combineArray.push(groupArray);
            }
        });
        console.log('combined array', combineArray);
        this.hasCombined = groupNames.length > 0 ? true : false;
        return combineArray;
    };
    DataTileComponent.prototype.processCombinedData = function (data) {
        var combinedData = data;
        if (!data.Metadata[0].isPreCalc && data.Metadata[0].Variable_Represent.trim() !== 'Text') {
            var groups = this.checkCombineGroups();
            console.log('groups', groups, data);
            for (var _i = 0; _i < groups.length; _i++) {
                var group = groups[_i];
                console.log('group of groups', group);
                var combinedGroupData = new Object;
                combinedGroupData.community = group[0].GroupName;
                combinedGroupData.Variable = group[0].Variable;
                combinedGroupData.geoid = '';
                var multiplyBy = parseInt(data.Metadata[0].MultiplyBy);
                var notCombined = false;
                for (var _a = 0, _b = data.Years; _a < _b.length; _a++) {
                    var year = _b[_a];
                    var isACS = year.Year.indexOf('-') !== -1;
                    var combinedNumerators = 0;
                    var combinedDenoms = 0;
                    var combinedNumMOEs = 0;
                    var combinedDenomMOEs = 0;
                    for (var _c = 0; _c < group.length; _c++) {
                        var place = group[_c];
                        var placeData = combinedData.Data.filter(function (pData) {
                            return pData.geoid === place.ResID;
                        });
                        console.log(placeData);
                        if (placeData.length > 0) {
                            var numValue = placeData[0][year.Year + '_N'];
                            var denomValue = placeData[0][year.Year + '_D'];
                            var numMOEValue = isACS ? placeData[0][year.Year + '_MOE_N'] : null;
                            var denomMOEValue = isACS ? placeData[0][year.Year + '_MOE_D'] : null;
                            console.log('place comb data', placeData);
                            console.log('num value', numValue);
                            console.log('denom value', denomValue);
                            combinedNumerators = (numValue !== '' && numValue !== null) ? (combinedNumerators + parseFloat(numValue)) : combinedNumerators;
                            combinedDenoms = denomValue !== '' && denomValue !== null ? (combinedDenoms + parseFloat(denomValue)) : combinedDenoms;
                            if (isACS) {
                                combinedNumMOEs = numMOEValue !== '' && numMOEValue !== null ? (combinedNumMOEs + parseFloat(numMOEValue)) : combinedNumMOEs;
                                combinedDenomMOEs = denomMOEValue !== '' && denomMOEValue !== null ? (combinedDenomMOEs + parseFloat(denomValue)) : combinedDenomMOEs;
                            }
                            console.log('combinedNumerators', combinedNumerators, numValue);
                        }
                        else {
                            notCombined = true;
                        }
                    }
                    if (!notCombined) {
                        combinedDenoms = combinedDenoms === 0 || combinedDenoms === null ? 1 : combinedDenoms;
                        combinedGroupData[year.Year] = combinedNumerators !== 0 ? combinedNumerators / combinedDenoms * multiplyBy : null;
                        if (isACS) {
                            var displayMOE = void 0;
                            if (combinedDenomMOEs !== 0) {
                                var calcVal = (combinedNumerators / combinedDenoms) / multiplyBy;
                                displayMOE = Math.round(((Math.sqrt(Math.pow(combinedNumMOEs, 2) + ((Math.pow(calcVal, 2) * (Math.pow(combinedDenomMOEs, 2))))) / combinedDenoms)) * multiplyBy * 10) / 10;
                            }
                            else {
                                displayMOE = Math.round(combinedNumMOEs * 10) / 10;
                            }
                            combinedGroupData[year.Year + '_MOE'] = displayMOE;
                        }
                    }
                }
                for (var _d = 0; _d < group.length; _d++) {
                    var place = group[_d];
                    combinedData.Data = combinedData.Data.filter(function (pData) { return pData.geoid !== place.ResID && pData.community !== place.Name; });
                }
                combinedData.Data.push(combinedGroupData);
                console.log('combined data added', combinedData);
            }
        }
        return combinedData;
    };
    DataTileComponent.prototype.checkUpdateData = function () {
        var loadMoreData = false;
        for (var d = 0; d < this.places.length; d++) {
            console.log('Check UpdateData', this.places[d].TypeCategory);
            if (this.places[d].TypeCategory !== 'State') {
                console.log('is this where', this.dataStore);
                try {
                    loadMoreData = this.dataStore[this.pluralize(this.places[d].TypeCategory)].indicatorData[this.indicator] ? false : true;
                    if (!loadMoreData) {
                        if (!this.dataStore[this.pluralize(this.places[d].TypeCategory)].indicatorData[this.indicator].chart_data) {
                            this.onSelectedDataChanged(this.AllData);
                        }
                    }
                }
                catch (ex) {
                    console.log('yep, guess so', ex);
                }
            }
        }
        if (this.dataStore[this.selectedPlaceType] !== undefined) {
            if (this.dataStore[this.selectedPlaceType].indicatorData[this.indicator] === undefined) {
                loadMoreData = true;
            }
        }
        return loadMoreData;
    };
    DataTileComponent.prototype.onSelectedDataChanged = function (data) {
        console.log('Community Data throwing event', this.Data);
        this.updateDataStore(data, 'indicator');
        if (data.length > 0) {
            console.log('giddy up', this.dataStore, this.selectedPlaceType);
            try {
                this.placeTypeData = this.dataStore[this.selectedPlaceType].indicatorData[this.indicator].crt_db;
                this.yearEndOffset = this.getEndYear();
                this.selectedYear = this.placeTypeData.Years[data[0].Years.length - (this.yearEndOffset + 1)];
                if (this.tileType === 'map' && this.showMap) {
                    this.selectedMapData = this.getSelectedMapData();
                }
                console.log('ptd', this.placeTypeData);
                this.processDataYear();
                this.processYearTicks();
                this.selectedYearIndex = this._tickArray.length;
                this.hasDrillDowns = this.placeTypeData.Metadata[0].Sub_Topic_Name !== 'none' ? true : false;
                if (this.tileType === 'map' && this.showMap) {
                    this.initMapChart();
                    console.log('shamrock');
                    if (!this.isSliderInit && this._tickArray.length > 1) {
                        this.showSlider = true;
                        this.setupTimeSlider();
                        this.isSliderInit = true;
                    }
                    else {
                        this.showSlider = this._tickArray.length > 1;
                    }
                }
            }
            catch (ex) {
                console.log('CAUGHT Exception: placetype indicator data not loaded' + ex.message, this.selectedPlaceType, this.dataStore);
                if (this.tileType === 'graph') {
                    this.chart.showLoading('Sorry, this chart is not currently available.  ' + ('<%= ENV %>' !== 'prod' ? ex.message : ''));
                }
                else {
                    this.mapChart.showLoading('Sorry, this map is not currently available.  ' + ('<%= ENV %>' !== 'prod' ? ex.message : ''));
                }
            }
        }
        else {
            console.log('DATA SUBSCRIPTION thinks there is no data');
        }
    };
    DataTileComponent.prototype.updateDataStore = function (data, dataType) {
        var _this = this;
        if (dataType === 'indicator') {
            console.log('fred', this.dataStore, this.tileType);
            for (var d = 0; d < data.length; d++) {
                var indicatorData = {};
                indicatorData[this.indicator] = { crt_db: data[d] };
                if (data[d].Metadata.length > 0) {
                    var metadata = data[d].Metadata[0];
                    this.isStatewide = metadata.Variable_Geog_Desc === 'State' ? true : false;
                    this.isCountyLevel = metadata.CountyLevel;
                    this.isNotCombinable = metadata.isPreCalc && this.isStatewide && this.hasCombined;
                }
                if (this.tileType === 'map' && !this.isStatewide && !this.isCustomChart) {
                    console.log('say what', data[d].GeoTypes[0].geoType, data, this.isSchool);
                    if (this.isSchool) {
                        var geoTypeIndicatorData = {};
                        geoTypeIndicatorData[this.indicator] = { crt_db: data[0] };
                        this.dataStore.SchoolDistricts.indicatorData = geoTypeIndicatorData;
                    }
                    else {
                        var geoTypes = ['Place', 'Census Tract', 'State', 'County', 'School'];
                        geoTypes.forEach(function (gt) {
                            var geoTypeData = data[d].Data.filter(function (d) { return d.geoType === gt; });
                            console.log('processing', gt, geoTypeData);
                            if (geoTypeData.length > 0) {
                                if (_this.dataStore[_this.pluralize(gt).toString()].indicatorData[_this.indicator] === undefined) {
                                    var geoInfoData = {
                                        Data: geoTypeData,
                                        GeoTypes: data[d].GeoTypes,
                                        GeoYears: data[d].GeoYears,
                                        Metadata: data[d].Metadata,
                                        RelatedIndicators: data[d].RelatedIndicators,
                                        SubTopicCategories: data[d].SubTopicCategories,
                                        Years: data[d].Years
                                    };
                                    var geoTypeIndicatorData = {};
                                    geoTypeIndicatorData[_this.indicator] = { crt_db: geoInfoData };
                                    _this.dataStore[_this.pluralize(gt).toString()].indicatorData = geoTypeIndicatorData;
                                }
                            }
                        });
                        console.log('processing: finished', this.dataStore);
                    }
                }
                else {
                    console.log('countycheck-2', indicatorData);
                    this.dataStore.indicatorData = indicatorData;
                }
            }
        }
        if (dataType === 'mapData') {
            var mapData = {};
            mapData = data;
            this.dataStore[this.pluralize(data.layerId)].mapData = mapData;
        }
    };
    DataTileComponent.prototype.getPlaceData = function () {
        var returnData;
        if (this.tileType === 'map' && this.showMap) {
            returnData = this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].chart_data.place_data;
        }
        else {
            returnData = this.dataStore.indicatorData[this.indicator].chart_data.place_data;
        }
        return returnData.filter(function (data) { return typeof data.value === 'number'; });
    };
    DataTileComponent.prototype.getPlaceTypeData = function () {
        if (this.tileType === 'map' && this.showMap) {
            return this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].crt_db;
        }
        else {
            return this.dataStore.indicatorData[this.indicator].crt_db;
        }
    };
    DataTileComponent.prototype.getSelectedMapData = function () {
        var _this = this;
        console.log('que pasa', this.selectedPlaceType, this.selectedYear);
        var selectedGeoJSONType = this.geoJSONStore.filter(function (data) { return data.layerId === _this.pluralize(_this.selectedPlaceType) || 'School Districts' === data.layerId; });
        console.log('que pasa geotype', selectedGeoJSONType);
        var selectedYearGeoJSONIndex = 0;
        for (var y = 0; y < selectedGeoJSONType[0].features.length; y++) {
            var year = selectedGeoJSONType[0].features[y];
            if (this.selectedYear.Year.split('-').length > 1) {
                selectedYearGeoJSONIndex = (parseInt(year.Year) <= parseInt('20' + this.selectedYear.Year.split('-')[1])) ? y : selectedYearGeoJSONIndex;
            }
            else {
                selectedYearGeoJSONIndex = parseInt(year.Year) <= parseInt(this.selectedYear.Year) ? y : selectedYearGeoJSONIndex;
            }
        }
        console.log('que pasa', selectedGeoJSONType);
        return selectedGeoJSONType[0].features[selectedYearGeoJSONIndex];
    };
    DataTileComponent.prototype.setupTimeSlider = function () {
        if ($.ui === undefined) {
            var temp = $.noConflict();
            console.log(temp);
        }
        var sliderScope = this;
        $(this.elementRef.nativeElement).find('#dateSlider').labeledslider({
            min: 0,
            max: this.isCustomChart ? this.customChartYears.length - 1 : this.placeTypeData.Years.length - (this.yearStartOffset + 1 + this.yearEndOffset),
            value: this.isCustomChart ? this.customChartYears.length - 1 : this.placeTypeData.Years.length - (this.yearStartOffset + 1 + this.yearEndOffset),
            tickInterval: 1,
            step: 1,
            autoScaleSlider: false,
            tickArray: this._tickArray,
            tickLabels: this._tickLabelsTime,
            change: function (event, ui) {
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
                }
                else {
                    sliderScope.selectedYear = sliderScope.placeTypeData.Years[ui.value + sliderScope.yearStartOffset];
                    sliderScope.selectedYearIndex = sliderScope.selectedYearIndexArray[sliderScope.selectedYear.Year];
                    sliderScope.processDataYear();
                    sliderScope.mapChart.setTitle(null, {
                        text: sliderScope.selectedPlaceType + ' (' + sliderScope.selectedYear.Year + ')'
                    });
                    var seriesIndex = sliderScope.mapChart.series.length - 1;
                    var mapData = sliderScope.getSelectedMapData();
                    var data = sliderScope.dataStore[sliderScope.selectedPlaceType].indicatorData[sliderScope.indicator].chart_data.place_data;
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
                    }
                }
            }
        });
    };
    DataTileComponent.prototype.onPlayBtnClick = function (evt) {
        var runScope = this;
        var runInterval = setInterval(runCheck, 2000);
        function runCheck() {
            if (runScope.sliderState === 'pause') {
                if (runScope.isCustomChart) {
                    runScope.animationCounter = runScope.animationCounter < (runScope.customChartYears.length - 1) ? ++runScope.animationCounter : 0;
                }
                else {
                    runScope.animationCounter = runScope.animationCounter < (runScope.placeTypeData.Years.length - 1) ? ++runScope.animationCounter : 0;
                }
                $(runScope.elementRef.nativeElement).find('#dateSlider').labeledslider({ value: runScope.animationCounter });
            }
            else {
                clearInterval(runInterval);
            }
        }
        this.sliderState = this.sliderState === 'play' ? 'pause' : 'play';
    };
    DataTileComponent.prototype.translatePlaceTypes = function (placeType) {
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
    };
    DataTileComponent.prototype.initMapChart = function () {
        console.log('CREATIN MAP CHART', this.mapChart, this.mapOptions);
        var mapScope = this;
        var isTextData = false;
        this.mapOptions.xAxis = {
            min: mapScope.mapChartZoomSettings.xMin ? parseInt(mapScope.mapChartZoomSettings.xMin) : null,
            max: mapScope.mapChartZoomSettings.xMax ? parseInt(mapScope.mapChartZoomSettings.xMax) : null,
            events: {
                afterSetExtremes: function (x) {
                    mapScope.mapChartZoomSettings.xMax = x.max;
                    mapScope.mapChartZoomSettings.xMin = x.min;
                }
            }
        };
        this.mapOptions.yAxis = {
            min: mapScope.mapChartZoomSettings.yMin ? parseInt(mapScope.mapChartZoomSettings.yMin) : null,
            max: mapScope.mapChartZoomSettings.yMax ? parseInt(mapScope.mapChartZoomSettings.yMax) : null,
            events: {
                afterSetExtremes: function (y) {
                    mapScope.mapChartZoomSettings.yMax = y.max;
                    mapScope.mapChartZoomSettings.yMin = y.min;
                }
            }
        };
        this.mapChart.destroy();
        this.mapChart = new angular2_highcharts_1.Highcharts.Map(this.mapOptions);
        this.mapChart.legend.title.attr({ text: this.placeTypeData.Metadata[0]['Y-Axis'] ? this.placeTypeData.Metadata[0]['Y-Axis'] : '' });
        this.mapChart.tooltip.options.formatter = function () {
            var displayValue = mapScope.formatValue(this.point.value, false) + '</b>';
            if (this.point.selected) {
                this.point.setState('select');
            }
            if (this.point.value === undefined) {
                return '<span>' + this.point.properties.name + ' County</span><br/><span style="font-size: 10px">Not Available or Insufficient Data</span>';
            }
            else {
                if (this.point.year !== undefined) {
                    if (this.point.year.match('-')) {
                        var chart_data = mapScope.dataStore[mapScope.selectedPlaceType].indicatorData[mapScope.indicator].chart_data;
                        displayValue += '<span style="font-size:8px">  (+/- ';
                        displayValue += mapScope.formatValue(((parseFloat(chart_data.place_data_years_moe[this.point.id].data[mapScope.selectedYearIndexArray[this.point.year]][1]) - parseFloat(chart_data.place_data_years_moe[this.point.id].data[mapScope.selectedYearIndexArray[this.point.year]][0])) / 2), false);
                        displayValue += ' )</span>';
                    }
                    var SeriesName = (this.point.series.name.split(':').length > 1 ? this.point.series.name.split(':')[0] + ':<br />' + this.point.series.name.split(':')[1] : this.point.series.name).replace('%3A', ':');
                    var returnHTML = '<span style="fill: ' + this.series.color + ';"> ● </span><span style="font-size: 10px"> ' + SeriesName + '</span>';
                    returnHTML += '<br/><b>' + this.point.id + ' ' + (mapScope.selectedPlaceType === 'Counties' ? 'County' : '') + ': ' + displayValue;
                    returnHTML += '<br/><span style="color:#a7a7a7;">-----------------------------------------</span><br/><em><span style="font-size:10px; color:' + mapScope.placeTypeData.Metadata[0].Color_hex;
                    returnHTML += '; font-weight:bold; font-style:italic">( Click to view chart  ---   To compare: Hold Shift + Click )</span></em>';
                    return returnHTML;
                }
                else {
                    return '<span style="font-size: 10px">Not Available or Insufficient Data</span>';
                }
            }
        };
        var colorAxis = this.mapChart.colorAxis[0];
        if (this.indicator_info.Represented_ID === 10) {
            isTextData = true;
            var dataClasses = this.getDataClasses();
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
            });
            this.mapChart.legend.update(this.setLegendOptions(true));
        }
        else {
            colorAxis.update({
                type: this.getMinData(true, true) > 0 ? 'logarithmic' : null,
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
        var seriesLength = this.mapChart.series.length;
        for (var i = seriesLength - 1; i > -1; i--) {
            this.mapChart.series[i].remove();
        }
        var ptSeriesIndexes = [];
        if (this.selectedPlaceType === 'Places') {
            console.log('BOUNDARY Data');
            console.log(this.dataStore.Boundary.mapData);
            var boundarySeries = {
                name: 'Boundary',
                enableMouseTracking: false,
                color: '#FBCF76',
                negativeColor: '#F6F6F5',
                mapData: this.dataStore.Boundary.mapData.features[0]
            };
            this.mapChart.addSeries(boundarySeries);
            ptSeriesIndexes.push(this.mapChart.series.length - 1);
        }
        console.log('placedata from map', this.getPlaceData());
        var series = {
            borderColor: this.selectedPlaceType === 'Places' ? '#a7a7a7' : 'white',
            data: this.getPlaceData(),
            mapData: this.getSelectedMapData(),
            joinBy: this.selectedPlaceType === 'Tracts'
                ? ['GEOID', 'geoid']
                : (this.selectedPlaceType === 'SchoolDistricts'
                    ? ['ODE_ID', 'geoid'] : ['NAME', 'name']),
            name: this.indicator + ' ' + this.selectedPlaceType + ' (' + this.selectedYear.Year + ')',
            allowPointSelect: true,
            cursor: 'pointer',
            states: {
                hover: {
                    color: '#a7a7a7'
                },
                select: {
                    color: '#BADA55'
                }
            },
        };
        console.log('checkshit', series);
        this.mapChart.addSeries(series, true);
        console.log('checkshit2', series);
        this.mapChart.series[this.selectedPlaceType === 'Places' ? 1 : 0].mapData = this.getSelectedMapData();
        this.mapChart.series[this.selectedPlaceType === 'Places' ? 1 : 0].setData(this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].chart_data.place_data);
        this.mapChart.setTitle(null, {
            text: this.pluralize(this.selectedPlaceType) + ' (' + this.selectedYear.Year + ')',
            verticalAlign: 'bottom',
            y: -5,
            x: -10,
            style: {
                fontSize: '.8em',
                fontStyle: 'italic'
            }
        });
        window.setTimeout(function () {
            mapScope.mapChart.hideLoading();
            mapScope.selectedMapPoints = mapScope.mapChart.getSelectedPoints();
        }, 500);
        if (this.indicator_info.Represented_ID === 10) {
            this.onChartDataUpdate.emit({ data: this.dataStore[this.selectedPlaceType].indicatorData[this.indicator].chart_data, customPlace: this.selectedPlaceCustomChart, textYears: this.placeTypeData.Years, metadata: this.placeTypeData.Metadata[0] });
        }
    };
    DataTileComponent.prototype.getSelectColor = function (context) {
        console.log('getting select color', context);
        var color = '#BADA55';
        var returnColor = {
            radialGradient: {
                cx: 0.5,
                cy: 0.5,
                r: 0.45
            },
            stops: [
                [0, color],
                [1, color],
                [2, color],
                [3, color],
                [4, color],
                [5, color],
                [6, color],
                [7, angular2_highcharts_1.Highcharts.Color(color).brighten(-0.3).get('rgb')]
            ]
        };
        console.log('return select color', returnColor);
        return returnColor;
    };
    DataTileComponent.prototype.createGraphChart = function () {
        try {
            if (!this.isCustomChart) {
                this.placeTypeData = this.dataStore.indicatorData[this.indicator].crt_db;
                this.selectedYear = this.placeTypeData.Years[this.placeTypeData.Years.length - this.yearEndOffset - 1];
                this.processDataYear();
                this.processYearTicks();
                this.selectedYearIndex = this._tickArray.length - 1;
                this.Data = this.placeTypeData.Data;
                if (this.placeTypeData.Metadata.length > 0) {
                    var chartScope = this;
                    this.chart.xAxis[0].setCategories(this._tickLabels);
                    this.chart.xAxis[0].update({
                        min: 0,
                        max: this._tickArray.length - 1,
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
                    try {
                        this.chart.legend.update(this.setLegendOptions(true));
                    }
                    catch (ex) {
                        console.log('failed', ex);
                    }
                    this.chart.tooltip.options.shared = false;
                    this.chart.tooltip.options.useHTML = true;
                    this.chart.tooltip.options.formatter = function () {
                        console.log('hovering', this);
                        var hoveredPlace = this.series.name
                            .replace(' County', '')
                            .replace(' School District', '')
                            .replace(' Margin of Error', '')
                            .split('<br>')[0];
                        if (this.series.name.match('Error')) {
                            return false;
                        }
                        else {
                            var displayValue = chartScope.formatValue(this.y, false) + '</b>';
                            var isMoeYear = this.x.match('-') && ['American Community Survey', 'Combined Decennial/ACS', 'County Level Census/ACS', 'MaritalStatusEstimate'].indexOf(chartScope.placeTypeData.Metadata[0].data_source) !== -1;
                            if (isMoeYear) {
                                var value1 = parseFloat(chartScope.dataStore.indicatorData[chartScope.indicator].chart_data.place_data_years_moe[hoveredPlace].data[chartScope.selectedYearIndexArray[this.x]][1]);
                                var value2 = parseFloat(chartScope.dataStore.indicatorData[chartScope.indicator].chart_data.place_data_years_moe[hoveredPlace].data[chartScope.selectedYearIndexArray[this.x]][0]);
                                var moeValue = (value1 - value2) / 2;
                                displayValue += '<span style="font-size:8px">  (+/- ' + chartScope.formatValue(moeValue, false) + ' )</span>';
                            }
                            return '<span style="fill: ' + this.series.color + ';"> ● </span><span style="font-size:10px"> ' + this.point.series.name + ' (' + this.x + ')</span><br/><span><b>' + displayValue + '</span><br/>';
                        }
                    };
                    var indicatorYaxis = this.placeTypeData.Metadata[0]['Y-Axis'] !== null ? this.placeTypeData.Metadata[0]['Y-Axis'] : this.indicator;
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
                    var title = this.placeTypeData.Metadata[0]['Dashboard_Chart_Title'] !== null ? this.placeTypeData.Metadata[0]['Dashboard_Chart_Title'] : this.indicator;
                    this.chart.setTitle({
                        text: this.viewType === 'basic' || this.isHandheld ? title.replace('<br>', ' ') : null,
                        align: this.viewType === 'basic' ? 'left' : this.isHandheld ? 'center' : null,
                        style: {
                            fontSize: '1.25em',
                            fontWeight: '200'
                        },
                    }, {
                        text: this.viewType === 'basic' ? (this.isCountyLevel ? '<span class="glyphicon glyphicon-flag"></span><span>County Level Data</span>' : this.isStatewide ? '<span class="glyphicon glyphicon-flag"></span><span>Statewide Data Only</span>' : '') : null,
                        align: 'right',
                        style: {
                            fontStyle: 'italic',
                            fontSize: '.8em',
                            color: '#a7a7a7'
                        },
                        useHTML: true
                    });
                    this.addSeriesDataToGraphChart();
                    this.chart.hideLoading();
                }
                else {
                }
            }
            else {
                if (this.tileType === 'graph') {
                    this.createCustomChart();
                    this.chart.hideLoading();
                }
            }
        }
        catch (ex) {
            if (this.chart) {
                this.chart.showLoading('Sorry, this chart is not currently available' + ex.message);
            }
        }
    };
    DataTileComponent.prototype.getDataClasses = function () {
        var uniqueVals = [];
        var dataClasses = [];
        var uniqueIdx = 0;
        this.dataStore[this.selectedPlaceType].indicatorData[this.indicator].chart_data.place_data.forEach(function (cd, idx) {
            if (uniqueVals.indexOf(cd.value) === -1 && cd.value !== undefined && cd.value !== null && cd.value !== '') {
                uniqueVals.push(cd.value);
                uniqueIdx++;
            }
        });
        uniqueVals
            .sort(function (a, b) {
            if (a !== null && b !== null) {
                return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
            }
        })
            .forEach(function (cd, idx) {
            var dataClass = {
                from: cd,
                to: cd,
                color: angular2_highcharts_1.Highcharts.getOptions().colors[idx],
                name: cd
            };
            dataClasses.push(dataClass);
        });
        return dataClasses;
    };
    DataTileComponent.prototype.onSelectedPlaceChangedCustomChart = function (selected) {
        console.log('place changed', selected, this.dataStore);
        this.selectedPlaceCustomChart = selected;
        this.processCustomChart();
        this.onChartDataUpdate.emit({
            data: this.isCustomChart ? this.dataStore.indicatorData[this.indicator].chart_data : this.dataStore.indicatorData[this.indicator].crt_db,
            customPlace: this.selectedPlaceCustomChart,
            customYear: this.selectedCustomChartYear,
            metadata: this.dataStore.indicatorData[this.indicator].crt_db.Metadata[0]
        });
    };
    DataTileComponent.prototype.processCustomChart = function () {
        var _this = this;
        console.log('thinks it is custom chart', this.indicator_info.ScriptName);
        var chartScope = this;
        var categories;
        try {
            switch (this.indicator_info.ScriptName) {
                case 'PopulationPyramid':
                case 'PopulationPyramidEstimate':
                case 'PropOwnByAge':
                case 'PropOwnByAgeEstimate':
                    var isHousing = this.indicator_info.ScriptName.indexOf('Pyramid') === -1;
                    var maxPadding = isHousing ? 5 : 2;
                    console.log('padding', this.dataStore.indicatorData[this.indicator].chart_data.place_data_years[this.selectedPlaceCustomChart.Name].maxVal);
                    categories = this.dataStore.indicatorData[this.indicator].chart_data.place_data_years[this.selectedPlaceCustomChart.Name].categories
                        .filter(function (cat) {
                        return !isHousing ? true : _this.selectedCustomChartYear !== '1990' ? cat !== 'under 25' && cat !== '75+' : (cat !== '85+' && cat !== '75-84' && cat !== '15-24');
                    });
                    var pyramidOptions = {
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
                            }, {
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
                                var _this = this;
                                var moeVal = '';
                                if (chartScope.selectedCustomChartYear.indexOf('-') !== -1) {
                                    var pData = chartScope.dataStore.indicatorData[chartScope.indicator].chart_data.place_data_years[chartScope.selectedPlaceCustomChart.Name];
                                    var idx = 0;
                                    pData.categories.forEach(function (cat, cidx) {
                                        idx = _this.point.category === cat ? cidx : idx;
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
                                    + angular2_highcharts_1.Highcharts.numberFormat(Math.abs(this.point.y), 2)
                                    + '%' + (!isHousing && moeVal !== '' ? '<span style="font-size:.8em"> (+/- ' + moeVal + ')</span>' : '');
                            }
                        },
                        series: [{
                                name: isHousing ? 'Owners' : 'Males',
                                data: isHousing ? this.dataStore.indicatorData[this.indicator].chart_data.place_data_years[this.selectedPlaceCustomChart.Name].data.owners[this.selectedCustomChartYear].data
                                    .filter(function (data, idx) {
                                    return _this.indicator_info.ScriptName.indexOf('Estimate') !== -1 ? true : _this.selectedCustomChartYear !== '1990' ? [0, 7].indexOf(idx) === -1 : [1, 8, 9].indexOf(idx) === -1;
                                })
                                    : this.dataStore.indicatorData[this.indicator].chart_data.place_data_years[this.selectedPlaceCustomChart.Name].data.males[this.selectedCustomChartYear].data
                            }, {
                                name: isHousing ? 'Renters' : 'Females',
                                data: isHousing ? this.dataStore.indicatorData[this.indicator].chart_data.place_data_years[this.selectedPlaceCustomChart.Name].data.renters[this.selectedCustomChartYear].data
                                    .filter(function (data, idx) {
                                    return _this.indicator_info.ScriptName.indexOf('Estimate') !== -1 ? true : _this.selectedCustomChartYear !== '1990' ? [0, 7].indexOf(idx) === -1 : [1, 8, 9].indexOf(idx) === -1;
                                })
                                    : this.dataStore.indicatorData[this.indicator].chart_data.place_data_years[this.selectedPlaceCustomChart.Name].data.females[this.selectedCustomChartYear].data
                            }
                        ]
                    };
                    this.chart.destroy();
                    this.chart = new angular2_highcharts_1.Highcharts.Chart(pyramidOptions);
                    break;
                case 'IncomeHistogram':
                    categories = this.dataStore.indicatorData[this.indicator].chart_data.place_data_years[this.selectedPlaceCustomChart.Name].categories
                        .filter(function (cat) {
                        return _this.selectedCustomChartYear !== '1990' ? cat !== '> $150,000' : (cat !== '$150,000 - 199,999' && cat !== '> $200,000');
                    });
                    console.log('income cat', categories);
                    var incomeDistOptions = {
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
                                    }
                                    else {
                                        return this.value;
                                    }
                                }
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: '# of Households'
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
                                var _this = this;
                                var moeVal = '';
                                if (chartScope.selectedCustomChartYear.indexOf('-') !== -1) {
                                    var pData = chartScope.dataStore.indicatorData[chartScope.indicator].chart_data.place_data_years[chartScope.selectedPlaceCustomChart.Name];
                                    var idx = 0;
                                    pData.categories.forEach(function (cat, cidx) {
                                        idx = _this.point.category === cat ? cidx : idx;
                                    });
                                    moeVal = chartScope.formatValue(pData.data[chartScope.selectedCustomChartYear].data_moe[idx], false);
                                }
                                return chartScope.selectedPlaceCustomChart.Name + ': ' + chartScope.selectedCustomChartYear + '<br/><b>' + this.point.category + '</b><br/>' + chartScope.formatValue(this.point.y, false) + (moeVal !== '' ? '<span style="font-size:.8em"> (+/- ' + moeVal + ')</span>' : '');
                            }
                        },
                        series: [{
                                name: this.selectedPlaceCustomChart.Name + ' Income Distribution',
                                data: this.dataStore.indicatorData[this.indicator].chart_data.place_data_years[this.selectedPlaceCustomChart.Name].data[this.selectedCustomChartYear].data
                                    .filter(function (data, idx) {
                                    return _this.selectedCustomChartYear !== '1990' ? idx !== 8 : idx !== 7 && idx !== 9;
                                })
                            }]
                    };
                    this.chart.destroy();
                    this.chart = new angular2_highcharts_1.Highcharts.Chart(incomeDistOptions);
                    break;
                case 'ClientContacts211Info':
                case 'SocialServiceProviders211Info':
                case 'PovertyByRace':
                    var chartTitle = this.isCountyLevel ?
                        this.selectedPlaceCustomChart.GeoInfo.length > 0 ?
                            this.selectedPlaceCustomChart.GeoInfo[0].County + ' County: ' + this.selectedCustomChartYear + '<br> (for ' + this.selectedPlaceCustomChart.Name + ')' :
                            this.viewType === 'advanced' ?
                                this.selectedPlaceCustomChart.Name + ': ' + this.selectedCustomChartYear :
                                this.selectedCustomChartYear :
                        this.viewType === 'advanced' ?
                            this.selectedPlaceCustomChart.Name + ': ' + this.selectedCustomChartYear :
                            this.selectedCustomChartYear;
                    var _211InfoChartOptions = {
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
                            pointFormat: this.indicator_info.ScriptName === 'PovertyByRace' ? '<b>{point.name}</b>: {point.y:.1f}%' : '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: this.viewType === 'advanced' && !this.isHandheld ? true : false,
                                    format: this.indicator_info.ScriptName === 'PovertyByRace' ? '<b>{point.name}</b><br> {point.y:.1f}%' : '<b>{point.name}</b><br>{point.percentage:.1f} %',
                                    style: {
                                        color: (angular2_highcharts_1.Highcharts.theme && angular2_highcharts_1.Highcharts.theme.contrastTextColor) || 'gray',
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
                    this.chart = new angular2_highcharts_1.Highcharts.Chart(_211InfoChartOptions);
                    break;
                case 'Other':
                    break;
                default:
                    break;
            }
        }
        catch (ex) {
            if (this.chart) {
                this.chart.showLoading('Sorry this chart is not currently available');
            }
        }
    };
    DataTileComponent.prototype.createCustomChart = function () {
        var _this = this;
        try {
            console.log('creating custom chart!', this.indicator_info.ScriptName, this.dataStore);
            this.placeTypeData = this.dataStore.indicatorData[this.indicator].crt_db;
            this.selectedYear = this.placeTypeData.Years[this.placeTypeData.Years.length - this.yearEndOffset - 1];
            this.processDataYear();
            var placeSelected = false;
            this.places.forEach(function (place) {
                placeSelected = _this.selectedPlaceCustomChart ? _this.selectedPlaceCustomChart.Name === place.Name ? true : placeSelected : false;
            });
            this.selectedPlaceCustomChart = placeSelected ? this.selectedPlaceCustomChart : this.places[0];
            this.processCustomChart();
            if (this.viewType === 'advanced' && this._tickArray.length > 1) {
                this.setupTimeSlider();
            }
            else {
                this.showSlider = false;
            }
        }
        catch (ex) {
            console.log('errorballs', ex, this.tileType);
        }
    };
    DataTileComponent.prototype.addSeriesDataToGraphChart = function (mapPlaces) {
        var _this = this;
        while (this.chart.series.length > 0) {
            this.chart.series[0].remove(false);
        }
        console.log('countycheck0', this.Data, this.dataStore);
        var oregonGeoids = ['41', '41r', '41u', '9999'];
        var californiaGeoids = ['06', '06r', '06u'];
        var sortedPlaceData = this.Data.sort(function (a, b) {
            if (_this.isSchool) {
                return a.geoid.localeCompare(b.geoid);
            }
            else {
                return b.geoid.localeCompare(a.geoid);
            }
        });
        var addedSeries = [];
        sortedPlaceData.forEach(function (pd, idx) {
            var isOregon = oregonGeoids.indexOf(pd.geoid) !== -1 ? true : false;
            var isCalifornia = californiaGeoids.indexOf(pd.geoid) !== -1 ? true : false;
            var isRural = pd.geoid.indexOf('r') !== -1;
            var isUrban = pd.geoid.indexOf('u') !== -1;
            var isState = isOregon || isCalifornia ? true : false;
            var isCombined = pd.geoid === '';
            var isBarChart = _this.dataStore.indicatorData[_this.indicator].chart_data.place_data_years[(_this.isSchool ? pd.Name : pd.community)].data.length === 1;
            var color = isRural
                ? '#996699'
                : isUrban
                    ? '#0088CC'
                    : isOregon
                        ? '#244068'
                        : isCalifornia
                            ? '#C34500'
                            : isCombined
                                ? '#98BD85'
                                : angular2_highcharts_1.Highcharts.getOptions().colors[idx];
            var data = _this.dataStore.indicatorData[_this.indicator].chart_data.place_data_years[(_this.isSchool ? pd.Name : pd.community)].data;
            if (addedSeries.indexOf((_this.isSchool ? pd.Name : pd.community) + pd.geoid) === -1 && _this.hasCombined ? _this.dataStore.indicatorData[_this.indicator].chart_data.place_data_years[(_this.isSchool ? pd.Name : pd.community)].data.filter(function (d) { return d !== null; }).length > 0 : true) {
                addedSeries.push((_this.isSchool ? pd.Name : pd.community) + pd.geoid);
                _this.chart.addSeries({
                    id: (_this.isSchool ? pd.Name : pd.community) + pd.geoid,
                    name: _this.getCommunityName(pd),
                    type: isBarChart ? 'column' : 'line',
                    lineWidth: isState ? 4 : 2,
                    lineColor: isState ? '#A3A3A4' : angular2_highcharts_1.Highcharts.getOptions().colors[idx],
                    lineOpacity: 1.0,
                    data: data,
                    color: color,
                    connectNulls: true,
                    threshold: 0,
                    fillOpacity: 0.85,
                    animation: {
                        duration: 500
                    },
                    marker: {
                        fillColor: isState ? '#FFFFFF' : angular2_highcharts_1.Highcharts.getOptions().colors[idx],
                        lineWidth: isState ? 4 : 2,
                        lineColor: isRural
                            ? '#996699'
                            : isUrban
                                ? '#0088CC'
                                : isOregon
                                    ? '#244068'
                                    : isCalifornia
                                        ? '#C34500'
                                        : isCombined
                                            ? '#98BD85'
                                            : angular2_highcharts_1.Highcharts.getOptions().colors[idx],
                        radius: _this.placeTypeData.Years.length > 10 ? 3.5 : 4,
                        symbol: 'circle'
                    }
                }, true);
                if (_this.hasMOEs) {
                    _this.chart.addSeries({
                        name: pd.community + pd.geoid + ' Margin of Error',
                        whiskerLength: 10,
                        whiskerColor: isState ? 'gray' : angular2_highcharts_1.Highcharts.getOptions().colors[idx],
                        stemColor: isState ? 'gray' : angular2_highcharts_1.Highcharts.getOptions().colors[idx],
                        stemDashStyle: 'Dash',
                        type: 'errorbar',
                        data: _this.dataStore.indicatorData[_this.indicator].chart_data.place_data_years_moe[pd.community].data,
                        linkedTo: pd.community + pd.geoid,
                        visible: _this.showMOES
                    }, false);
                    var maxMoe = _this.getMaxMOE(_this.dataStore.indicatorData[_this.indicator].chart_data.place_data_years_moe[pd.community].data);
                    var minMoe = _this.getMinMOE(_this.dataStore.indicatorData[_this.indicator].chart_data.place_data_years_moe[pd.community].data);
                    if (maxMoe !== undefined) {
                        var extremes = _this.chart.yAxis[0].getExtremes();
                        maxMoe = maxMoe < extremes.max ? extremes.max : maxMoe;
                        minMoe = minMoe > 0 ? 0 : minMoe;
                        _this.chart.yAxis[0].setExtremes(minMoe, maxMoe);
                    }
                    _this.chart.redraw();
                }
            }
        });
    };
    DataTileComponent.prototype.toggleMOEs = function () {
        var _this = this;
        this.showMOES = !this.showMOES;
        this.chart.series.forEach(function (series, idx) {
            console.log('series', idx, series);
            if (series.options.type === 'errorbar' && _this.showMOES) {
                console.log('should show errorbars');
                series.show();
            }
            if (series.options.type === 'errorbar' && !_this.showMOES) {
                console.log('should hide errorbars');
                series.hide();
            }
        });
    };
    DataTileComponent.prototype.checkScreenSize = function () {
        if ($(window).width() < 481) {
            this.isHandheld = true;
        }
    };
    DataTileComponent.prototype.onResize = function (event) {
        try {
            if (this.chart || this.mapChart) {
                var runInterval = setInterval(runCheck, 2000);
                var resizeScope = this;
                function runCheck() {
                    var newWidth = resizeScope.elementRef.nativeElement.offsetWidth - 100 > $(resizeScope.isCustomChart ? '.graph-chart' : '.map-chart').width() ? resizeScope.elementRef.nativeElement.offsetWidth - 100 : $(resizeScope.isCustomChart ? '.graph-chart' : '.map-chart').width();
                    $('.ui-slider-wrapper').css('width', newWidth - 93 + 'px');
                    if (resizeScope.mapChart && resizeScope.indicator_info.Represented_ID === 10) {
                        if (resizeScope.mapChart.legend) {
                            try {
                                resizeScope.mapChart.legend.update(resizeScope.setLegendOptions());
                            }
                            catch (ex) {
                                console.log('failed', ex);
                                clearInterval(runInterval);
                            }
                        }
                    }
                    clearInterval(runInterval);
                }
            }
        }
        catch (ex) {
            console.log('resize failed', ex);
        }
    };
    DataTileComponent.prototype.setLegendOptions = function (show) {
        try {
            var returnObj = {};
            var domTile = this.related ? $(this.elementRef.nativeElement) : $('#data-tile-wrapper');
            var domTileWidth = $(domTile).width() !== 0
                ? $(domTile).width()
                : this.elementRef.nativeElement.offsetParent
                    ? this.elementRef.nativeElement.offsetParent.offsetWidth - 50
                    : 400;
            console.log('domtilewidth', this.indicator, domTileWidth, this.elementRef.nativeElement.offsetParent.offsetWidth);
            returnObj = {
                itemStyle: {
                    color: '#4d4d4d'
                },
                title: {
                    text: this.isStatewide || !show ? null : 'LEGEND: <span style="font-size: 9px; color: #666; font-weight: normal">(Click to hide series in chart)</span>'
                }
            };
            if (this.indicator_info.Represented_ID === 10) {
                if ((domTileWidth < 800 && (this.getDataClasses().length > 3))) {
                    console.log('wishthati');
                    returnObj.align = 'center';
                    returnObj.x = domTileWidth < 400 ? 40 : 20;
                }
                else if (this.getDataClasses().length > 8) {
                    returnObj.x = 30;
                }
            }
            return returnObj;
        }
        catch (ex) {
            return null;
        }
    };
    DataTileComponent.prototype.getMaxMOE = function (data) {
        var max = 0;
        for (var x = 0; x < data.length; x++) {
            if (data[x] !== null) {
                max = max < data[x][1] ? data[x][1] : max;
            }
        }
        return max;
    };
    DataTileComponent.prototype.getMinMOE = function (data) {
        var min = 0;
        for (var x = 0; x < data.length; x++) {
            if (data[x] !== null) {
                min = min > data[x][0] ? data[x][0] : min;
            }
        }
        return min;
    };
    DataTileComponent.prototype.setYextremes = function () {
        var extremes = this.chart.yAxis[0].getExtremes();
        var maxData = this.getMaxData(false);
        var minData = this.getMinData(false);
        maxData = maxData < extremes.max ? extremes.max : maxData;
        minData = minData > 0 ? 0 : minData;
        this.chart.yAxis[0].setExtremes(minData, maxData);
    };
    DataTileComponent.prototype.checkSelectedPlaceOnLoad = function (place) {
        var isSelected = false;
        for (var p = 0; p < this.places.length; p++) {
            if (this.isSchool) {
                if (this.places[p].GeoInfo.length > 0) {
                    this.places[p].GeoInfo.forEach(function (gi) {
                        isSelected = gi.School_District !== null ? gi.School_District.indexOf(place.Name) !== -1 ? true : isSelected : false;
                    });
                }
                else {
                    isSelected = this.places[p].Name === place.Name ? true : isSelected;
                }
            }
            else {
                isSelected = place.geoid === this.places[p].ResID ? true : isSelected;
                if (!isSelected) {
                    if (this.places[p].GeoInfo.length > 0) {
                        this.places[p].GeoInfo.forEach(function (gi) {
                            isSelected = gi.geoid.indexOf(place.geoid) !== -1 ? true : isSelected;
                        });
                    }
                }
            }
            if (this.isCountyLevel && this.places[p].TypeCategory !== 'Counties') {
                if (this.places[p].GeoInfo.length > 0) {
                    this.places[p].GeoInfo.forEach(function (gi) {
                        isSelected = gi.county_geoid === place.geoid ? true : isSelected;
                    });
                }
            }
        }
        return isSelected;
    };
    DataTileComponent.prototype.getCommunityName = function (pData) {
        var _this = this;
        var returnName = '';
        this.places.forEach(function (place) {
            if (_this.isSchool) {
                if (place.GeoInfo.length > 0) {
                    place.GeoInfo.forEach(function (gi) {
                        if (gi.School_District ? gi.School_District.indexOf(pData.Name) !== -1 : false) {
                            returnName = pData.Name + '<br><em><span style="color:#a7a7a7; font-size:.8em;">(' + (place.TypeCategory === 'Counties' ? 'in ' : 'for ') +
                                place.Name.trim() + ')</em></span> ';
                        }
                    });
                }
                else {
                    returnName = pData.Name === 'Statewide' ? 'Oregon' : pData.Name;
                }
            }
            else if (place.TypeCategory === 'Unincorporated Place' && (pData.geoid.split(',').indexOf(place.ResID) !== -1 || place.Desc.replace(' County', '').indexOf(pData.community) !== -1)) {
                if (_this.isCountyLevel) {
                    console.log('getcommunityname', place);
                    returnName = returnName === '' ?
                        place.GeoInfo.length > 0 ?
                            (place.GeoInfo[0].County + ' County<br><em><span style="color:#a7a7a7; font-size:.8em;">(contains ' + place.Name.trim() + ')</em></span>') :
                            (place.Desc.split(', ').length > 1 ?
                                place.Desc.split(', ')[1].split('~')[0] :
                                place.Desc) + '<br><em><span style="color:#a7a7a7; font-size:.8em;">(contains ' + place.Name.trim() + ')</em></span>' :
                        returnName.split(')</em></span>')[0] + ',' + place.Name.trim() + ')</em></span>';
                }
                else {
                    returnName = returnName === '' ? place.Desc.split('~')[0] + (place.ResID.length === 5 ? ' County' : '') + '<br><em><span style="color:#a7a7a7; font-size:.8em;">(contains ' + place.Name.trim() + ')</em></span>' : returnName.split(')</em></span>')[0] + ',' + place.Name.trim() + ')</em></span>';
                }
            }
            else if (_this.isCountyLevel && (place.TypeCategory === 'Incorporated City' || place.TypeCategory === 'Incorporated Town' || place.TypeCategory === 'Census Designated Place') && place.Desc.replace(' County', '') === pData.community) {
                returnName = returnName === '' ? pData.community + (pData.geoid.length === 5 ? ' County' : '') + '<br><em><span style="color:#a7a7a7; font-size:.8em;">(contains ' + place.Name.trim() + ')</em></span>' : returnName.split(')</em></span>')[0] + ',' + place.Name.trim() + ')</em></span>';
            }
        });
        return returnName === '' ? pData.community + (pData.geoid.length === 5 ? ' County' : '') : returnName;
    };
    DataTileComponent.prototype.ageSort = function (a, b) {
        if (b.Variable.indexOf('under 25') !== -1) {
            return 1000;
        }
        else if (a.Variable.indexOf('under 25') !== -1) {
            return -1000;
        }
        else {
            var x = a.Variable.split('-')[0].split('+')[0].replace('Males Age ', '').replace('Females Age ', '').replace('+', '').replace(' count', '').replace('owners ', '').replace('renters ', '');
            var y = b.Variable.split('-')[0].split('+')[0].replace('Males Age ', '').replace('Females Age ', '').replace('+', '').replace(' count', '').replace('owners ', '').replace('renters ', '');
            return x - y;
        }
    };
    DataTileComponent.prototype.incomeSort = function (a, b) {
        if (b.Variable.indexOf('< $10,000') !== -1) {
            return 1000;
        }
        else if (a.Variable.indexOf('< $10,000') !== -1) {
            return -1000;
        }
        else {
            var x = parseInt(a.Variable.split(' -')[0].replace('<', '').replace('>', '').replace('$', ''));
            var y = parseInt(b.Variable.split(' -')[0].replace('<', '').replace('>', '').replace('$', ''));
            return x - y;
        }
    };
    DataTileComponent.prototype.processCustomChartData = function (chartType) {
        var _this = this;
        var place_data_years = {};
        if (this.places.length === 0) {
            var Oregon = { Name: 'Oregon', ResID: '41', Type: 'Place', TypeCategory: 'State', Desc: '' };
            this.places.push(Oregon);
        }
        switch (this.indicator_info.ScriptName) {
            case 'PopulationPyramid':
            case 'PopulationPyramidEstimate':
            case 'PropOwnByAge':
            case 'PropOwnByAgeEstimate':
                this.places.forEach(function (place, pidx) {
                    var placeData1 = _this.placeTypeData.Data
                        .filter(function (data) {
                        return data.geoid ? data.geoid === place.ResID && data.Variable.indexOf(_this.indicator_info.ScriptName.indexOf('Pyramid') !== -1 ? 'Males' : 'owners') !== -1 : false;
                    }).sort(_this.ageSort);
                    var placeData2 = _this.placeTypeData.Data.filter(function (data) {
                        return data.geoid ? data.geoid === place.ResID && data.Variable.indexOf(_this.indicator_info.ScriptName.indexOf('Pyramid') !== -1 ? 'Females' : 'renters') !== -1 : false;
                    }).sort(_this.ageSort);
                    var placeData1Years = [];
                    var placeData2Years = [];
                    var dataYears = [];
                    var categories = [];
                    var maxValue = 0;
                    if (placeData1.length > 0) {
                        var counter = 0;
                        for (var col in placeData1[0]) {
                            if ($.isNumeric(col.substring(0, 1)) && col.indexOf('MOE') === -1) {
                                if (placeData1[0][col] !== null || placeData1[1][col] !== null) {
                                    if (pidx === 0) {
                                        _this._tickLabelsTime.push(col);
                                        _this._tickArray.push(counter);
                                    }
                                    dataYears.push(col);
                                    counter++;
                                }
                            }
                        }
                        dataYears.forEach(function (year, idx) {
                            var yearData1 = {
                                year: year,
                                community: place.Name,
                                dataCategory: _this.indicator_info.ScriptName.indexOf('Pyramid') !== -1 ? 'Males' : 'Owners',
                                data: [],
                                data_moe: []
                            };
                            var yearData2 = {
                                year: year,
                                community: place.Name,
                                dataCategory: _this.indicator_info.ScriptName.indexOf('Pyramid') !== -1 ? 'Females' : 'Renters',
                                data: [],
                                data_moe: []
                            };
                            var yearData1Sum = 0;
                            var yearData2Sum = 0;
                            placeData1.forEach(function (pdm) {
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
                                        .replace('owners ', ''));
                                }
                            });
                            placeData2.forEach(function (pdm) {
                                yearData2Sum += pdm[year] !== null ? parseFloat(pdm[year]) : 0;
                                yearData2.data.push(parseFloat(pdm[year]));
                                if (year.indexOf('-') !== -1) {
                                    yearData2.data_moe.push(parseFloat(pdm[year + '_MOE']));
                                }
                            });
                            yearData1.data = yearData1.data.map(function (data) {
                                var returnVal;
                                if (_this.indicator_info.ScriptName.indexOf('Pyramid') !== -1) {
                                    returnVal = data;
                                }
                                else {
                                    returnVal = (data / yearData1Sum) * 100;
                                }
                                maxValue = Math.abs(returnVal) > maxValue ? Math.abs(returnVal) : maxValue;
                                return returnVal;
                            });
                            yearData2.data = yearData2.data.map(function (data) {
                                var returnVal;
                                if (_this.indicator_info.ScriptName.indexOf('Pyramid') !== -1) {
                                    returnVal = data;
                                }
                                else {
                                    returnVal = (data / yearData1Sum) * 100;
                                }
                                maxValue = Math.abs(returnVal) > maxValue ? Math.abs(returnVal) : maxValue;
                                return returnVal;
                            });
                            console.log('propown', yearData1, yearData1Sum);
                            placeData1Years[year] = yearData1;
                            placeData2Years[year] = yearData2;
                        });
                    }
                    else {
                        console.log('no data for pyramid');
                    }
                    place_data_years[place.Name] = {
                        id: place.Name,
                        name: place.Name,
                        geoid: place.ResID,
                        maxVal: maxValue,
                        data: _this.indicator_info.ScriptName.indexOf('Pyramid') !== -1 ? {
                            males: placeData1Years,
                            females: placeData2Years
                        } : {
                            owners: placeData1Years,
                            renters: placeData2Years
                        },
                        years: _this._tickLabelsTime,
                        categories: categories
                    };
                    console.log('propown2', place_data_years);
                    _this.selectedCustomChartYear = dataYears[dataYears.length - 1];
                    _this.customChartYears = dataYears;
                });
                break;
            case 'IncomeHistogram':
            case 'ClientContacts211Info':
            case 'SocialServiceProviders211Info':
            case 'PovertyByRace':
                this.places.forEach(function (place, pidx) {
                    var placeData = _this.placeTypeData.Data
                        .filter(function (data) {
                        if (_this.isCountyLevel && place.GeoInfo.length > 0) {
                            console.log('december');
                            return place.GeoInfo[0].county_geoid === data.geoid;
                        }
                        else {
                            return data.geoid ? data.geoid === place.ResID : false;
                        }
                    })
                        .sort(_this.incomeSort);
                    var placeDataYears = [];
                    var dataYears = [];
                    var categories = [];
                    if (placeData.length > 0) {
                        var counter = 0;
                        for (var col in placeData[0]) {
                            if ($.isNumeric(col.substring(0, 1)) && col.indexOf('MOE') === -1) {
                                if (placeData[0][col] !== null) {
                                    if (pidx === 0) {
                                        _this._tickLabelsTime.push(col);
                                        _this._tickArray.push(counter);
                                    }
                                    dataYears.push(col);
                                    counter++;
                                }
                            }
                        }
                        dataYears.forEach(function (year, idx) {
                            var yearData = {
                                year: year,
                                community: place.Name,
                                data: [],
                                data_moe: []
                            };
                            placeData.forEach(function (pdm) {
                                if (_this.indicator_info.ScriptName.indexOf('211') !== -1 || _this.indicator_info.ScriptName === 'PovertyByRace') {
                                    yearData.data.push({
                                        name: pdm.Variable.replace(' Client Contacts', '').replace(' Providers', '').replace('Percentage of population group in poverty: ', ''),
                                        y: $.isNumeric(parseInt(pdm[year])) ? parseInt(pdm[year]) : null
                                    });
                                }
                                else {
                                    yearData.data.push(parseInt(pdm[year]));
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
                    }
                    else {
                        console.log('no data for income or 211 chart');
                    }
                    console.log('process custom chart poverty', categories);
                    place_data_years[place.Name] = {
                        id: place.Name,
                        name: place.Name,
                        geoid: place.ResID,
                        data: placeDataYears,
                        years: _this._tickLabelsTime,
                        categories: categories
                    };
                    console.log('process custom chart poverty', place_data_years[place.Name]);
                    _this.selectedCustomChartYear = dataYears[dataYears.length - 1];
                    _this.customChartYears = dataYears;
                });
                break;
            default:
                place_data_years = {};
                break;
        }
        return place_data_years;
    };
    DataTileComponent.prototype.processDataYear = function () {
        this.yearStartOffset = this.getStartYear();
        this.yearEndOffset = this.getEndYear();
        var place_data = [{}];
        var place_data_years = {};
        var place_data_years_moe = {};
        if (this.isCustomChart) {
            place_data_years = this.processCustomChartData(this.indicator.ScriptName);
            var chart_data = {
                place_data_years: place_data_years
            };
            this.dataStore.indicatorData[this.indicator].chart_data = chart_data;
        }
        else {
            console.log('place_data check', this.placeTypeData, this.dataStore[this.pluralize(this.selectedPlaceType)]);
            this.placeTypeData = this.getPlaceTypeData();
            for (var d = 0; d < this.placeTypeData.Data.length; d++) {
                var pData = this.placeTypeData.Data[d];
                var statewideFilter = ['Oregon', 'Statewide', 'Rural Oregon', 'Urban Oregon', 'California', 'Rural California', 'Urban California'];
                if (statewideFilter.indexOf(this.isSchool ? pData.Name : pData.community) === -1) {
                    place_data.push({
                        name: this.isSchool ? pData.Name : pData.community,
                        geoid: pData.geoid,
                        value: pData[this.selectedYear.Year] === -1 ? 0 : pData[this.selectedYear.Year],
                        year: this.selectedYear.Year,
                        id: this.isSchool ? pData.Name : pData.community,
                        selected: this.checkSelectedPlaceOnLoad(pData),
                        placeType: statewideFilter.indexOf(this.isSchool ? pData.Name : pData.community) === -1 ? this.translatePlaceTypes(this.selectedPlaceType) : 'Statewide'
                    });
                }
                var year_data = [];
                var year_data_moe = [];
                var prevYear;
                for (var y = 0; y < this.placeTypeData.Years.length; y++) {
                    var _year = this.placeTypeData.Years[y].Year;
                    if (y >= this.yearStartOffset && y <= this.placeTypeData.Years.length - this.yearEndOffset) {
                        var yearsToAdd = 0;
                        if (prevYear) {
                            var firstYr = prevYear.split('-')[0];
                            var secondYr = _year.split('-')[0];
                            yearsToAdd = parseInt(secondYr) - parseInt(firstYr);
                        }
                        for (var x = 0; x < yearsToAdd - 1; x++) {
                            year_data.push(null);
                            year_data_moe.push(null);
                        }
                        if (pData[_year] === '//') {
                            console.log('data suppressed');
                            year_data.push('Data suppressed');
                        }
                        else {
                            year_data.push($.isNumeric(pData[_year]) ? parseFloat(pData[_year]) : null);
                        }
                        if (_year.match('-')) {
                            year_data_moe.push([parseFloat(pData[_year]) - parseFloat(pData[_year + '_MOE']), parseFloat(pData[_year]) + parseFloat(pData[_year + '_MOE'])]);
                        }
                        else {
                            year_data_moe.push(null);
                        }
                        prevYear = _year;
                    }
                }
                place_data_years[this.isSchool ? pData.Name : pData.community] = {
                    id: this.isSchool ? pData.Name : pData.community,
                    name: this.isSchool ? pData.Name : pData.community,
                    geoid: pData.geoid,
                    data: year_data
                };
                place_data_years_moe[this.isSchool ? pData.Name : pData.community] = {
                    id: this.isSchool ? pData.Name : pData.community,
                    name: this.isSchool ? pData.Name : pData.community,
                    geoid: pData.geoid,
                    data: year_data_moe
                };
            }
            var chart_data = {
                place_data: place_data,
                place_data_years: place_data_years,
                place_data_years_moe: place_data_years_moe
            };
            if (this.tileType === 'map' && this.showMap) {
                this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].chart_data = chart_data;
            }
            else {
                this.dataStore.indicatorData[this.indicator].chart_data = chart_data;
            }
            if (this.tileType === 'map' && this.showMap) {
                for (var x = 0; x < this.selectedMapData.features.length; x++) {
                    var mData = this.selectedMapData.features[x];
                    var lookupResult = this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].chart_data.place_data.filter(function (place) {
                        return place.geoid === mData.properties.GEOID && place.value === null;
                    });
                    if (lookupResult.length === 1) {
                        this.county_map_no_data.push(mData);
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
    };
    DataTileComponent.prototype.processYearTicks = function () {
        var counter = 0;
        var counterTime = 0;
        var prevYear;
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
            for (var x = 1; x < yearsToAdd; x++) {
                if (y > this.yearStartOffset && y <= this.placeTypeData.Years.length - (this.yearEndOffset + 1)) {
                    this._tickLabels[counter] = (parseInt(prevYear.split('-')[0]) + x).toString();
                    this._tickArray.push(counter);
                    counter++;
                }
            }
            if (y >= this.yearStartOffset && y <= this.placeTypeData.Years.length - (this.yearEndOffset + 1)) {
                this._tickLabels[counter] = Year;
                this._tickArray.push(counter);
                this._tickLabelsTime[counterTime] = labelEveryThirdYear ? (labelYearCounter === 3 || counter === 0 ? Year : ' ') : (labelEveryYear ? Year : (labelYear ? Year : ' '));
                if (Year.match('-') && !this.isSchool) {
                    this.hasMOEs = true;
                }
                labelYearCounter = (labelThirdYear && labelYearCounter === 3) ? 1 : labelYearCounter + 1;
                this.selectedYearIndexArray[Year] = counter;
                counter++;
                counterTime++;
            }
            prevYear = Year;
            labelYear = !labelYear;
        }
        console.log('labelyear', this._tickArray, this._tickLabels, this.selectedYearIndexArray);
    };
    DataTileComponent.prototype.getStartYear = function () {
        var counter = 0;
        for (var y = 0; y < this.placeTypeData.Years.length; y++) {
            var hasData = false;
            for (var d = 0; d < this.placeTypeData.Data.length; d++) {
                console.log(this.placeTypeData.Data[d][this.placeTypeData.Years[y].Year]);
                if (this.placeTypeData.Data[d][this.placeTypeData.Years[y].Year] !== null) {
                    hasData = true;
                    break;
                }
            }
            if (hasData) {
                break;
            }
            else {
                counter++;
            }
        }
        return counter;
    };
    DataTileComponent.prototype.getEndYear = function () {
        var counter = 0;
        for (var y = this.placeTypeData.Years.length - 1; y > 0; y--) {
            var hasData = false;
            for (var d = 0; d < this.placeTypeData.Data.length; d++) {
                if (this.placeTypeData.Data[d][this.placeTypeData.Years[y].Year] !== null) {
                    hasData = true;
                    break;
                }
            }
            if (hasData) {
                break;
            }
            else {
                counter++;
            }
        }
        return counter;
    };
    DataTileComponent.prototype.getMinData = function (isMap, chartType) {
        var min;
        var notLogrithmic = false;
        var hasNegativevalues = false;
        console.log('checking chart_data', this.selectedPlaceType, this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].chart_data, this.dataStore);
        var chart_data = this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].chart_data;
        var pdy = $.extend(true, {}, isMap ? chart_data.place_data_years : this.hasMOEs ? chart_data.place_data_years_moe : chart_data.place_data_years);
        $.each(pdy, function () {
            if (this.geoid.length > 3) {
                var arr = $.grep(this.data, function (n) { return (n); });
                if (chartType && arr.length !== this.data.length) {
                    notLogrithmic = true;
                }
                var PlaceMin = isMap ? arr.sort(function (a, b) { return a - b; })[0] : this.hasMOEs ? arr.sort(function (a, b) { return a[1] - b[1]; })[0] : null;
                min = min === undefined ? isMap ? PlaceMin : this.hasMOEs ? PlaceMin[0] : min : min;
                if (isMap) {
                    min = min > PlaceMin ? PlaceMin : min;
                }
                else if (this.hasMOEs) {
                    min = min > PlaceMin[0] ? PlaceMin[0] : min;
                }
                else {
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
    };
    DataTileComponent.prototype.getMaxData = function (isMap) {
        if (this.indicator_info['Dashboard_Chart_Y_Axis_Max'] !== null) {
            return parseFloat(this.indicator_info['Dashboard_Chart_Y_Axis_Max']);
        }
        else {
            var max = 0;
            var chart_data = this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].chart_data;
            var pdy = $.extend(true, {}, isMap ? chart_data.place_data_years : this.hasMOEs ? chart_data.place_data_years_moe : chart_data.place_data_years);
            $.each(pdy, function () {
                if (this.geoid.length > 3) {
                    var arr = $.grep(this.data, function (n) { return (n); });
                    var PlaceMax = isMap ? arr.sort(function (a, b) { return b - a; })[0] : this.hasMOEs ? arr.sort(function (a, b) {
                        return b[1] - a[1];
                    })[0] : null;
                    if (isMap) {
                        max = parseFloat(max) < parseFloat(PlaceMax) ? parseFloat(PlaceMax) : parseFloat(max);
                    }
                    else if (this.hasMOEs) {
                        max = parseFloat(max) < parseFloat(PlaceMax[1]) ? parseFloat(PlaceMax[1]) : parseFloat(max);
                    }
                    else {
                        max = parseFloat(max) < parseFloat(PlaceMax) ? parseFloat(PlaceMax) : parseFloat(max);
                    }
                }
            });
            console.log('yaxismax', max);
            return max;
        }
    };
    DataTileComponent.prototype.formatData = function (val) {
        console.log('formattingdata', val);
        if (val === null) {
            return null;
        }
        if (val.match(/^[-+]?[1-9]\.[0-9]+e[-]?[1-9][0-9]*$/)) {
            var precision = this.getPrecision(val);
            val = parseFloat((+val).toFixed(precision));
        }
        if ($.isNumeric(val)) {
            console.log('data is numeric');
            return parseFloat(val);
        }
        else {
            console.log('data is not numeric!', val);
            return null;
        }
    };
    DataTileComponent.prototype.getPrecision = function (sval) {
        var arr = new Array();
        arr = sval.split('e');
        arr = arr[0].split('.');
        var precision = arr[1].length;
        return parseInt(precision);
    };
    DataTileComponent.prototype.formatValue = function (val, isLegend) {
        var returnVal = val;
        if (this.placeTypeData.Metadata[0].Variable_Represent !== null) {
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
                    break;
                case '2':
                    returnVal = this.addCommas((Math.round(parseFloat(val) * 100) / 100).toString());
                    break;
                case '$':
                    returnVal = '$' + this.formatAbvNumbers(val, isLegend, 1);
                    break;
                case '$0':
                    returnVal = '$' + (isLegend ? this.formatAbvNumbers(val, isLegend, 0) : this.addCommas((Math.round(parseFloat(val)).toString())));
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
    };
    DataTileComponent.prototype.formatAbvNumbers = function (val, isLegend, numDecimals) {
        return (val > 999999999 ? (this.addCommas((val / 1000000000).toFixed(isLegend ? (val / 1000000000) < 10 ? 1 : 0 : numDecimals)) + 'bn') : val > 999999 ? (this.addCommas((val / 1000000).toFixed(isLegend ? (val / 1000000) < 10 ? 1 : 0 : numDecimals)) + 'mil') : val > 999 ? (this.addCommas((val / 1000).toFixed(isLegend ? (val / 1000) < 10 ? 1 : 0 : numDecimals)) + 'k') : val);
    };
    DataTileComponent.prototype.pluralize = function (value) {
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
    };
    DataTileComponent.prototype.addCommas = function (nStr) {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    };
    DataTileComponent.prototype.toCamelCase = function (str) {
        return str !== null ? str.replace(/([^\W_]+[^\s-]*) */g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) : null;
    };
    DataTileComponent.prototype.gotoDetails = function () {
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
                    .replace(/\&/g, '%26'),
                places: this.placeNames
            }]);
        window.scrollTo(0, 0);
    };
    DataTileComponent.prototype.onTimeSliderChange = function (evt) {
    };
    DataTileComponent.prototype.onSelectedMapViewChange = function (evt) {
        if (this.selectedPlaceType !== this.translatePlaceTypes(evt)) {
            this.selectedPlaceType = this.translatePlaceTypes(evt);
            if (this.mapChart) {
                this.mapChart.showLoading();
            }
            this.checkDataStateForCharts('mapViewChange');
        }
    };
    DataTileComponent.prototype.reflowChart = function () {
        if (this.tileType !== 'map') {
            this.chart.reflow();
        }
    };
    DataTileComponent.prototype.zoomToPlace = function (evt, point) {
        this.mapChart.get(point).zoomTo();
    };
    DataTileComponent.prototype.getCollectionIcon = function (collection) {
        var collInfo = this.collections.filter(function (coll) { return coll.collection === collection; });
        return collInfo.length > 0 ? collInfo[0].icon_path : '';
    };
    DataTileComponent.prototype.openMoeDialog = function () {
        $('#moe-dialog').dialog('open');
    };
    DataTileComponent.prototype.ngOnInit = function () {
        this.defaultAdvChartOptions = this.defaultAdvChartOptions;
        this.defaultChartOptions.chart.spacingTop = this.viewType === 'advanced' ? 50 : this.defaultChartOptions.chart.spacingTop;
        if (this.tileType === 'map' && this.showMap) {
            for (var pt in this.dataStore) {
                this.dataStore[pt].indicatorData = {};
                this.dataStore[pt].mapData = {};
            }
        }
        else {
            this.collections = window.crt_collections ? window.crt_collections : [];
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
    };
    DataTileComponent.prototype.ngOnChanges = function (changes) {
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
    };
    DataTileComponent.prototype.ngOnDestroy = function () {
        if (this.subscription !== undefined) {
            this.subscription.unsubscribe();
        }
        if (this.geoSubscription !== undefined) {
            this.geoSubscription.unsubscribe();
        }
        if (this.dataSubscription !== undefined) {
            this.dataSubscription.unsubscribe();
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DataTileComponent.prototype, "indicator", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DataTileComponent.prototype, "tileType", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DataTileComponent.prototype, "viewType", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DataTileComponent.prototype, "featured", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], DataTileComponent.prototype, "related", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DataTileComponent.prototype, "_selectedYear", void 0);
    __decorate([
        core_1.ViewChild(hmap_menu_component_1.HmapMenuComponent), 
        __metadata('design:type', hmap_menu_component_1.HmapMenuComponent)
    ], DataTileComponent.prototype, "hMapMenu", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], DataTileComponent.prototype, "onChartDataUpdate", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], DataTileComponent.prototype, "onSelectedYearChange", void 0);
    DataTileComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'data-tile',
            templateUrl: 'data.tile.component.html',
            styleUrls: ['data.tile.component.css'],
            directives: [angular2_highcharts_1.CHART_DIRECTIVES, hmap_menu_component_1.HmapMenuComponent],
            providers: [http_1.JSONP_PROVIDERS, index_1.DataService, index_1.GeoJSONStoreService, index_1.GetGeoJSONService, index_1.SelectedDataService, index_1.PlaceTypeService, index_1.IndicatorDescService],
            pipes: [index_2.MapChartPlaceZoomPipe]
        }),
        __param(0, core_1.Inject(core_1.ElementRef)), 
        __metadata('design:paramtypes', [core_1.ElementRef, index_1.DataService, index_1.SelectedPlacesService, router_1.Router, index_1.GeoJSONStoreService, index_1.GetGeoJSONService, index_1.SelectedDataService, index_1.PlaceTypeService, index_1.IndicatorDescService])
    ], DataTileComponent);
    return DataTileComponent;
})();
exports.DataTileComponent = DataTileComponent;
angular2_highcharts_1.Highcharts.Legend.prototype.update = function (options) {
    this.options = angular2_highcharts_1.Highcharts.merge(this.options, options);
    this.chart.isDirtyLegend = true;
    this.chart.isDirtyBox = true;
    this.chart.redraw();
};
(function (H) {
    H.wrap(H.Chart.prototype, 'init', function (proceed) {
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
        var chart = this, options = chart.options, zoomType = options.chart.zoomType, container = chart.container, xAxis = chart.xAxis[0], extremes, dataMin, dataMax, min, max, selectFromPixels, selectToPixels, pixelDiff, valueDiff, newMin, newMax;
        if (zoomType === 'x') {
            H.addEvent(container, 'mousedown', function (e) {
                selectFromPixels = chart.pointer.normalize(e).chartX;
            });
            H.addEvent(container, 'mouseup', function (e) {
                selectToPixels = chart.pointer.normalize(e).chartX;
                pixelDiff = selectToPixels - selectFromPixels;
            });
            H.addEvent(chart, 'selection', function (e) {
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
}(angular2_highcharts_1.Highcharts));
//# sourceMappingURL=data.tile.component.js.map