var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var angular2_highcharts_1 = require('angular2-highcharts');
var Highchmap = require('highcharts/modules/map');
var HighchartsMore = require('highcharts/highcharts-more');
var $jq = require('jquery');
var http_1 = require('angular2/http');
var indicator_desc_service_1 = require('../../services/indicators/indicator.desc.service');
var data_service_1 = require('../../services/data/data.service');
var selected_places_service_1 = require('../../services/places/selected-places.service');
var selected_data_service_1 = require('../../services/data/selected-data.service');
var router_1 = require('angular2/router');
var geojson_store_service_1 = require('../../services/geojson/geojson_store.service');
var geojson_service_1 = require('../../services/geojson/geojson.service');
angular2_highcharts_1.Highcharts.setOptions({
    colors: ['#058DC7', '#50B432', '#ED561B']
});
Highchmap(angular2_highcharts_1.Highcharts);
HighchartsMore(angular2_highcharts_1.Highcharts);
var DataTileCmp = (function () {
    function DataTileCmp(_dataService, _selectedPlacesService, _indicatorDescService, _router, _geoStore, _geoService, _selectedDataService) {
        this._dataService = _dataService;
        this._selectedPlacesService = _selectedPlacesService;
        this._indicatorDescService = _indicatorDescService;
        this._router = _router;
        this._geoStore = _geoStore;
        this._geoService = _geoService;
        this._selectedDataService = _selectedDataService;
        this.geoJSONStore = [];
        this.places = new Array();
        this.placeNames = '';
        this.placeTypes = [];
        this.place_data = [{}];
        this.selectedPlaceType = 'County';
        this.selectedYearIndexArray = {};
        this._tickArray = [];
        this._tickLabels = [];
        this._tickLabelsTime = [];
        this._tickArrayTime = [];
        this.hasDrillDowns = false;
        this.county_no_data = [];
        this.county_map_no_data = [];
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
            legend: {},
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
                y: -12
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
            }
        };
    }
    DataTileCmp.prototype.saveInstance = function (chartInstance) {
        var _this = this;
        this.chart = chartInstance;
        this.subscription = this._selectedPlacesService.selectionChanged$.subscribe(function (data) {
            console.log('subscribe throwing event');
            console.log(data);
            _this.onPlacesChanged(data);
        }, function (err) { return console.error(err); }, function () { return console.log('done with subscribe event places selected'); });
        if (this.viewType === 'advanced') {
            this.geoSubscription = this._geoStore.selectionChanged$.subscribe(function (data) {
                _this.geoJSONStore = data;
                console.log('new geojson file loaded');
                console.log(data);
            }, function (err) { return console.error(err); }, function () { return console.log('done loading geojson'); });
            this.dataSubscription = this._selectedDataService.selectionChanged$.subscribe(function (data) {
                console.log('Community Data throwing event');
                console.log(data);
                if (data.length > 0) {
                    _this.allData = data[0];
                    _this.selectedYear = data[0].Years[data[0].Years.length - 1];
                    _this.selectedYearIndex = _this._tickArray.length - 1;
                    while (_this.chart.series.length > 0) {
                        _this.chart.series[0].remove(false);
                    }
                    if (_this.tileType === 'map') {
                        _this.selectedMapData = _this.geoJSONStore[0].features[0];
                    }
                    _this.processDataYear();
                    _this.processYearTicks();
                    _this.hasDrillDowns = _this.allData.Metadata[0].Sub_Topic_Name !== 'none' ? true : false;
                    if (_this.tileType === 'map') {
                        _this.createMapChart();
                    }
                    else {
                        console.log('Chart tile has all data now');
                        console.log(_this.allData);
                        _this.Data = _this.allData.Data;
                        _this.createGraphChart();
                    }
                }
                else {
                    console.log('DATA SUBSCRIPTION thinks there is no data');
                }
            }, function (err) { return console.error(err); }, function () { return console.log('done with subscribe event places selected'); });
        }
    };
    DataTileCmp.prototype.onPlacesChanged = function (selectedPlaces) {
        this.places = selectedPlaces;
        if (this.tempPlaces.length !== this.places.length) {
            for (var x = 0; x < this.places.length; x++) {
                this.tempPlaces.push(this.places[x]);
                this.placeNames += encodeURIComponent(JSON.stringify(this.places[x]));
                this.placeNames += (x < this.places.length - 1) ? ',' : '';
            }
        }
        var loadingGeoJSON = this.tileType === 'map' ? this.checkLoadGeoJSON() : false;
        var loadMoreData = this.allData !== undefined ? this.checkUpdateData() : true;
        if (!loadingGeoJSON && loadMoreData) {
            console.log('need to load data');
            this.getData();
        }
        else if (!loadingGeoJSON) {
            console.log('NEED TO UPDATE MAP/CHART');
            if (this.tileType === 'map') {
                var selectedPlaces_1 = this.chart.getSelectedPoints();
                for (var s = 0; s < selectedPlaces_1.length; s++) {
                    selectedPlaces_1[s].select();
                }
                for (var pd = 0; pd < this.chart.series[0].data.length; pd++) {
                    for (var p = 0; p < this.places.length; p++) {
                        if (this.places[p].TypeCategory === this.selectedPlaceType && this.places[p].Name.replace(' County', '') === this.chart.series[0].data[pd].id)
                            this.chart.series[0].data[pd].select(true, true);
                    }
                }
            }
            else {
                while (this.chart.series.length > 0) {
                    this.chart.series[0].remove(false);
                }
                this.createGraphChart();
            }
        }
    };
    DataTileCmp.prototype.checkLoadGeoJSON = function () {
        var loadingGeoJSON = false;
        var geoJSON_to_load = [];
        for (var x = 0; x < this.places.length; x++) {
            var placeTypeLoaded = false;
            for (var g = 0; g < this.geoJSONStore.length; g++) {
                if (this.places[x].TypeCategory !== 'Statewide') {
                    placeTypeLoaded = this.places[x].TypeCategory === this.geoJSONStore[g].layerId ? true : placeTypeLoaded;
                }
                else {
                    placeTypeLoaded = true;
                }
            }
            if (!placeTypeLoaded) {
                geoJSON_to_load.push(this.places[x].TypeCategory);
                this.placeTypes.push(this.places[x].TypeCategory);
            }
        }
        if (geoJSON_to_load.length > 0) {
            this.getGeoJSON(geoJSON_to_load);
            loadingGeoJSON = true;
        }
        return loadingGeoJSON;
    };
    DataTileCmp.prototype.checkUpdateData = function () {
        var _this = this;
        var loadMoreData = false;
        for (var d = 0; d < this.places.length; d++) {
            var geoTypeCheck = this.allData.GeoTypes.filter(function (geoType) { return _this.places[d].TypeCategory === geoType.geoType; });
            loadMoreData = geoTypeCheck.length !== 1 ? true : loadMoreData;
        }
        return loadMoreData;
    };
    DataTileCmp.prototype.getGeoJSON = function (placeTypeToLoad) {
        var _this = this;
        console.log('place types to load');
        console.log(placeTypeToLoad);
        this._geoService.load(placeTypeToLoad, true).subscribe(function (data) {
            console.log('got response from geoservice');
            console.log(data);
            _this._geoStore.add({ layerId: 'County', features: data });
            _this.getData();
        });
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
        if (this.viewType === 'advanced') {
            this._dataService.getAllbyGeoType(this.selectedPlaceType + ',Statewide', this.indicator).subscribe(function (data) {
                _this.allData = data;
                _this._selectedDataService.add(data);
            }, function (err) { return console.error(err); }, function () { return console.log('done loading data'); });
        }
        else {
            this._dataService.get(geoids, this.indicator).subscribe(function (data) {
                _this.Data = data.length > 0 ? data : [];
                while (_this.chart.series.length > 0) {
                    _this.chart.series[0].remove(false);
                }
                _this.createGraphChart();
            }, function (err) { return console.error(err); }, function () { return console.log('done loading data'); });
        }
    };
    DataTileCmp.prototype.createMapChart = function () {
        var colorAxis = this.chart.colorAxis[0];
        var mapScope = this;
        colorAxis.update({
            type: this.getMinData(true, true) > 0 ? 'logarithmic' : null,
            min: this.getMinData(true),
            max: this.getMaxData(true),
            endOnTick: false,
            startOnTick: true,
            maxColor: this.allData.Metadata[0].Color_hex,
            labels: {
                formatter: function () {
                    return mapScope.formatValue(this.value, true);
                }
            }
        });
        this.chart.tooltip.options.formatter = function () {
            var displayValue = mapScope.formatValue(this.point.value, false) + '</b>';
            if (this.point.value === undefined) {
                return '<span>' + this.point.properties.name + ' County</span><br/><span style="font-size: 10px">Not Available or Insufficient Data</span>';
            }
            else {
                if (this.point.year !== undefined) {
                    if (this.point.year.match('-')) {
                        displayValue += '<span style="font-size:8px">  (+/- ';
                        displayValue += mapScope.formatValue(((parseFloat(mapScope.place_data_years_moe[this.point.id].data[mapScope.selectedYearIndexArray[this.point.year]][1]) - parseFloat(mapScope.place_data_years_moe[this.point.id].data[mapScope.selectedYearIndexArray[this.point.year]][0])) / 2), false);
                        displayValue += ' )</span>';
                    }
                    var SeriesName = this.point.series.name.split(':').length > 1 ? this.point.series.name.split(':')[0] + ':<br />' + this.point.series.name.split(':')[1] : this.point.series.name;
                    var returnHTML = '<span style="fill: ' + this.series.color + ';"> ● </span><span style="font-size: 10px"> ' + SeriesName + '</span>';
                    returnHTML += '<br/><b>' + this.point.id + ' ' + mapScope.selectedPlaceType + ': ' + displayValue;
                    returnHTML += '<br/><span style="color:#a7a7a7;">-----------------------------------------</span><br/><em><span style="font-size:10px; color:' + mapScope.allData.Metadata[0].Color_hex;
                    returnHTML += '; font-weight:bold; font-style:italic">( Click to view chart  ---   To compare: Hold Shift + Click )</span></em>';
                    return returnHTML;
                }
                else {
                    return '<span style="font-size: 10px">Not Available or Insufficient Data</span>';
                }
            }
        };
        var series = {
            borderColor: 'white',
            data: this.place_data,
            mapData: this.selectedMapData,
            joinBy: ['NAME10', 'name'],
            name: this.indicator + ' (' + this.selectedYear.Year + ')',
            allowPointSelect: true,
            cursor: 'pointer',
            states: {
                select: {
                    color: '#BADA55',
                },
                hover: {}
            }
        };
        this.chart.addSeries(series);
        this.chart.setTitle({ text: this.indicator });
    };
    DataTileCmp.prototype.createGraphChart = function () {
        this.chart.xAxis[0].setCategories(this._tickLabels);
        this.chart.xAxis[0].options.tickmarkPlacement = 'on';
        this.chart.xAxis[0].options.min = 0;
        this.chart.xAxis[0].options.max = this._tickArray.length - 1;
        this.chart.xAxis[0].options.tickInterval = this._tickArray.length > 10 ? 2 : null;
        this.chart.xAxis[0].options.plotLines = [{
                color: 'gray',
                dashStyle: 'longdashdot',
                width: 2,
                value: this._tickArray.length - 1,
                id: 'plot-line-1'
            }];
        var indicatorYaxis = this.allData.Metadata[0]['Y-Axis'] !== null ? this.allData.Metadata[0]['Y-Axis'] : this.allData.Metadata[0].Variable;
        this.chart.yAxis[0].setTitle({
            text: indicatorYaxis,
            margin: indicatorYaxis.length > 30 ? 40 : null,
            style: { 'line-height': '.8em' }
        });
        this.addSeriesDataToGraphChart();
    };
    DataTileCmp.prototype.addSeriesDataToGraphChart = function () {
        var _this = this;
        var selectedPlaceData = this.Data.filter(function (placeData) {
            var isSelected = false;
            for (var p = 0; p < _this.places.length; p++) {
                isSelected = (placeData.community === _this.places[p].Name.replace(' County', '') && placeData.geoid === _this.places[p].ResID) ? true : isSelected;
                if (isSelected) {
                    break;
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
                data: this.place_data_years[selectedPlaceData[x].community].data,
                connectNulls: true,
                threshold: 0,
                fillOpacity: 0.85,
                animation: {
                    duration: 500
                },
                marker: {
                    fillColor: isState ? '#FFFFFF' : null,
                    lineWidth: isState ? 4 : 1,
                    lineColor: this.allData.Metadata[0].Color_hex,
                    radius: isState ? 4 : 2,
                    symbol: 'circle'
                }
            }, true);
            if (this.hasMOEs) {
                this.chart.addSeries({
                    name: selectedPlaceData[x]['community'] + selectedPlaceData[x]['geoid'] + ' Margin of Error',
                    whiskerLength: 10,
                    type: 'errorbar',
                    data: this.place_data_years_moe[selectedPlaceData[x].community].data,
                    linkedTo: selectedPlaceData[x]['community'] + selectedPlaceData[x]['geoid'],
                }, false);
                var maxMoe = this.getMaxMOE(this.place_data_years_moe[selectedPlaceData[x].community].data);
                var minMoe = this.getMinMOE(this.place_data_years_moe[selectedPlaceData[x].community].data);
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
        this.place_data = [{}];
        this.place_data_years = {};
        this.place_data_years_moe = {};
        for (var d = 0; d < this.allData.Data.length; d++) {
            var pData = this.allData.Data[d];
            if (pData.Name !== 'Oregon') {
                this.place_data.push({
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
            for (var y = 0; y < this.allData.Years.length; y++) {
                var _year = this.allData.Years[y].Year;
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
                year_data.push(parseFloat(pData[_year]));
                prevYear = _year;
            }
            this.place_data_years[pData.community] = {
                id: pData.community,
                name: pData.community,
                geoid: pData.geoid,
                data: year_data
            };
            this.place_data_years_moe[pData.community] = {
                id: pData.community,
                name: pData.community,
                geoid: pData.geoid,
                data: year_data_moe
            };
        }
        if (this.tileType === 'map') {
            for (var x = 0; x < this.selectedMapData.features.length; x++) {
                var mData = this.selectedMapData.features[x];
                var lookupResult = this.place_data.filter(function (place) {
                    return place.geoid === mData.properties.GEOID10 && place.value === null;
                });
                if (lookupResult.length === 1) {
                    this.county_map_no_data.push(mData);
                    this.county_no_data.push({
                        geoid: mData.properties.GEOID10,
                        id: mData.properties.GEOID10,
                        name: mData.properties.NAMELSAD10,
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
        var labelEveryYear = this.allData.Years.length > 10 ? false : true;
        var labelEveryThirdYear = this.allData.Years.length > 20 ? true : false;
        var labelYear = true;
        var labelThirdYear = true;
        var labelYearCounter = 1;
        this._tickArray = [];
        this._tickLabels = [];
        this._tickLabelsTime = [];
        for (var y = 0; y < this.allData.Years.length; y++) {
            var yearsToAdd = 0;
            var Year = this.allData.Years[y].Year;
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
    DataTileCmp.prototype.getMinData = function (isMap, chartType) {
        var min;
        var notLogrithmic = false;
        var pdy = $jq.extend(true, {}, isMap ? this.place_data_years : this.hasMOEs ? this.place_data_years_moe : this.place_data_years);
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
        var pdy = $jq.extend(true, {}, isMap ? this.place_data_years : this.hasMOEs ? this.place_data_years_moe : this.place_data_years);
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
        switch (this.allData.Metadata[0].Variable_Represent.trim()) {
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
    DataTileCmp.prototype.ngOnInit = function () {
        this.defaultChartOptions.title = { text: this.indicator };
        this._indicatorDescService.getIndicator(this.indicator).subscribe(function (data) {
            console.log('got indicator description');
        });
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
            directives: [angular2_highcharts_1.CHART_DIRECTIVES],
            providers: [http_1.JSONP_PROVIDERS, data_service_1.DataService, indicator_desc_service_1.IndicatorDescService, geojson_store_service_1.GeoJSONStoreService, geojson_service_1.GetGeoJSONService, selected_data_service_1.SelectedDataService]
        }), 
        __metadata('design:paramtypes', [data_service_1.DataService, selected_places_service_1.SelectedPlacesService, indicator_desc_service_1.IndicatorDescService, router_1.Router, geojson_store_service_1.GeoJSONStoreService, geojson_service_1.GetGeoJSONService, selected_data_service_1.SelectedDataService])
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
