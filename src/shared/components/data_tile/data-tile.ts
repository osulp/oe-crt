/// <reference path="../../../../tools/manual_typings/project/jquery/index.d.ts" />

import {Component, Input, OnInit, OnDestroy} from 'angular2/core';
import {CHART_DIRECTIVES, Highcharts} from 'angular2-highcharts';
import * as Highchmap from 'highcharts/modules/map';
import * as $jq from 'jquery';
import {Subscription}   from 'rxjs/Subscription';
import {Year, CommunityData} from '../../data_models/community-data';
import {SearchResult} from '../../data_models/search-result';
import {JSONP_PROVIDERS}  from 'angular2/http';
import {IndicatorDescService} from '../../services/indicators/indicator.desc.service';
import {DataService} from '../../services/data/data.service';
import {SelectedPlacesService} from '../../services/places/selected-places.service';
import {SelectedDataService} from '../../services/data/selected-data.service';
import {Router} from 'angular2/router';
import {GeoJSONStoreService} from '../../services/geojson/geojson_store.service';
import {GetGeoJSONService} from '../../services/geojson/geojson.service';


Highcharts.setOptions({
    colors: ['#058DC7', '#50B432', '#ED561B']
});

Highchmap(Highcharts);

interface Chart {
    xAxis: [{
        setCategories: any;
    }];
    series: any;
    addSeries: any;
    setTitle: any;
    colorAxis: any;
    tooltip: any;
    chartWidth: any;
    chartHeight: any;
}

@Component({
    selector: 'data-tile',
    templateUrl: './shared/components/data_tile/data-tile.html',
    styleUrls: ['./shared/components/data_tile/data-tile.css'],
    directives: [CHART_DIRECTIVES],
    providers: [JSONP_PROVIDERS, DataService, IndicatorDescService, GeoJSONStoreService, GetGeoJSONService, SelectedDataService]
})


export class DataTileCmp implements OnInit, OnDestroy {
    @Input() indicator: any;//Just name pull rest of info from desc service
    @Input() tileType: any;//map/graph/table
    @Input() viewType: any;//basic/advanced
    public geoJSONStore: any[] = [];
    private places = new Array<SearchResult>();
    private subscription: Subscription;
    private geoSubscription: Subscription;
    private dataSubscription: Subscription;
    private placeNames: string = '';
    private tempPlaces: Array<SearchResult>;
    private allData: CommunityData;
    private Data: any;
    private placeTypes: string[] = [];
    private place_data: [{}] = [{}];
    private place_data_years: any;
    private place_data_years_moe: any;
    private selectedPlaceType: string = 'County';
    private selectedMapData: any;
    private selectedYear: Year;
    private selectedYearIndex: number;
    private selectedYearIndexArray: any = {};
    private _tickArray: number[] = [];
    private _tickLabels: any[] = [];
    private _tickLabelsTime: any[] = [];
    private _tickArrayTime: any[] = [];
    private hasDrillDowns: boolean = false;
    private hasMOEs: boolean;
    private mapOptions: Object;
    private county_no_data: any = [];
    private county_map_no_data: any = [];
    //private school_dist_no_data: any = [];
    //private school_dist_map_no_data: any = [];

    private xAxisCategories: any = {};
    private defaultChartOptions = {
        chart: {
            type: 'line'
        },
        title: {},
        xAxis: {
            categories: [0, 1]
        },
        series: [{}]
    };
    private chart: Chart;

    constructor(
        private _dataService: DataService,
        private _selectedPlacesService: SelectedPlacesService,
        private _indicatorDescService: IndicatorDescService,
        private _router: Router,
        private _geoStore: GeoJSONStoreService,
        private _geoService: GetGeoJSONService,
        private _selectedDataService: SelectedDataService
    ) {
        this.tempPlaces = new Array<SearchResult>();
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
                //enabled: false,
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

    saveInstance(chartInstance: any) {
        //LOGIC
        //1. Chart gets initiated via default settings and saves instance to this.chart
        //2. Subscribe to changes in place selection and indicator selection?
        //3. On place change lookup geo layer to see if it needs to be added
        //4. Subscribe to chanes in geolayers to access geojson for layers
        //5. On getdata for indicator/place grab geojson and update map/chart    
        //var testProm = new Promise((res: any, rej: any) => {
        //    setTimeout(() => {
        //        res('TA DA!');
        //    }, 5000);
        //});
        //testProm.then((r) => console.log('Tower ' + r));
        this.chart = chartInstance;
        this.subscription = this._selectedPlacesService.selectionChanged$.subscribe(
            data => {
                console.log('subscribe throwing event');
                console.log(data);
                this.onPlacesChanged(data);
            },
            err => console.error(err),
            () => console.log('done with subscribe event places selected')
        );
        //this._selectedPlacesService.load();      
        console.log('data-tile comp loaded. Indicator:  ' + this.indicator + '  Place(s):  ' + this.places.length);
        //this.places = this._selectedPlacesService.get();

        if (this.viewType === 'advanced') {
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
            this.dataSubscription = this._selectedDataService.selectionChanged$.subscribe(
                data => {
                    console.log('Community Data throwing event');
                    console.log(data);
                    //add check to see if place indicator set does not equal input send add request
                    if (data.length > 0) {
                        //set selected year based on last return of year data
                        this.allData = data[0];
                        this.selectedYear = data[0].Years[data[0].Years.length - 1];
                        this.selectedYearIndex = this._tickArray.length - 1;
                        //Not sure if we need to keep clearing out or not
                        while (this.chart.series.length > 0) {
                            this.chart.series[0].remove(false);
                        }
                        //TODO: set layer to match placetype
                        if (this.geoJSONStore.length < 1) {
                            window.setTimeout(function () { console.log('wait for geoJSON load'); }, 1000);
                        }
                        if (this.geoJSONStore.length < 1) {
                            window.setTimeout(function () { console.log('wait for geoJSON load'); }, 1000);
                        }
                        this.selectedMapData = this.geoJSONStore[0].features;
                        //Process the data for it to work with Highmaps

                        this.processDataYear();
                        this.processYearTicks();
                        this.hasDrillDowns = this.allData.Metadata[0].Sub_Topic_Name !== 'none' ? true : false;
                        if (this.tileType === 'map') {
                            this.createMapChart();
                        } else {
                            console.log('Chart tile has all data now');
                            console.log(this.allData);
                        }
                    } else {
                        this.getData(this.places);
                    }
                },
                err => console.error(err),
                () => console.log('done with subscribe event places selected')
            );
            //this._selectedDataService.load();
        }
    }

    onPlacesChanged(selectedPlaces: SearchResult[]) {
        this.places = selectedPlaces;
        this.onPlaceTypeChanged();
        //check if repeated event with same places
        //console.log(this.tempPlaces);
        if (this.tempPlaces.length !== selectedPlaces.length) {
            //if (this.tempPlaces !== this.places) {                 
            for (var x = 0; x < selectedPlaces.length; x++) {
                this.tempPlaces.push(selectedPlaces[x]);
                //this.placeNames += selectedPlaces[x].Name;
                this.placeNames += encodeURIComponent(JSON.stringify(selectedPlaces[x]));
                this.placeNames += (x < selectedPlaces.length - 1) ? ',' : '';
            }
            if (this.indicator !== undefined) {
                this.getData(selectedPlaces);
            } else {
                console.log('INDICATOR UNDEFINED!!!!');
            }
        }
    }

    onPlaceTypeChanged() {
        //get place types for map display        
        for (var x = 0; x < this.places.length; x++) {
            if (this.placeTypes.indexOf(this.places[x].TypeCategory) === -1) {
                this.placeTypes.push(this.places[x].TypeCategory);
                //check geostore to see if already loaded, else load needed layers
                let alreadyLoaded = false;
                for (var v = 0; v < this.geoJSONStore.length; v++) {
                    alreadyLoaded = this.geoJSONStore[v].layerId === 'Counties' ? true : alreadyLoaded;
                }
                if (!alreadyLoaded) {
                    this._geoService.load(this.places[x].TypeCategory, true).subscribe(
                        data => this._geoStore.add({ layerId: 'Counties', features: data })
                    );
                }
            }
        }
    }

    getData(selectedPlaces: SearchResult[]) {
        //get ResIDs for geoids param        
        //this.defaultChartOptions.title = { text: this.indicator };
        let geoids = '';
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
        if (this.tileType === 'map') {
        //if (this.viewType === 'advanced') {
            this._dataService.getAllbyGeoType(this.selectedPlaceType, this.indicator).subscribe(
                (data: any) => {
                    this.allData = data;
                    this._selectedDataService.add(data);
                    ////set selected year based on last return of year data
                    //this.selectedYear = data.Years[data.Years.length - 1];
                    //this.selectedYearIndex = this._tickArray.length - 1;
                    ////Not sure if we need to keep clearing out or not
                    //while (this.chart.series.length > 0) {
                    //    this.chart.series[0].remove(false);
                    //}
                    ////TODO: set layer to match placetype                    
                    //this.selectedMapData = this.geoJSONStore[0].features;
                    ////Process the data for it to work with Highmaps

                    //this.processDataYear();
                    //this.processYearTicks();
                    //this.hasDrillDowns = this.allData.Metadata[0].Sub_Topic_Name !== 'none' ? true : false;

                    //this.createMapChart();
                },
                err => console.error(err),
                () => console.log('done loading data')
            );
        } else {
            this._dataService.get(geoids, this.indicator).subscribe(
                data => {
                    this.Data = data.length > 0 ? data : [];
                    while (this.chart.series.length > 0) {
                        this.chart.series[0].remove(false);
                    }
                    if (this.tileType === 'map') {
                        console.log('CHECKING IF GEOJSON IS AVAILABLE AT THIS POINT');
                        console.log(this.geoJSONStore);
                        var series = { mapData: this.geoJSONStore[0].features };
                        this.chart.addSeries(series);
                        this.chart.setTitle({ text: this.indicator });
                    } else {
                        //process years
                        var counter: any = 0;
                        for (var yearData in this.Data[0]) {
                            if (!isNaN(parseInt(yearData.substr(0, 1)))) {
                                if (yearData.indexOf('_MOE') === -1) {
                                    this.xAxisCategories[counter] = yearData;
                                    counter++;
                                }
                            }
                        }
                        this.chart.xAxis[0].setCategories(this.xAxisCategories);
                        //process data series
                        for (var x = 0; x < data.length; x++) {
                            //process data
                            let seriesData: any = {};
                            let yearCounter: any = 0;

                            for (var year in this.xAxisCategories) {
                                let yearData = this.xAxisCategories[year];
                                seriesData[yearCounter] = this.Data[x][yearData] === null ? null : parseFloat(this.Data[x][yearData]);
                                yearCounter++;
                            }
                            this.chart.addSeries({
                                id: this.Data[x]['community'] + this.Data[x]['geoid'],
                                name: this.Data[x]['community']
                            });
                            this.chart.series[x].update({
                                id: this.Data[x]['community'] + this.Data[x]['geoid'],
                                name: this.Data[x]['community'],
                                type: 'line',
                                lineWidth: 2,
                                lineOpacity: 1.0,
                                data: seriesData
                            }, true);
                        }
                    }
                },
                err => console.error(err),
                () => console.log('done loading data')
            );
        }
    }

    createMapChart() {
        var colorAxis = this.chart.colorAxis[0];
        var mapScope = this;
        //set legend/chloropleth settings
        colorAxis.update({
            type: this.getMinData(true, true) > 0 ? 'logarithmic' : null,// 'logarithmic',
            //min: 0,//null,//0,
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
        //set tooltip display
        this.chart.tooltip.options.formatter = function () {
            var displayValue = mapScope.formatValue(this.point.value, false) + '</b>';
            if (this.point.value === undefined) {
                return '<span>' + this.point.properties.name + ' County</span><br/><span style="font-size: 10px">Not Available or Insufficient Data</span>';
            } else {
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
                } else {
                    return '<span style="font-size: 10px">Not Available or Insufficient Data</span>';
                }
            }
        };
        //Anchor tooltip to bottom;
        //this.chart.tooltip.options.positioner = function () {
        //    return { x: (mapScope.chart.chartWidth - this.label.width) / 2, y: mapScope.chart.chartHeight - (this.label.height + 16) };
        //};
        var series = {
            borderColor: 'white',
            data: this.place_data,
            mapData: this.selectedMapData,
            //index: bowser.msie ? 1 : 0,
            joinBy: ['NAME10', 'name'],
            name: this.indicator + ' (' + this.selectedYear.Year + ')',
            allowPointSelect: true,
            cursor: 'pointer',
            states: {
                select: {
                    color: '#BADA55',
                    //color: '#990033',
                    //borderColor: 'black',
                    //dashStyle: 'shortdot'
                },
                hover: {
                }
            }
        };
        this.chart.addSeries(series);
        this.chart.setTitle({ text: this.indicator });
        console.log(this.chart);
    }

    processDataYear() {
        this.place_data = [{}];
        this.place_data_years = {};
        this.place_data_years_moe = {};
        for (var d = 0; d < this.allData.Data.length; d++) {
            var pData: any = this.allData.Data[d];
            if (pData.Name !== 'Oregon') {
                this.place_data.push({
                    name: pData.community,
                    geoid: pData.geoid,
                    value: pData[this.selectedYear.Year] === -1 ? 0 : pData[this.selectedYear.Year],
                    year: this.selectedYear.Year,
                    id: pData.community
                });
            }
            let year_data: any[] = [];
            let year_data_moe: any[] = [];
            var prevYear: string;
            for (var y = 0; y < this.allData.Years.length; y++) {
                var _year = this.allData.Years[y].Year;
                var yearsToAdd = 0;
                if (prevYear) {
                    var firstYr = prevYear.split('-')[0];
                    var secondYr = _year.split('-')[0];
                    yearsToAdd = parseInt(secondYr) - parseInt(firstYr);
                }
                for (var x = 0; x < yearsToAdd - 1; x++) {//add in between values for chart display
                    year_data.push(null);
                    year_data_moe.push(null);
                }
                if (_year.match('-')) {
                    year_data_moe.push([pData[_year] - pData[_year + '_MOE'], pData[_year] + pData[_year + '_MOE']]);
                } else {
                    year_data_moe.push(null);
                }
                year_data.push(pData[_year]);
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
        //add a dataset for no data
        for (var x = 0; x < this.selectedMapData.features.length; x++) {
            var mData: any = this.selectedMapData.features[x];
            var lookupResult = this.place_data.filter((place: any) => {
                return place.geoid === mData.properties.GEOID10 && place.value === null;
            });
            if (lookupResult.length === 1) {
                this.county_map_no_data.push(mData);
                //add to place_data for empty results.
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

    processYearTicks() {
        var counter = 0;
        var counterTime = 0;
        var prevYear: any;
        var labelEveryYear = this.allData.Years.length > 10 ? false : true;
        var labelEveryThirdYear = this.allData.Years.length > 20 ? true : false;
        var labelYear = true;
        var labelThirdYear = true;
        var labelYearCounter = 1;
        for (var y = 0; y < this.allData.Years.length; y++) {
            var yearsToAdd = 0;
            var Year = this.allData.Years[y].Year;
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

    getMinData(isMap: boolean, chartType?: boolean) {
        var min: any;
        var notLogrithmic = false;
        //need to combine data with moes to get proper min/ max
        var pdy = $jq.extend(true, {}, isMap ? this.place_data_years : this.hasMOEs ? this.place_data_years_moe : this.place_data_years);
        $jq.each(pdy, function () {
            var arr = $jq.grep(this.data, function (n: any) { return (n); });//removes nulls
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
        });
        return notLogrithmic ? 0 : min < 10 ? 0 : min;
    }

    getMaxData(isMap: boolean) {
        var max: any = 0;
        var pdy = $jq.extend(true, {}, isMap ? this.place_data_years : this.hasMOEs ? this.place_data_years_moe : this.place_data_years);
        $jq.each(pdy, function () {
            var arr = $jq.grep(this.data, function (n: any) { return (n); });//removes nulls           
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
        });
        return max;
    }

    formatValue(val: any, isLegend: boolean) {
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
        this._router.navigate(['Explore', { indicator: encodeURI(this.indicator.replace(/\(/g, '%28').replace(/\)/g, '%29')), places: this.placeNames }]);
        window.scrollTo(0, 0);
    }

    ngOnInit() {
        this.defaultChartOptions.title = { text: this.indicator };
        this._indicatorDescService.getIndicator(this.indicator).subscribe(
            data => {
                console.log('got indicator description');
                //console.log(data);                
            });
        //this.mapOptions = {};
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.geoSubscription.unsubscribe();
    }
}
