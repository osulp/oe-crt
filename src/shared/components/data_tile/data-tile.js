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
var core_1 = require('angular2/core');
var angular2_highcharts_1 = require('angular2-highcharts');
var Highchmap = require('highcharts/modules/map');
var HighchartsMore = require('highcharts/highcharts-more');
var $jq = require('jquery');
var hmap_menu_1 = require('./hmap-menu/hmap-menu');
var http_1 = require('angular2/http');
var indicator_desc_service_1 = require('../../services/indicators/indicator.desc.service');
var data_service_1 = require('../../services/data/data.service');
var selected_places_service_1 = require('../../services/places/selected-places.service');
var selected_data_service_1 = require('../../services/data/selected-data.service');
var router_1 = require('angular2/router');
var geojson_store_service_1 = require('../../services/geojson/geojson_store.service');
var geojson_service_1 = require('../../services/geojson/geojson.service');
var place_types_service_1 = require('../../services/place-types/place-types.service');
angular2_highcharts_1.Highcharts.setOptions({
    colors: ['#058DC7', '#50B432', '#ED561B']
});
Highchmap(angular2_highcharts_1.Highcharts);
HighchartsMore(angular2_highcharts_1.Highcharts);
var DataTileCmp = (function () {
    function DataTileCmp(elementRef, _dataService, _selectedPlacesService, _indicatorDescService, _router, _geoStore, _geoService, _selectedDataService, _placeTypesService) {
        this._dataService = _dataService;
        this._selectedPlacesService = _selectedPlacesService;
        this._indicatorDescService = _indicatorDescService;
        this._router = _router;
        this._geoStore = _geoStore;
        this._geoService = _geoService;
        this._selectedDataService = _selectedDataService;
        this._placeTypesService = _placeTypesService;
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
        this.county_no_data = [];
        this.county_map_no_data = [];
        this.animationCounter = -1;
        this.sliderState = 'play';
        this.isHandheld = false;
        this.xAxisCategories = {};
        this.defaultChartOptions = {
            chart: {
                type: 'line',
                spacingLeft: 0,
                spacingRight: 30,
                spacingTop: 20,
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
            legend: {
                width: this.isHandheld ? $jq(window).width() - 40 : 400,
                itemWidth: this.isHandheld ? $jq(window).width() - 40 : 200,
                itemStyle: {
                    width: this.isHandheld ? $jq(window).width() - 60 : 180,
                    color: '#4d4d4d'
                },
                title: {
                    text: 'LEGEND: <span style="font-size: 9px; color: #666; font-weight: normal">(Click to hide series in chart)</span>'
                },
            },
            title: {},
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
        this.mapSeriesStore = {};
        this.elementRef = elementRef;
        this.tempPlaces = new Array();
        this.xAxisCategories = [];
        this.Data = [];
        this.mapOptions = {
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
                floating: true,
                verticalAlign: 'top',
                y: 50
            },
            credits: {
                enabled: true,
                text: 'Maps and Charts provided by Oregon Explorer and OSU Rural Studies Program',
                href: 'http://oregonexplorer.info/rural'
            },
            mapNavigation: {
                enabled: true
            },
            margin: [0, 0, 0, 0],
            spacing: [0, 0, 0, 0],
            colorAxis: {},
            tooltip: {
                hideDelay: 0,
                followPointer: true,
                borderWidth: 1,
                shadow: false
            },
        };
        this.dataStore = {};
        this.dataStore.Counties = {};
        this.dataStore.Places = {};
        this.dataStore.Tracts = {};
        this.dataStore.Boundary = {};
    }
    DataTileCmp.prototype.saveInstance = function (chartInstance) {
        var _this = this;
        if (this.tileType === 'graph') {
            this.chart = chartInstance;
        }
        else {
            this.mapChart = chartInstance;
        }
        this.checkScreenSize();
        this.subscription = this._selectedPlacesService.selectionChanged$.subscribe(function (data) {
            console.log('selected places subscribe throwing event');
            console.log(data);
            _this.onPlacesChanged(data);
        }, function (err) { return console.error(err); }, function () { return console.log('done with subscribe event places selected'); });
        if (this.tileType === 'map') {
            this.geoSubscription = this._geoStore.selectionChanged$.subscribe(function (data) {
                _this.geoJSONStore = data;
                console.log('new geojson file loaded');
                console.log(data);
            }, function (err) { return console.error(err); }, function () { return console.log('done loading geojson'); });
        }
        this.dataSubscription = this._selectedDataService.selectionChanged$.subscribe(function (data) {
            _this.onSelectedDataChanged(data);
        }, function (err) { return console.error(err); }, function () { return console.log('done with subscribe event places selected'); });
        var chartScope = this;
        angular2_highcharts_1.Highcharts.wrap(angular2_highcharts_1.Highcharts.Point.prototype, 'select', function (proceed) {
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));
            if (chartScope.tileType === 'map') {
                var points = chartScope.mapChart.getSelectedPoints();
                var pointsAsPlacesForBin = [];
                for (var p = 0; p < points.length; p++) {
                    var place = points[p];
                    var isInBin = false;
                    for (var b = 0; b < chartScope.places.length; b++) {
                        isInBin = points[p].geoid === chartScope.places[b].ResID && chartScope.places[b].Source === 'search';
                    }
                    if (!isInBin) {
                        pointsAsPlacesForBin.push({ Name: place.id + (chartScope.selectedPlaceType === 'Counties' ? ' County' : ''), ResID: place.geoid, Type: chartScope.selectedPlaceType, TypeCategory: chartScope.selectedPlaceType, Source: 'map' });
                    }
                }
                chartScope._selectedPlacesService.setAllbyPlaceType(pointsAsPlacesForBin, chartScope.selectedPlaceType);
            }
        });
    };
    DataTileCmp.prototype.onPlacesChanged = function (selectedPlaces) {
        this.places = selectedPlaces;
        this.placeNames = '';
        if (this.tempPlaces.length !== this.places.length) {
            for (var x = 0; x < this.places.length; x++) {
                if (this.tempPlaces.indexOf(this.places[x]) === -1) {
                    this.selectedPlaceType = this.translatePlaceTypes(this.places[x].TypeCategory);
                }
                this.tempPlaces.push(this.places[x]);
                this.placeNames += encodeURIComponent(JSON.stringify(this.places[x]));
                this.placeNames += (x < this.places.length - 1) ? ',' : '';
            }
        }
        this.checkDataStateForCharts();
    };
    DataTileCmp.prototype.checkDataStateForCharts = function () {
        console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
        var loadingGeoJSON = this.tileType === 'map' ? this.checkLoadGeoJSON() : false;
        var loadMoreData = this.tileType === 'graph' ? true : this.checkUpdateData();
        if (!loadingGeoJSON && loadMoreData) {
            console.log('need to load data');
            this.getData();
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
                        if (!isSelected && place.Source === 'search' && place.TypeCategory !== 'State') {
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
            }
            else {
                this.createGraphChart();
            }
        }
    };
    DataTileCmp.prototype.checkLoadGeoJSON = function () {
        var _this = this;
        var loadingGeoJSON = false;
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
            if (!placeTypeLoaded) {
                geoJSON_to_load.push(this.places[x].TypeCategory);
                if (this.translatePlaceTypes(this.places[x].TypeCategory) === 'Places') {
                    geoJSON_to_load.push('oregon_siskiyou_boundary');
                }
                this.placeTypes.push(this.places[x].TypeCategory);
            }
        }
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
    DataTileCmp.prototype.getGeoJSON = function (placeTypeToLoad) {
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
                    if (_this.selectedPlaceType === data[0].layerType) {
                        _this.getData();
                    }
                }
            });
        }
    };
    DataTileCmp.prototype.getData = function () {
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
                console.log('888888888888888888888888888');
                console.log(this.dataStore[this.translatePlaceTypes(this.places[p].TypeCategory)]);
                if (this.dataStore[this.translatePlaceTypes(this.places[p].TypeCategory)] !== undefined) {
                    console.log('not undefined yet', this.dataStore[this.translatePlaceTypes(this.places[p].TypeCategory)]);
                    if (this.dataStore[this.translatePlaceTypes(this.places[p].TypeCategory)].indicatorData === undefined) {
                        console.log('now it is undefined', placeTypes.indexOf(this.places[p].TypeCategory) === -1 ? this.places[p].TypeCategory : '');
                        placeTypes += placeTypes.indexOf(this.places[p].TypeCategory) === -1 ? this.places[p].TypeCategory : '';
                        placeTypes += p === this.places.length - 1 ? '' : ',';
                    }
                }
            }
            if (placeTypes === '' || placeTypes === 'State,') {
                console.log('rimraf');
                if (this.dataStore[this.selectedPlaceType] !== undefined) {
                    if (this.dataStore[this.selectedPlaceType].indicatorData === undefined) {
                        placeTypes += this.selectedPlaceType === 'Counties' ? 'County' : this.selectedPlaceType;
                    }
                }
                else {
                    placeTypes += this.selectedPlaceType === 'Counties' ? 'County' : this.selectedPlaceType;
                }
            }
            console.log('GET DATA HOT DIGIDIGDIGIDGIG I');
            console.log(placeTypes);
            if (placeTypes === 'State') {
                placeTypes = 'County,State';
            }
            this._dataService.getAllbyGeoType(placeTypes, this.indicator).subscribe(function (data) {
                _this._selectedDataService.add(data);
            }, function (err) { return console.error(err); }, function () { return console.log('done loading data for map'); });
        }
        else {
            this._dataService.getIndicatorDataWithMetadata(geoids, this.indicator).subscribe(function (data) {
                console.log(data);
                _this.updateDataStore([data], 'indicator');
                _this.placeTypeData = _this.dataStore.indicatorData[_this.indicator].crt_db;
                _this.offsetYear = _this.offsetYear === undefined ? _this.getDefaultYear() : _this.offsetYear;
                _this.selectedYear = _this.placeTypeData.Years[_this.placeTypeData.Years.length - _this.offsetYear];
                _this.processDataYear();
                _this.processYearTicks();
                _this.selectedYearIndex = _this._tickArray.length - _this.offsetYear;
                _this.Data = _this.placeTypeData.Data;
                _this.createGraphChart();
            }, function (err) { return console.error(err); }, function () { return console.log('done loading data for graph'); });
        }
    };
    DataTileCmp.prototype.checkUpdateData = function () {
        var loadMoreData = false;
        for (var d = 0; d < this.places.length; d++) {
            if (this.dataStore[this.pluralize(this.places[d].TypeCategory)] !== undefined) {
                console.log('already have this type data');
                console.log(this.dataStore[this.pluralize(this.places[d].TypeCategory)].indicatorData);
            }
            else {
                if (this.places[d].TypeCategory !== 'State') {
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
    DataTileCmp.prototype.onSelectedDataChanged = function (data) {
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
                this.setupTimeSlider();
                this.createMapChart();
            }
            else {
                console.log('Chart tile has all data now');
                console.log(this.placeTypeData);
                this.Data = this.placeTypeData.Data;
                this.createGraphChart();
            }
        }
        else {
            console.log('DATA SUBSCRIPTION thinks there is no data');
        }
    };
    DataTileCmp.prototype.updateDataStore = function (data, dataType) {
        console.log('SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS');
        console.log(data);
        if (dataType === 'indicator') {
            for (var d = 0; d < data.length; d++) {
                var indicatorData = {};
                indicatorData[this.indicator] = { crt_db: data[d] };
                if (this.tileType === 'map') {
                    console.log(data[d].GeoTypes[0].geoType);
                    this.dataStore[this.pluralize(data[d].GeoTypes[0].geoType).toString()].indicatorData = indicatorData;
                }
                else {
                    this.dataStore.indicatorData = indicatorData;
                }
            }
        }
        if (dataType === 'mapData') {
            console.log('hlaskjdf;ldskjf;ldasjflk;sdjf;jsdafkjsdakjfdj');
            var mapData = {};
            mapData = data;
            console.log(data.layerId);
            this.dataStore[this.pluralize(data.layerId)].mapData = mapData;
        }
        console.log(this.dataStore);
    };
    DataTileCmp.prototype.getPlaceData = function () {
        console.log('Checking on place data');
        if (this.tileType === 'map') {
            return this.dataStore[this.selectedPlaceType].indicatorData[this.indicator].chart_data.place_data;
        }
        else {
            return this.dataStore.indicatorData[this.indicator].chart_data.place_data;
        }
    };
    DataTileCmp.prototype.getSelectedMapData = function () {
        var _this = this;
        console.log(this.selectedPlaceType);
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
        console.log('que pasa');
        console.log(selectedGeoJSONType);
        console.log(selectedGeoJSONType[0].features[selectedYearGeoJSONIndex]);
        return selectedGeoJSONType[0].features[selectedYearGeoJSONIndex];
    };
    DataTileCmp.prototype.setupTimeSlider = function () {
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
            tickArray: this._tickArray,
            tickLabels: this._tickLabelsTime,
            change: function (event, ui) {
                console.log('slider changed');
                sliderScope.selectedYear = sliderScope.placeTypeData.Years[ui.value];
                sliderScope.selectedYearIndex = sliderScope.selectedYearIndexArray[sliderScope.selectedYear.Year];
                sliderScope.processDataYear();
                sliderScope.mapChart.series[0].name = sliderScope.pluralize(sliderScope.selectedPlaceType) + ' (' + sliderScope.selectedYear.Year + ')';
                sliderScope.mapChart.setTitle({
                    text: sliderScope.selectedPlaceType + ' (' + sliderScope.selectedYear.Year + ')'
                });
                sliderScope.mapChart.series[0].mapData = sliderScope.getSelectedMapData();
                sliderScope.mapChart.series[0].setData(sliderScope.dataStore[sliderScope.selectedPlaceType].indicatorData[sliderScope.indicator].chart_data.place_data);
            }
        });
    };
    DataTileCmp.prototype.onPlayBtnClick = function (evt) {
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
    DataTileCmp.prototype.translatePlaceTypes = function (placeType) {
        switch (placeType) {
            case 'County':
            case 'State':
                return 'Counties';
            case 'Census Designated Place':
            case 'Incorporated City':
            case 'Incorporated Town':
            case 'City':
                return 'Places';
            case 'Census Tract':
            case 'Unicorporated Place':
                return 'Tracts';
            default:
                return placeType;
        }
    };
    DataTileCmp.prototype.createMapChart = function () {
        var colorAxis = this.mapChart.colorAxis[0];
        var mapScope = this;
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
        console.log('a;lskdddddddddddddddddfj;alskdjf;lajsdfl;aksdjfal;skdfjkl');
        console.log(this.selectedPlaceType);
        var series = {
            borderColor: 'white',
            data: this.getPlaceData(),
            mapData: this.getSelectedMapData(),
            joinBy: ['NAME', 'name'],
            name: this.indicator + ' (' + this.selectedYear.Year + ')',
            allowPointSelect: true,
            cursor: 'pointer',
            states: {
                select: {
                    color: '#BADA55',
                    borderColor: 'black',
                },
                hover: {}
            }
        };
        this.mapChart.addSeries(series, true);
        ptSeriesIndexes.push(this.mapChart.series.length - 1);
        this.mapSeriesStore[this.selectedPlaceType] = { index: ptSeriesIndexes };
        console.log(ptSeriesIndexes);
        console.log(this.mapChart);
        for (var s = 0; s < this.mapChart.series.length; s++) {
            if (ptSeriesIndexes.indexOf(s) === -1) {
                console.log('hiding layer');
                console.log(this.mapChart.series[s]);
            }
        }
        this.mapChart.setTitle({ text: this.pluralize(this.selectedPlaceType) + ' (' + this.selectedYear.Year + ')' });
        this.mapChart.redraw();
    };
    DataTileCmp.prototype.createGraphChart = function () {
        if (this.placeTypeData.Metadata.length > 0) {
            console.log('making graph chart');
            this.chart.xAxis[0].setCategories(this._tickLabels);
            this.chart.xAxis[0].options.tickmarkPlacement = 'on';
            this.chart.xAxis[0].options.min = 0;
            this.chart.xAxis[0].options.max = this._tickArray.length - 1;
            this.chart.xAxis[0].options.tickInterval = this._tickArray.length > 10 ? 2 : null;
            this.chart.xAxis[0].options.plotLines = [{
                    color: 'gray',
                    dashStyle: 'longdashdot',
                    width: 2,
                    value: this.selectedYearIndex,
                    id: 'plot-line-1'
                }];
            var indicatorYaxis = this.placeTypeData.Metadata[0]['Y-Axis'] !== null ? this.placeTypeData.Metadata[0]['Y-Axis'] : this.placeTypeData.Metadata[0].Variable;
            this.chart.yAxis[0].setTitle({
                text: indicatorYaxis,
                margin: indicatorYaxis.length > 30 ? 40 : null,
                style: { 'line-height': '.8em' }
            });
            this.addSeriesDataToGraphChart();
        }
        else {
            console.log('no chart for' + this.indicator);
        }
    };
    DataTileCmp.prototype.addSeriesDataToGraphChart = function (mapPlaces) {
        var _this = this;
        while (this.chart.series.length > 0) {
            this.chart.series[0].remove(false);
        }
        var selectedPlaceData = this.Data.filter(function (placeData) {
            var isSelected = false;
            for (var p = 0; p < _this.places.length; p++) {
                isSelected = (placeData.community.trim() === _this.places[p].Name.replace(' County', '').trim() && placeData.geoid.trim() === _this.places[p].ResID.trim()) ? true : isSelected;
                if (isSelected) {
                    break;
                }
            }
            if (!isSelected && mapPlaces !== undefined) {
                for (var m = 0; m < mapPlaces.length; m++) {
                    if (mapPlaces[m].id !== null) {
                        isSelected = (placeData.community.trim() === mapPlaces[m].id.replace(' County', '').trim() && placeData.geoid.trim() === mapPlaces[m].geoid.trim()) ? true : isSelected;
                        if (isSelected) {
                            break;
                        }
                    }
                }
            }
            return isSelected;
        });
        for (var x = 0; x < selectedPlaceData.length; x++) {
            var isOregon = selectedPlaceData[x]['geoid'] === '41' ? true : false;
            var isCalifornia = selectedPlaceData[x]['geoid'] === '06' ? true : false;
            var isState = isOregon || isCalifornia ? true : false;
            this.chart.addSeries({
                id: selectedPlaceData[x]['community'] + selectedPlaceData[x]['geoid'],
                name: selectedPlaceData[x]['community'],
                type: 'line',
                lineWidth: isState ? 4 : 2,
                lineColor: '#A3A3A4',
                lineOpacity: 1.0,
                data: this.dataStore.indicatorData[this.indicator].chart_data.place_data_years[selectedPlaceData[x].community].data,
                connectNulls: true,
                threshold: 0,
                fillOpacity: 0.85,
                animation: {
                    duration: 500
                },
                marker: {
                    fillColor: isState ? '#FFFFFF' : null,
                    lineWidth: isState ? 4 : 1,
                    lineColor: this.placeTypeData.Metadata[0].Color_hex,
                    radius: isState ? 4 : 2,
                    symbol: 'circle'
                }
            }, true);
            if (this.hasMOEs) {
                this.chart.addSeries({
                    name: selectedPlaceData[x]['community'] + selectedPlaceData[x]['geoid'] + ' Margin of Error',
                    whiskerLength: 10,
                    type: 'errorbar',
                    data: this.dataStore.indicatorData[this.indicator].chart_data.place_data_years_moe[selectedPlaceData[x].community].data,
                    linkedTo: selectedPlaceData[x]['community'] + selectedPlaceData[x]['geoid'],
                }, false);
                var maxMoe = this.getMaxMOE(this.dataStore.indicatorData[this.indicator].chart_data.place_data_years_moe[selectedPlaceData[x].community].data);
                var minMoe = this.getMinMOE(this.dataStore.indicatorData[this.indicator].chart_data.place_data_years_moe[selectedPlaceData[x].community].data);
                if (maxMoe !== undefined) {
                    var extremes = this.chart.yAxis[0].getExtremes();
                    maxMoe = maxMoe < extremes.max ? extremes.max : maxMoe;
                    minMoe = minMoe > 0 ? 0 : minMoe;
                    this.chart.yAxis[0].setExtremes(minMoe, maxMoe);
                }
                this.chart.redraw();
            }
        }
    };
    DataTileCmp.prototype.checkScreenSize = function () {
        if ($jq(window).width() < 481) {
            this.isHandheld = true;
        }
    };
    DataTileCmp.prototype.getMaxMOE = function (data) {
        var max = 0;
        for (var x = 0; x < data.length; x++) {
            if (data[x] !== null) {
                max = max < data[x][1] ? data[x][1] : max;
            }
        }
        return max;
    };
    DataTileCmp.prototype.getMinMOE = function (data) {
        var min = 0;
        for (var x = 0; x < data.length; x++) {
            if (data[x] !== null) {
                min = min > data[x][0] ? data[x][0] : min;
            }
        }
        return min;
    };
    DataTileCmp.prototype.setYextremes = function () {
        var extremes = this.chart.yAxis[0].getExtremes();
        var maxData = this.getMaxData(false);
        var minData = this.getMinData(false);
        maxData = maxData < extremes.max ? extremes.max : maxData;
        minData = minData > 0 ? 0 : minData;
        this.chart.yAxis[0].setExtremes(minData, maxData);
    };
    DataTileCmp.prototype.processDataYear = function () {
        var place_data = [{}];
        var place_data_years = {};
        var place_data_years_moe = {};
        for (var d = 0; d < this.placeTypeData.Data.length; d++) {
            var pData = this.placeTypeData.Data[d];
            if (pData.Name !== 'Oregon') {
                place_data.push({
                    name: pData.community,
                    geoid: pData.geoid,
                    value: pData[this.selectedYear.Year] === -1 ? 0 : pData[this.selectedYear.Year],
                    year: this.selectedYear.Year,
                    id: pData.community
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
                year_data.push($jq.isNumeric(pData[_year]) ? parseFloat(pData[_year]) : null);
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
        console.log(this.dataStore);
        console.log(this.tileType);
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
        console.log('funions');
        console.log(this.dataStore);
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
    DataTileCmp.prototype.processYearTicks = function () {
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
    DataTileCmp.prototype.getDefaultYear = function () {
        console.log('looking for year data');
        var counter = 0;
        for (var y = this.placeTypeData.Years.length - 1; y > 0; y--) {
            counter++;
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
        }
        return counter;
    };
    DataTileCmp.prototype.getMinData = function (isMap, chartType) {
        var min;
        var notLogrithmic = false;
        var chart_data = this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].chart_data;
        var pdy = $jq.extend(true, {}, isMap ? chart_data.place_data_years : this.hasMOEs ? chart_data.place_data_years_moe : chart_data.place_data_years);
        $jq.each(pdy, function () {
            var arr = $jq.grep(this.data, function (n) { return (n); });
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
        });
        return notLogrithmic ? 0 : min < 10 ? 0 : min;
    };
    DataTileCmp.prototype.getMaxData = function (isMap) {
        var max = 0;
        var chart_data = this.dataStore[this.pluralize(this.selectedPlaceType)].indicatorData[this.indicator].chart_data;
        var pdy = $jq.extend(true, {}, isMap ? chart_data.place_data_years : this.hasMOEs ? chart_data.place_data_years_moe : chart_data.place_data_years);
        $jq.each(pdy, function () {
            var arr = $jq.grep(this.data, function (n) { return (n); });
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
        });
        return max;
    };
    DataTileCmp.prototype.formatValue = function (val, isLegend) {
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
    DataTileCmp.prototype.formatAbvNumbers = function (val, isLegend, numDecimals) {
        return (val > 999999999 ? (this.addCommas((val / 1000000000).toFixed(isLegend ? (val / 1000000000) < 10 ? 1 : 0 : numDecimals)) + 'bn') : val > 999999 ? (this.addCommas((val / 1000000).toFixed(isLegend ? (val / 1000000) < 10 ? 1 : 0 : numDecimals)) + 'mil') : val > 999 ? (this.addCommas((val / 1000).toFixed(isLegend ? (val / 1000) < 10 ? 1 : 0 : numDecimals)) + 'k') : val);
    };
    DataTileCmp.prototype.pluralize = function (value) {
        switch (value) {
            case 'County':
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
    DataTileCmp.prototype.addCommas = function (nStr) {
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
    DataTileCmp.prototype.toCamelCase = function (str) {
        return str !== null ? str.replace(/([^\W_]+[^\s-]*) */g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) : null;
    };
    DataTileCmp.prototype.gotoDetails = function () {
        this._router.navigate(['Explore', { indicator: encodeURI(this.indicator.replace(/\(/g, '%28').replace(/\)/g, '%29')), places: this.placeNames }]);
        window.scrollTo(0, 0);
    };
    DataTileCmp.prototype.onTimeSliderChange = function (evt) {
        console.log('well hot digity dog');
    };
    DataTileCmp.prototype.onSelectedMapViewChange = function (evt) {
        console.log('GOT map Menu Change Event');
        console.log(evt);
        if (this.selectedPlaceType !== this.translatePlaceTypes(evt)) {
            this.selectedPlaceType = this.translatePlaceTypes(evt);
            console.log('different place type!');
            this.checkDataStateForCharts();
        }
    };
    DataTileCmp.prototype.ngOnInit = function () {
        this.defaultChartOptions.title = { text: this.indicator };
        this._indicatorDescService.getIndicator(this.indicator).subscribe(function (data) {
            console.log('got indicator description');
        });
        if (this.tileType === 'map') {
            for (var pt in this.dataStore) {
                pt.indicatorData = {};
                pt.mapData = {};
            }
        }
    };
    DataTileCmp.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
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
    ], DataTileCmp.prototype, "indicator", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DataTileCmp.prototype, "tileType", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DataTileCmp.prototype, "viewType", void 0);
    DataTileCmp = __decorate([
        core_1.Component({
            selector: 'data-tile',
            templateUrl: './shared/components/data_tile/data-tile.html',
            styleUrls: ['./shared/components/data_tile/data-tile.css'],
            directives: [angular2_highcharts_1.CHART_DIRECTIVES, hmap_menu_1.HmapMenu],
            providers: [http_1.JSONP_PROVIDERS, data_service_1.DataService, indicator_desc_service_1.IndicatorDescService, geojson_store_service_1.GeoJSONStoreService, geojson_service_1.GetGeoJSONService, selected_data_service_1.SelectedDataService, place_types_service_1.PlaceTypeService]
        }),
        __param(0, core_1.Inject(core_1.ElementRef)), 
        __metadata('design:paramtypes', [core_1.ElementRef, data_service_1.DataService, selected_places_service_1.SelectedPlacesService, indicator_desc_service_1.IndicatorDescService, router_1.Router, geojson_store_service_1.GeoJSONStoreService, geojson_service_1.GetGeoJSONService, selected_data_service_1.SelectedDataService, place_types_service_1.PlaceTypeService])
    ], DataTileCmp);
    return DataTileCmp;
})();
exports.DataTileCmp = DataTileCmp;
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
