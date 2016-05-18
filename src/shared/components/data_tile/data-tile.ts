/// <reference path="../../../../tools/manual_typings/project/jquery/index.d.ts" />

import {Component, Input, OnInit, OnDestroy} from 'angular2/core';
import {CHART_DIRECTIVES, Highcharts} from 'angular2-highcharts';
import * as Highchmap from 'highcharts/modules/map';
import * as HighchartsMore from 'highcharts/highcharts-more';
import * as $jq from 'jquery';
//import {Observable} from 'rxjs/Rx';
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
HighchartsMore(Highcharts);

interface Chart {
    xAxis: [{
        setCategories: any;
        options: any;
    }];
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
    private offsetYear: number;
    private _tickArray: number[] = [];
    private _tickLabels: any[] = [];
    private _tickLabelsTime: any[] = [];
    private _tickArrayTime: any[] = [];
    private hasDrillDowns: boolean = false;
    private hasMOEs: boolean;
    private county_no_data: any = [];
    private county_map_no_data: any = [];
    //private school_dist_no_data: any = [];
    //private school_dist_map_no_data: any = [];

    private xAxisCategories: any = {};
    private defaultChartOptions = {
        chart: {
            type: 'line',
            spacingLeft: 0,
            spacingRight: 30,
            spacingTop: 20,
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
        legend: {
            //width: isHandheld ? $jq(window).width() - 40 : isModal ? 600 : 400,
            //itemWidth: isHandheld ? $jq(window).width() - 40 : isModal ? 300 : 200,
            //itemStyle: {
            //    width: isHandheld ? $jq(window).width() - 60 : isModal ? 280 : 180,
            //    color: '#4d4d4d'
            //},
            //title: {
            //    text: 'LEGEND: <span style="font-size: 9px; color: #666; font-weight: normal">(Click to hide series in chart)</span>'
            //},
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
    private mapOptions: Object;
    private chart: Chart;
    private mapChart: Chart;

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
    }

    saveInstance(chartInstance: any) {
        //LOGIC
        //1. Chart gets initiated via default settings and saves instance to this.chart
        //2. Subscribe to changes in place selection and indicator selection?
        //3. On place change lookup geo layer to see if it needs to be added
        //4. Subscribe to chanes in geolayers to access geojson for layers
        //5. On getdata for indicator/place grab geojson and update map/chart     
        if (this.tileType === 'graph') {
            this.chart = chartInstance;
        } else {
            this.mapChart = chartInstance;
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
        }

        this.dataSubscription = this._selectedDataService.selectionChanged$.subscribe(
            data => {
                this.onSelectedDataChanged(data);
            },
            err => console.error(err),
            () => console.log('done with subscribe event places selected')
        );
        var chartScope = this;
        // Wrap point.select to get to the total selected points
        Highcharts.wrap(Highcharts.Point.prototype, 'select', function (proceed: any) {
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));
            if (chartScope.tileType === 'map') {
                var points = chartScope.mapChart.getSelectedPoints();
                let pointsAsPlacesForBin = points.map((place: any) => {
                    return { Name: place.id, ResID: place.geoid, Type: chartScope.selectedPlaceType, TypeCategory: chartScope.selectedPlaceType, Source: 'map' };
                });
                chartScope._selectedPlacesService.setAllbyPlaceType(pointsAsPlacesForBin, chartScope.selectedPlaceType);
            }
        });
    }

    onSelectedDataChanged(data: any) {
        console.log('Community Data throwing event');
        console.log(data);
        //add check to see if place indicator set does not equal input send add request
        if (data.length > 0) {
            //check to see if data loaded contains current report params
            this.allData = data[0];
            //need to set to last year which has data, not last year that might have data
            this.offsetYear = this.getDefaultYear();//retrieve offset value from end
            this.selectedYear = this.allData.Years[data[0].Years.length - this.offsetYear];
            if (this.tileType === 'map') {
                //TODO make contextual to actual place type selection--defaulting to County
                this.selectedMapData = this.geoJSONStore[0].features[0];
            }
            //Process the data for it to work with Highmaps
            this.processDataYear();
            this.processYearTicks();
            this.selectedYearIndex = this._tickArray.length - this.offsetYear;
            this.hasDrillDowns = this.allData.Metadata[0].Sub_Topic_Name !== 'none' ? true : false;
            console.log('checking place_datayears');
            console.log(this.place_data_years);
            if (this.tileType === 'map') {
                this.createMapChart();
            } else {
                console.log('Chart tile has all data now');
                console.log(this.allData);
                this.Data = this.allData.Data;
                this.createGraphChart();
            }
        } else {
            console.log('DATA SUBSCRIPTION thinks there is no data');
            //this.getData();
        }
    }

    onPlacesChanged(selectedPlaces: SearchResult[]) {
        console.log(selectedPlaces);
        this.places = selectedPlaces;
        //check if repeated event with same places       
        if (this.tempPlaces.length !== this.places.length) {
            //if (this.tempPlaces !== this.places) {                 
            for (var x = 0; x < this.places.length; x++) {
                this.tempPlaces.push(this.places[x]);
                //used for goto details link creation
                this.placeNames += encodeURIComponent(JSON.stringify(this.places[x]));
                this.placeNames += (x < this.places.length - 1) ? ',' : '';
            }
        }
        let loadingGeoJSON = this.tileType === 'map' ? this.checkLoadGeoJSON() : false;
        let loadMoreData = this.tileType === 'graph' ? true : (this.allData !== undefined ? this.checkUpdateData() : true);
        if (!loadingGeoJSON && loadMoreData) {
            console.log('need to load data');
            this.getData();
        } else if (!loadingGeoJSON) {
            console.log('NEED TO UPDATE MAP/CHART');
            if (this.tileType === 'map') {
                //deselect to clear if place removed
                let selectedPlaces = this.mapChart.getSelectedPoints();
                console.log(selectedPlaces);
                //logic
                //1. if in selectedPlaces (selected from map), then already selected.
                //2. If not in selectedPlaces, then deselect              
                for (var s = 0; s < selectedPlaces.length; s++) {
                    //deselect only if not currently still active
                    let inSelectedPlaces = false;
                    for (var z = 0; z < this.places.length; z++) {
                        inSelectedPlaces = (this.places[z].Name === selectedPlaces[s].id && this.places[z].ResID === selectedPlaces[s].geoid) ? true : inSelectedPlaces;
                    }
                    if (!inSelectedPlaces) {
                        selectedPlaces[s].select();
                    }
                }
            } else {
                this.createGraphChart();
            }
        }
    }

    checkLoadGeoJSON() {
        let loadingGeoJSON = false;
        //check for missing placetype geojson
        var geoJSON_to_load: any[] = [];
        for (var x = 0; x < this.places.length; x++) {
            let placeTypeLoaded = false;
            for (var g = 0; g < this.geoJSONStore.length; g++) {
                //TODO add check for year span as well                 
                if (this.places[x].TypeCategory !== 'State') {
                    placeTypeLoaded = this.places[x].TypeCategory === this.geoJSONStore[g].layerId ? true : placeTypeLoaded;
                } else {
                    placeTypeLoaded = true; //always load state data
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
    }

    checkUpdateData() {
        let loadMoreData = false;
        for (var d = 0; d < this.places.length; d++) {
            let geoTypeCheck = this.allData.GeoTypes.filter(geoType => { return this.places[d].TypeCategory === geoType.geoType; });
            loadMoreData = geoTypeCheck.length !== 1 ? true : loadMoreData;
        }
        return loadMoreData;
    }

    getGeoJSON(placeTypeToLoad: any[]) {
        console.log('place types to load');
        console.log(placeTypeToLoad);
        this._geoService.load(placeTypeToLoad, true).subscribe(
            data => {
                console.log('got response from geoservice');
                console.log(data);
                this._geoStore.add({ layerId: 'County', features: data });
                this.getData();
            });
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
        //if (this.tileType === 'map') {
        if (this.viewType === 'advanced') {
            this._dataService.getAllbyGeoType(this.selectedPlaceType + ',State', this.indicator).subscribe(
                (data: any) => {
                    this.allData = data;
                    this._selectedDataService.add(data);
                },
                err => console.error(err),
                () => console.log('done loading data')
            );
        } else {
            this._dataService.getIndicatorDataWithMetadata(geoids, this.indicator).subscribe(
                (data: any) => {
                    console.log(data);
                    this.allData = data;
                    //this.Data = data.length > 0 ? data : [];         
                    this.offsetYear = this.offsetYear === undefined ? this.getDefaultYear() : this.offsetYear;
                    this.selectedYear = this.allData.Years[this.allData.Years.length - this.offsetYear];
                    this.processDataYear();
                    this.processYearTicks();
                    this.selectedYearIndex = this._tickArray.length - this.offsetYear;
                    this.Data = this.allData.Data;
                    //while (this.chart.series.length > 0) {
                    //    this.chart.series[0].remove(false);
                    //}
                    this.createGraphChart();
                },
                err => console.error(err),
                () => console.log('done loading data')
            );
        }
    }

    createMapChart() {
        var colorAxis = this.mapChart.colorAxis[0];
        var mapScope = this;
        //set legend/chloropleth settings
        colorAxis.update({
            type: this.getMinData(true, true) > 0 ? 'logarithmic' : null,// 'logarithmic',
            //min: 0,//null,//0,
            min: this.getMinData(true),
            max: this.getMaxData(true),
            endOnTick: false,
            startOnTick: true,
            //maxColor: this.allData.Metadata[0].Color_hex,
            labels: {
                formatter: function () {
                    return mapScope.formatValue(this.value, true);
                }
            }
        });
        //set tooltip display
        this.mapChart.tooltip.options.formatter = function () {
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
        this.mapChart.addSeries(series);
        this.mapChart.setTitle({ text: this.pluralize(this.selectedPlaceType) + ' (' + this.selectedYear.Year + ')' });
    }

    createGraphChart() {
        //check if metadata, if not custom chart, need to do other stuff
        //TODO catch custom chart scenarios
        if (this.allData.Metadata.length > 0) {
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
            var indicatorYaxis = this.allData.Metadata[0]['Y-Axis'] !== null ? this.allData.Metadata[0]['Y-Axis'] : this.allData.Metadata[0].Variable;
            this.chart.yAxis[0].setTitle({
                text: indicatorYaxis,
                margin: indicatorYaxis.length > 30 ? 40 : null,
                style: { 'line-height': '.8em' }
            });
            this.addSeriesDataToGraphChart();
        } else {
            console.log('no chart for' + this.indicator);
        }
    }

    addSeriesDataToGraphChart(mapPlaces?: any[]) {
        //clear out and add again for sync purposes
        while (this.chart.series.length > 0) {
            this.chart.series[0].remove(false);
        }
        //show selected places on chart only       
        var selectedPlaceData = this.Data.filter((placeData: any) => {
            var isSelected = false;
            //selctions come from the place selector box, not highmaps
            for (var p = 0; p < this.places.length; p++) {
                isSelected = (placeData.community.trim() === this.places[p].Name.replace(' County', '').trim() && placeData.geoid.trim() === this.places[p].ResID.trim()) ? true : isSelected;
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
        //process data series
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
                    lineWidth: isState ? 4 : 1, //indicatorData.Years.length > 10 && !isState ? 3 : 4,
                    lineColor: this.allData.Metadata[0].Color_hex,
                    radius: isState ? 4 : 2,
                    symbol: 'circle'
                }
            }, true);
            if (this.hasMOEs) {
                this.chart.addSeries({
                    //color: this.chart.get(this.name).color,
                    name: selectedPlaceData[x]['community'] + selectedPlaceData[x]['geoid'] + ' Margin of Error',
                    whiskerLength: 10,
                    type: 'errorbar',
                    data: this.place_data_years_moe[selectedPlaceData[x].community].data,
                    linkedTo: selectedPlaceData[x]['community'] + selectedPlaceData[x]['geoid'],
                    //visible: $('#chbxShowMoe')[0].checked
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

    processDataYear() {
        this.place_data = [{}];
        this.place_data_years = {};
        this.place_data_years_moe = {};
        //TODO Check for data in last year to set as seletected year

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
                    year_data_moe.push([parseFloat(pData[_year]) - parseFloat(pData[_year + '_MOE']), parseFloat(pData[_year]) + parseFloat(pData[_year + '_MOE'])]);
                } else {
                    year_data_moe.push(null);
                }
                year_data.push($jq.isNumeric(pData[_year]) ? parseFloat(pData[_year]) : null);
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
        //add a dataset for no data MAP DISPLAY ONLY
        if (this.tileType === 'map') {
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
        console.log('looking for year data');
        let counter = 0;
        for (var y = this.allData.Years.length - 1; y > 0; y--) {
            counter++;
            let hasData = false;
            for (var d = 0; d < this.allData.Data.length; d++) {
                console.log(this.allData.Data[d][this.allData.Years[y].Year]);
                if (this.allData.Data[d][this.allData.Years[y].Year] !== null) {
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

    pluralize(value: string) {
        switch (value) {
            case 'County':
                return 'Counties';
            case 'Census Tract':
                return 'Census Tracts';
            case 'City':
                return 'Cities';
            default:
                return value;
        }
        return value;
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
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if (this.geoSubscription !== undefined) {
            this.geoSubscription.unsubscribe();
        }
        if (this.dataSubscription !== undefined) {
            this.dataSubscription.unsubscribe();
        }
    }
}

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
