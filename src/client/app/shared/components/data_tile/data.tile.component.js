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
    colors: ['#058DC7', '#50B432', '#ED561B']
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
        this.geoJSONStore = [];
        this.places = new Array();
        this.placeNames = '';
        this.placeTypes = [];
        this.selectedPlaceType = 'County';
        this.selectedYearIndexArray = {};
        this._tickArray = [];
        this._tickLabels = [];
        this._tickLabelsTime = [];
        this._tickArrayTime = [];
        this.hasDrillDowns = false;
        this.showMOES = true;
        this.county_no_data = [];
        this.county_map_no_data = [];
        this.animationCounter = -1;
        this.sliderState = 'play';
        this.isHandheld = false;
        this.isSliderInit = false;
        this.isCountyLevel = false;
        this.isStatewide = false;
        this.isNotCombinable = false;
        this.hasCombined = false;
        this.isTOP = false;
        this.is10yr = false;
        this.collections = [];
        this.indicator_collections = [];
        this.xAxisCategories = {};
        this.defaultChartOptions = {
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
        this.defaultAdvChartOptions = {
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
        this.selectedMapPoints = [];
        this.elementRef = elementRef;
        this.tempPlaces = new Array();
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
    DataTileComponent.prototype.saveInstance = function (chartInstance) {
        var _this = this;
        console.log('saving chart instance');
        if (this.tileType === 'graph') {
            this.chart = chartInstance;
            this.chart.showLoading();
        }
        else {
            this.mapChart = chartInstance;
            this.mapChart.showLoading();
        }
        this.checkScreenSize();
        this._indicatorDescService.getIndicator(this.indicator).subscribe(function (indicatorDesc) {
            var indicator_info = indicatorDesc.Desc[0];
            if (indicator_info) {
                _this.isStatewide = indicator_info.Geog_ID === 8 ? true : false;
                _this.isCountyLevel = indicator_info.CountyLevel;
                _this.isTOP = indicator_info.isTOP;
                _this.is10yr = indicator_info.is10yrPlan;
                _this.indicator_collections = indicator_info.collections ? indicator_info.collections.split(', ') : [];
            }
            _this.subscription = _this._selectedPlacesService.selectionChanged$.subscribe(function (data) {
                console.log('selected places subscribe throwing event');
                console.log(data);
                _this.onPlacesChanged(data);
            }, function (err) { return console.error(err); }, function () { return console.log('done with subscribe event places selected'); });
            if (_this.tileType === 'map') {
                _this.geoSubscription = _this._geoStore.selectionChanged$.subscribe(function (data) {
                    _this.geoJSONStore = data;
                    console.log('new geojson file loaded');
                    console.log(data);
                }, function (err) { return console.error(err); }, function () { return console.log('done loading geojson'); });
            }
            _this.dataSubscription = _this._selectedDataService.selectionChanged$.subscribe(function (data) {
                _this.onSelectedDataChanged(data);
            }, function (err) { return console.error(err); }, function () { return console.log('done with subscribe event places selected'); });
        }, function (err) { return console.log('error getting indicator description', err); }, function () { return console.log('loaded the indicator description in data tile'); });
        var chartScope = this;
        angular2_highcharts_1.Highcharts.wrap(angular2_highcharts_1.Highcharts.Point.prototype, 'select', function (proceed) {
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));
            if (chartScope.tileType === 'map') {
                var points = chartScope.mapChart.getSelectedPoints();
                chartScope.selectedMapPoints = points;
                var pointsAsPlacesForBin = [];
                for (var p = 0; p < points.length; p++) {
                    var place = points[p];
                    var binPlace = void 0;
                    var isInBin = false;
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
                }
                pointsAsPlacesForBin = pointsAsPlacesForBin.filter(function (place, index, self) { return self.findIndex(function (t) { return t.ResID === place.ResID && t.Name === place.Name; }) === index; });
                console.log('adding from map', chartScope.tileType, pointsAsPlacesForBin);
                chartScope._selectedPlacesService.setAllbyPlaceType(pointsAsPlacesForBin, chartScope.selectedPlaceType);
            }
        });
    };
    DataTileComponent.prototype.onPlacesChanged = function (selectedPlaces) {
        console.log('adding DataTile place change', selectedPlaces);
        this.places = selectedPlaces;
        this.placeNames = '';
        if (this.tempPlaces.length !== this.places.length) {
            console.log('temp place not the same as place length, adding ...');
            for (var x = 0; x < this.places.length; x++) {
                console.log('place: ', this.places[x]);
                if (this.tempPlaces.indexOf(this.places[x]) === -1) {
                    this.selectedPlaceType = this.isCountyLevel ? 'Counties' : this.translatePlaceTypes(this.places[x].TypeCategory);
                    console.log('selectedPlaceType set:', this.selectedPlaceType);
                }
                this.tempPlaces.push(this.places[x]);
                this.placeNames += encodeURIComponent(JSON.stringify(this.places[x]));
                this.placeNames += (x < this.places.length - 1) ? ',' : '';
            }
        }
        this.checkDataStateForCharts();
    };
    DataTileComponent.prototype.checkDataStateForCharts = function (source) {
        console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
        var loadingGeoJSON = this.tileType === 'map' ? this.checkLoadGeoJSON() : false;
        if (this.tileType === 'graph') {
            this.getPlaceTypes('graph');
        }
        var loadMoreData = this.tileType === 'graph' ? true : this.checkUpdateData();
        if (!loadingGeoJSON && loadMoreData) {
            console.log('need to load data.  chart type: ', this.tileType);
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
                }
                else {
                    console.log('no siree');
                }
            }
            else {
                this.getData();
            }
        }
        else if (!loadingGeoJSON) {
            console.log('NEED TO UPDATE MAP/CHART');
            if (this.tileType === 'map') {
                var selectedPlaces = this.mapChart.getSelectedPoints();
                for (var s = 0; s < selectedPlaces.length; s++) {
                    console.log('checking selected place');
                    console.log(selectedPlaces[s]);
                    var inSelectedPlaces = false;
                    for (var z = 0; z < this.places.length; z++) {
                        inSelectedPlaces = (this.places[z].Name.replace(' County', '') === selectedPlaces[s].id.replace(' County', '') && this.places[z].ResID === selectedPlaces[s].geoid) ? true : inSelectedPlaces;
                    }
                    console.log(inSelectedPlaces);
                    if (!inSelectedPlaces) {
                        selectedPlaces[s].select(false, true);
                    }
                }
                if (this.places.length !== this.mapChart.getSelectedPoints().length) {
                    console.log('Place length is different');
                    for (var p = 0; p < this.places.length; p++) {
                        var place = this.places[p];
                        var isSelected = false;
                        for (var _i = 0, _a = this.mapChart.getSelectedPoints(); _i < _a.length; _i++) {
                            var sp = _a[_i];
                            isSelected = place.ResID === sp.geoid ? true : isSelected;
                        }
                        console.log('is selected' + isSelected);
                        if (!isSelected && place.TypeCategory !== 'State') {
                            var ptIndex = void 0;
                            for (var pt = 0; pt < this.mapChart.series[0].data.length; pt++) {
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
                }
            }
            else {
                this.createGraphChart();
            }
        }
    };
    DataTileComponent.prototype.getPlaceTypes = function (source) {
        var geoJSON_to_load = [];
        for (var x = 0; x < this.places.length; x++) {
            var placeTypeLoaded = false;
            for (var g = 0; g < this.geoJSONStore.length; g++) {
                if (this.places[x].TypeCategory !== 'State') {
                    placeTypeLoaded = this.translatePlaceTypes(this.places[x].TypeCategory) === this.geoJSONStore[g].layerId ? true : placeTypeLoaded;
                }
                else {
                    placeTypeLoaded = true;
                }
            }
            if (!placeTypeLoaded && ((this.isCountyLevel && this.places[x].TypeCategory === 'County') || !this.isCountyLevel)) {
                geoJSON_to_load.push(this.places[x].TypeCategory);
                this.placeTypes.push(source ? this.translatePlaceTypes(this.places[x].TypeCategory) : this.places[x].TypeCategory);
            }
        }
        return geoJSON_to_load;
    };
    DataTileComponent.prototype.checkLoadGeoJSON = function () {
        var _this = this;
        var loadingGeoJSON = false;
        var geoJSON_to_load = this.getPlaceTypes();
        var selPTCheck = geoJSON_to_load.filter(function (layer) { return _this.translatePlaceTypes(layer) === _this.selectedPlaceType; });
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
            console.log('PLACE TYPE NOT LAODED');
            geoJSON_to_load.push('oregon_siskiyou_boundary');
        }
        if (geoJSON_to_load.length > 0) {
            if (this.placeTypeGeoYears === undefined) {
                this._placeTypesService.get().subscribe(function (data) {
                    _this.placeTypeGeoYears = data;
                    _this.getGeoJSON(geoJSON_to_load);
                });
            }
            else {
                this.getGeoJSON(geoJSON_to_load);
            }
            loadingGeoJSON = true;
        }
        return loadingGeoJSON;
    };
    DataTileComponent.prototype.getGeoJSON = function (placeTypeToLoad) {
        var _this = this;
        for (var _i = 0; _i < placeTypeToLoad.length; _i++) {
            var pt = placeTypeToLoad[_i];
            this._geoService.getByPlaceType(this.translatePlaceTypes(pt), this.placeTypeGeoYears).subscribe(function (data) {
                console.log('got response from NEWWWWWWWWWWWWWWWWWWWWWWW geoservice');
                console.log(data);
                if (data.length > 0) {
                    var mapData = { layerId: data[0].layerType, features: data };
                    _this._geoStore.add(mapData);
                    _this.updateDataStore(mapData, 'mapData');
                    console.log('got geojson, updated data store and checking place type to get indicator data');
                    console.log(_this.selectedPlaceType, data);
                    if (_this.selectedPlaceType === data[0].layerType) {
                        _this.getData();
                    }
                }
            });
        }
    };
    DataTileComponent.prototype.getData = function () {
        var _this = this;
        var geoids = '';
        var selectedPlaces = this.places;
        if (selectedPlaces.length !== 0) {
            for (var x = 0; x < selectedPlaces.length; x++) {
                geoids += selectedPlaces[x].ResID;
                if (x !== selectedPlaces.length - 1) {
                    geoids += ',';
                }
            }
        }
        else {
            geoids = '41';
        }
        if (this.tileType === 'map') {
            var placeTypes = '';
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
            this._dataService.getAllbyGeoType(placeTypes, this.indicator).subscribe(function (data) {
                _this._selectedDataService.add(data);
            }, function (err) { return console.error(err); }, function () { return console.log('done loading data for map'); });
        }
        else {
            var combinedGroups = this.checkCombineGroups();
            var indicatorForService = this.indicator.replace(/\%28/g, '(')
                .replace(/\%29/g, ')')
                .replace(/\%2C/g, ',')
                .replace(/\%24/g, '$')
                .replace(/\+/g, '%2B');
            if (combinedGroups.length > 0) {
                this._dataService.getIndicatorDetailDataWithMetadata(geoids, indicatorForService).subscribe(function (data) {
                    var combinedData = _this.processCombinedData(data);
                    _this.updateDataStore([combinedData], 'indicator');
                    _this.onChartDataUpdate.emit(combinedData);
                    _this.createGraphChart();
                });
            }
            else {
                console.log('geoids for data service', geoids);
                this._dataService.getIndicatorDataWithMetadata(geoids, indicatorForService).subscribe(function (data) {
                    console.log('regular indicator data', data);
                    _this.updateDataStore([data], 'indicator');
                    _this.onChartDataUpdate.emit(data);
                    _this.createGraphChart();
                }, function (err) { return console.error(err); }, function () { return console.log('done loading data for graph'); });
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
                if (idx === groupNames.length - 1 && groupArray.length > 1) {
                    combineArray.push(groupArray);
                }
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
            for (var _i = 0; _i < groups.length; _i++) {
                var group = groups[_i];
                var combinedGroupData = new Object;
                combinedGroupData.community = group[0].GroupName;
                combinedGroupData.Variable = group[0].Variable;
                combinedGroupData.geoid = '';
                var multiplyBy = parseInt(data.Metadata[0].MultiplyBy);
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
                        var numValue = placeData[0][year.Year + '_N'];
                        var denomValue = placeData[0][year.Year + '_D'];
                        var numMOEValue = isACS ? placeData[0][year.Year + '_MOE_N'] : null;
                        var denomMOEValue = isACS ? placeData[0][year.Year + '_MOE_D'] : null;
                        combinedNumerators = numValue !== '' && numValue !== null ? (combinedNumerators + parseFloat(numValue)) : combinedNumerators;
                        combinedDenoms = denomValue !== '' && denomValue !== null ? (combinedDenoms + parseFloat(denomValue)) : combinedDenoms;
                        if (isACS) {
                            combinedNumMOEs = numMOEValue !== '' && numMOEValue !== null ? (combinedNumMOEs + parseFloat(numMOEValue)) : combinedNumMOEs;
                            combinedDenomMOEs = denomMOEValue !== '' && denomMOEValue !== null ? (combinedDenomMOEs + parseFloat(denomValue)) : combinedDenomMOEs;
                        }
                    }
                    combinedDenoms = combinedDenoms === 0 || combinedDenoms === null ? 1 : combinedDenoms;
                    combinedGroupData[year.Year] = combinedNumerators / combinedDenoms * multiplyBy;
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
                if (this.dataStore[this.pluralize(this.places[d].TypeCategory)].indicatorData !== undefined) {
                    console.log('already have this type data');
                    console.log(this.dataStore[this.pluralize(this.places[d].TypeCategory)]);
                }
                else {
                    loadMoreData = true;
                }
            }
        }
        if (this.dataStore[this.selectedPlaceType] !== undefined) {
            if (this.dataStore[this.selectedPlaceType].indicatorData === undefined) {
                loadMoreData = true;
            }
        }
        return loadMoreData;
    };
    DataTileComponent.prototype.onSelectedDataChanged = function (data) {
        console.log('Community Data throwing event');
        this.updateDataStore(data, 'indicator');
        if (data.length > 0) {
            console.log('giddy up');
            console.log(this.dataStore);
            console.log(this.selectedPlaceType);
            this.placeTypeData = this.dataStore[this.selectedPlaceType].indicatorData[this.indicator].crt_db;
            this.offsetYear = this.getDefaultYear();
            this.selectedYear = this.placeTypeData.Years[data[0].Years.length - this.offsetYear];
            if (this.tileType === 'map') {
                console.log('on selected data changed');
                console.log(this.geoJSONStore);
                this.selectedMapData = this.getSelectedMapData();
            }
            this.processDataYear();
            this.processYearTicks();
            this.selectedYearIndex = this._tickArray.length - this.offsetYear;
            this.hasDrillDowns = this.placeTypeData.Metadata[0].Sub_Topic_Name !== 'none' ? true : false;
            if (this.tileType === 'map') {
                this.initMapChart();
                if (!this.isSliderInit) {
                    this.setupTimeSlider();
                    this.isSliderInit = true;
                }
            }
        }
        else {
            console.log('DATA SUBSCRIPTION thinks there is no data');
        }
    };
    DataTileComponent.prototype.updateDataStore = function (data, dataType) {
        if (dataType === 'indicator') {
            for (var d = 0; d < data.length; d++) {
                var indicatorData = {};
                indicatorData[this.indicator] = { crt_db: data[d] };
                if (data[d].Metadata.length > 0) {
                    var metadata = data[d].Metadata[0];
                    this.isStatewide = metadata.Variable_Geog_Desc === 'State' ? true : false;
                    this.isCountyLevel = metadata.CountyLevel;
                    this.isNotCombinable = metadata.isPreCalc && !this.isStatewide && this.hasCombined;
                }
                if (this.tileType === 'map') {
                    if (this.dataStore[this.pluralize(data[d].GeoTypes[0].geoType).toString()].indicatorData[this.indicator] === undefined) {
                        this.dataStore[this.pluralize(data[d].GeoTypes[0].geoType).toString()].indicatorData = indicatorData;
                    }
                }
                else {
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
        if (this.tileType === 'map') {
            return this.dataStore[this.selectedPlaceType].indicatorData[this.indicator].chart_data.place_data;
        }
        else {
            return this.dataStore.indicatorData[this.indicator].chart_data.place_data;
        }
    };
    DataTileComponent.prototype.getSelectedMapData = function () {
        var _this = this;
        var selectedGeoJSONType = this.geoJSONStore.filter(function (data) { return data.layerId === _this.pluralize(_this.selectedPlaceType); });
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
            max: this.placeTypeData.Years.length - 1,
            value: this.placeTypeData.Years.length - 1,
            tickInterval: 1,
            step: 1,
            autoScaleSlider: false,
            tickArray: this._tickArray,
            tickLabels: this._tickLabelsTime,
            change: function (event, ui) {
                sliderScope.selectedYear = sliderScope.placeTypeData.Years[ui.value];
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
                sliderScope.mapChart.series[seriesIndex].setData(data);
            }
        });
    };
    DataTileComponent.prototype.onPlayBtnClick = function (evt) {
        var runScope = this;
        var runInterval = setInterval(runCheck, 2000);
        function runCheck() {
            if (runScope.sliderState === 'pause') {
                runScope.animationCounter = runScope.animationCounter < (runScope.placeTypeData.Years.length - 1) ? ++runScope.animationCounter : 0;
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
            case 'Cities':
                return 'Places';
            case 'Census Tract':
            case 'Census Tracts':
            case 'Unicorporated Place':
                return 'Tracts';
            default:
                return placeType;
        }
    };
    DataTileComponent.prototype.initMapChart = function () {
        var mapScope = this;
        this.mapChart.legend.title.attr({ text: this.placeTypeData.Metadata[0]['Y-Axis'] ? this.placeTypeData.Metadata[0]['Y-Axis'] : '' });
        this.mapChart.tooltip.options.formatter = function () {
            var displayValue = mapScope.formatValue(this.point.value, false) + '</b>';
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
                    var SeriesName = this.point.series.name.split(':').length > 1 ? this.point.series.name.split(':')[0] + ':<br />' + this.point.series.name.split(':')[1] : this.point.series.name;
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
        colorAxis.update({
            type: this.getMinData(true, true) > 0 ? 'logarithmic' : null,
            min: this.getMinData(true),
            max: this.getMaxData(true),
            endOnTick: false,
            startOnTick: true,
            labels: {
                formatter: function () {
                    return mapScope.formatValue(this.value, true);
                }
            }
        });
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
                color: 'rgba(0,128,0,0.1)',
                negativeColor: 'rgba(128,0,0,0.1)',
                mapData: this.dataStore.Boundary.mapData.features[0]
            };
            this.mapChart.addSeries(boundarySeries);
            ptSeriesIndexes.push(this.mapChart.series.length - 1);
        }
        var series = {
            borderColor: 'white',
            data: this.getPlaceData(),
            mapData: this.getSelectedMapData(),
            joinBy: ['NAME', 'name'],
            name: this.indicator + this.selectedPlaceType + ' (' + this.selectedYear.Year + ')',
            allowPointSelect: true,
            cursor: 'pointer',
            states: {
                select: {
                    color: '#BADA55',
                },
                hover: {
                    color: '#BADA55'
                }
            }
        };
        this.mapChart.addSeries(series, true);
        this.mapChart.series[this.selectedPlaceType === 'Places' ? 1 : 0].mapData = this.getSelectedMapData();
        this.mapChart.series[this.selectedPlaceType === 'Places' ? 1 : 0].setData(this.dataStore[this.selectedPlaceType].indicatorData[this.indicator].chart_data.place_data);
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
        this.mapChart.redraw();
        this.mapChart.hideLoading();
        this.selectedMapPoints = this.mapChart.getSelectedPoints();
    };
    DataTileComponent.prototype.createGraphChart = function () {
        this.placeTypeData = this.dataStore.indicatorData[this.indicator].crt_db;
        this.offsetYear = this.offsetYear === undefined ? this.getDefaultYear() : this.offsetYear;
        this.selectedYear = this.placeTypeData.Years[this.placeTypeData.Years.length - this.offsetYear];
        this.processDataYear();
        this.processYearTicks();
        this.selectedYearIndex = this._tickArray.length - this.offsetYear;
        this.Data = this.placeTypeData.Data;
        if (this.placeTypeData.Metadata.length > 0) {
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
            this.chart.tooltip.options.formatter = function () {
                var hoveredPlace = this.series.name
                    .replace(' County', '')
                    .replace(' School District', '')
                    .replace(' Margin of Error', '');
                if (this.series.name.match('Error')) {
                    return false;
                }
                else {
                    var displayValue = chartScope.formatValue(this.y, false) + '</b>';
                    if (this.x.match('-')) {
                        var value1 = parseFloat(chartScope.dataStore.indicatorData[chartScope.indicator].chart_data.place_data_years_moe[hoveredPlace].data[chartScope.selectedYearIndexArray[this.x]][1]);
                        var value2 = parseFloat(chartScope.dataStore.indicatorData[chartScope.indicator].chart_data.place_data_years_moe[hoveredPlace].data[chartScope.selectedYearIndexArray[this.x]][0]);
                        var moeValue = (value1 - value2) / 2;
                        displayValue += '<span style="font-size:8px">  (+/- ' + chartScope.formatValue(moeValue, false) + ' )</span>';
                    }
                    return '<span style="fill: ' + this.series.color + ';"> ● </span><span style="font-size:10px"> ' + this.point.series.name + ' (' + this.x + ')</span><br/><span><b>' + displayValue + '</span><br/>';
                }
            };
            var indicatorYaxis = this.placeTypeData.Metadata[0]['Y-Axis'] !== null ? this.placeTypeData.Metadata[0]['Y-Axis'] : this.indicator;
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
            var title = this.placeTypeData.Metadata[0]['Dashboard_Chart_Title'] !== null ? this.placeTypeData.Metadata[0]['Dashboard_Chart_Title'] : this.indicator;
            this.chart.setTitle({
                text: this.viewType === 'basic' ? title.replace('<br>', ' ') : null,
                align: this.viewType === 'basic' ? 'left' : null,
                style: {
                    fontSize: '1.25em',
                    fontWeight: '200'
                },
                widthAdjust: -10,
                x: -30
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
    };
    DataTileComponent.prototype.addSeriesDataToGraphChart = function (mapPlaces) {
        var _this = this;
        while (this.chart.series.length > 0) {
            this.chart.series[0].remove(false);
        }
        var oregonGeoids = ['41', '41r', '41u'];
        var californiaGeoids = ['06', '06r', '06u'];
        var sortedPlaceData = this.Data.sort(function (a, b) { return b.geoid.localeCompare(a.geoid); });
        sortedPlaceData.forEach(function (pd) {
            var isOregon = oregonGeoids.indexOf(pd.geoid) !== -1 ? true : false;
            var isCalifornia = californiaGeoids.indexOf(pd.geoid) !== -1 ? true : false;
            var isState = isOregon || isCalifornia ? true : false;
            var isCombined = pd.geoid === '';
            _this.chart.addSeries({
                id: pd.community + pd.geoid,
                name: pd.community + (pd.geoid.length === 5 ? ' County' : ''),
                type: 'line',
                lineWidth: isState ? 4 : 2,
                lineColor: isState ? '#A3A3A4' : null,
                lineOpacity: 1.0,
                data: _this.dataStore.indicatorData[_this.indicator].chart_data.place_data_years[pd.community].data,
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
                    radius: _this.placeTypeData.Years.length > 10 ? 3.5 : 4,
                    symbol: 'circle'
                }
            }, true);
            if (_this.hasMOEs) {
                _this.chart.addSeries({
                    name: pd.community + pd.geoid + ' Margin of Error',
                    whiskerLength: 10,
                    whiskerColor: 'gray',
                    stemColor: 'gray',
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
        if (this.chart) {
            this.chart.legend.update(this.setLegendOptions());
            var runInterval = setInterval(runCheck, 1050);
            var resizeScope = this;
            function runCheck() {
                var newWidth = resizeScope.elementRef.nativeElement.offsetWidth - 100 > $('.map-chart').width() ? resizeScope.elementRef.nativeElement.offsetWidth - 100 : $('.map-chart').width();
                $('.ui-slider-wrapper').css('width', newWidth - 93 + 'px');
                clearInterval(runInterval);
            }
        }
    };
    DataTileComponent.prototype.setLegendOptions = function () {
        return {
            width: this.viewType === 'basic' ? this.elementRef.nativeElement.offsetWidth - 100 : 400,
            itemWidth: this.viewType === 'basic' ? this.elementRef.nativeElement.offsetWidth - 40 : 200,
            itemStyle: {
                width: this.viewType === 'basic' ? this.elementRef.nativeElement.offsetWidth - 60 : 180,
                color: '#4d4d4d'
            },
            title: {
                text: this.isStatewide ? null : 'LEGEND: <span style="font-size: 9px; color: #666; font-weight: normal">(Click to hide series in chart)</span>'
            }
        };
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
            isSelected = place.geoid === this.places[p].ResID ? true : isSelected;
        }
        return isSelected;
    };
    DataTileComponent.prototype.processDataYear = function () {
        var place_data = [{}];
        var place_data_years = {};
        var place_data_years_moe = {};
        for (var d = 0; d < this.placeTypeData.Data.length; d++) {
            var pData = this.placeTypeData.Data[d];
            var statewideFilter = ['Oregon', 'Rural Oregon', 'Urban Oregon', 'California', 'Rural California', 'Urban California'];
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
            var year_data = [];
            var year_data_moe = [];
            var prevYear;
            for (var y = 0; y < this.placeTypeData.Years.length; y++) {
                var _year = this.placeTypeData.Years[y].Year;
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
                if (_year.match('-')) {
                    year_data_moe.push([parseFloat(pData[_year]) - parseFloat(pData[_year + '_MOE']), parseFloat(pData[_year]) + parseFloat(pData[_year + '_MOE'])]);
                }
                else {
                    year_data_moe.push(null);
                }
                year_data.push($.isNumeric(pData[_year]) ? parseFloat(pData[_year]) : null);
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
        var chart_data = {
            place_data: place_data,
            place_data_years: place_data_years,
            place_data_years_moe: place_data_years_moe
        };
        if (this.tileType === 'map') {
            this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].chart_data = chart_data;
        }
        else {
            this.dataStore.indicatorData[this.indicator].chart_data = chart_data;
        }
        if (this.tileType === 'map') {
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
    };
    DataTileComponent.prototype.processYearTicks = function () {
        var counter = 0;
        var counterTime = 0;
        var prevYear;
        var labelEveryYear = this.placeTypeData.Years.length > 10 ? false : true;
        var labelEveryThirdYear = this.placeTypeData.Years.length > 20 ? true : false;
        var labelYear = true;
        var labelThirdYear = true;
        var labelYearCounter = 1;
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
    };
    DataTileComponent.prototype.getDefaultYear = function () {
        var counter = 0;
        for (var y = this.placeTypeData.Years.length - 1; y > 0; y--) {
            counter++;
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
        }
        return counter;
    };
    DataTileComponent.prototype.getMinData = function (isMap, chartType) {
        var min;
        var notLogrithmic = false;
        var chart_data = this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].chart_data;
        var pdy = $.extend(true, {}, isMap ? chart_data.place_data_years : this.hasMOEs ? chart_data.place_data_years_moe : chart_data.place_data_years);
        $.each(pdy, function () {
            if (this.geoid.length > 4) {
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
            }
        });
        return notLogrithmic ? 0 : min < 10 ? 0 : min;
    };
    DataTileComponent.prototype.getMaxData = function (isMap) {
        var max = 0;
        var chart_data = this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].chart_data;
        var pdy = $.extend(true, {}, isMap ? chart_data.place_data_years : this.hasMOEs ? chart_data.place_data_years_moe : chart_data.place_data_years);
        $.each(pdy, function () {
            if (this.geoid.length > 4) {
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
        return max;
    };
    DataTileComponent.prototype.formatValue = function (val, isLegend) {
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
                break;
            case '2':
                returnVal = this.addCommas((Math.round(parseFloat(val) * 100) / 100).toString());
                break;
            case '$':
                returnVal = '$' + this.formatAbvNumbers(val, isLegend, 1);
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
    };
    DataTileComponent.prototype.formatAbvNumbers = function (val, isLegend, numDecimals) {
        return (val > 999999999 ? (this.addCommas((val / 1000000000).toFixed(isLegend ? (val / 1000000000) < 10 ? 1 : 0 : numDecimals)) + 'bn') : val > 999999 ? (this.addCommas((val / 1000000).toFixed(isLegend ? (val / 1000000) < 10 ? 1 : 0 : numDecimals)) + 'mil') : val > 999 ? (this.addCommas((val / 1000).toFixed(isLegend ? (val / 1000) < 10 ? 1 : 0 : numDecimals)) + 'k') : val);
    };
    DataTileComponent.prototype.pluralize = function (value) {
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
        this._router.navigate(['Explore', { indicator: encodeURI(this.indicator.replace(/\(/g, '%28').replace(/\)/g, '%29')).replace('%2528', '%28').replace('%2529', '%29'), places: this.placeNames }]);
        window.scrollTo(0, 0);
    };
    DataTileComponent.prototype.onTimeSliderChange = function (evt) {
    };
    DataTileComponent.prototype.onSelectedMapViewChange = function (evt) {
        if (this.selectedPlaceType !== this.translatePlaceTypes(evt)) {
            this.selectedPlaceType = this.translatePlaceTypes(evt);
            this.mapChart.showLoading();
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
    DataTileComponent.prototype.ngOnInit = function () {
        console.log(this.defaultAdvChartOptions);
        this.defaultChartOptions.title = { text: this.indicator };
        this.defaultChartOptions.chart.spacingTop = this.viewType === 'advanced' ? 50 : this.defaultChartOptions.chart.spacingTop;
        if (this.tileType === 'map') {
            for (var pt in this.dataStore) {
                this.dataStore[pt].indicatorData = {};
                this.dataStore[pt].mapData = {};
            }
        }
        else {
            this.collections = window.crt_collections;
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
        core_1.Output(), 
        __metadata('design:type', Object)
    ], DataTileComponent.prototype, "onChartDataUpdate", void 0);
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