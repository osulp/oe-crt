import {Component, Input, OnInit, OnDestroy} from 'angular2/core';
import {CHART_DIRECTIVES} from 'angular2-highcharts/index';
//import {Indicator} from '../../data_models/indicator';
//import {Observable} from 'rxjs/Observable';
import {Subscription}   from 'rxjs/Subscription';
import {SearchResult} from '../../data_models/search-result';
import {JSONP_PROVIDERS}  from 'angular2/http';
//import {Ng2Highcharts, Ng2Highmaps} from 'ng2-highcharts/ng2-highcharts';
import {IndicatorDescService} from '../../services/indicators/indicator.desc.service';
import {DataService} from '../../services/data/data.service';
import {SelectedPlacesService} from '../../services/places/selected-places.service';
import {Router} from 'angular2/router';

@Component({
    selector: 'data-tile',
    templateUrl: 'app/shared/components/data_tile/data-tile.html',
    styleUrls: ['app/shared/components/data_tile/data-tile.css'],
    directives: [CHART_DIRECTIVES],
    providers: [JSONP_PROVIDERS, DataService, IndicatorDescService]
})


export class DataTileCmp implements OnInit, OnDestroy {
    @Input() indicator: any;//Just name pull rest of info from desc service
    @Input() tileType: any;//map/graph/table
    @Input() viewType: any;//basic/advanced
    private places = new Array<SearchResult>();
    private subscription: Subscription;
    private placeNames: string = '';

    private xAxisCategories: any = {};
    private chartOptions = {
        chart: {
            type: 'line'
        },
        title: {},
        xAxis: {
            categories: [0, 1]
        },
        series: [{}]
    };
    //mapData = [
    //    {
    //        'code': 'DE.SH',
    //        'value': 728
    //    },
    //    {
    //        'code': 'DE.BE',
    //        'value': 710
    //    },
    //    {
    //        'code': 'DE.MV',
    //        'value': 963
    //    },
    //    {
    //        'code': 'DE.HB',
    //        'value': 541
    //    },
    //    {
    //        'code': 'DE.HH',
    //        'value': 622
    //    },
    //    {
    //        'code': 'DE.RP',
    //        'value': 866
    //    },
    //    {
    //        'code': 'DE.SL',
    //        'value': 398
    //    },
    //    {
    //        'code': 'DE.BY',
    //        'value': 785
    //    },
    //    {
    //        'code': 'DE.SN',
    //        'value': 223
    //    },
    //    {
    //        'code': 'DE.ST',
    //        'value': 605
    //    },
    //    {
    //        'code': 'DE.',
    //        'value': 361
    //    },
    //    {
    //        'code': 'DE.NW',
    //        'value': 237
    //    },
    //    {
    //        'code': 'DE.BW',
    //        'value': 157
    //    },
    //    {
    //        'code': 'DE.HE',
    //        'value': 134
    //    },
    //    {
    //        'code': 'DE.NI',
    //        'value': 136
    //    },
    //    {
    //        'code': 'DE.TH',
    //        'value': 704
    //    }
    //];
    private chart: {
        xAxis: [{
            setCategories: any
        }],
        series: any,
        addSeries: any
    };
    private tempPlaces: Array<SearchResult>;
    private Data: any;


    constructor(
        private _dataService: DataService,
        private _selectedPlacesService: SelectedPlacesService,
        private _indicatorDescService: IndicatorDescService,
        private _router: Router) {
        this.tempPlaces = new Array<SearchResult>();
        this.xAxisCategories = [];
        this.Data = [];
    }

    onPlacesChanged(selectedPlaces: SearchResult[]) {
        this.places = selectedPlaces;
        //check if repeated event with same places
        //console.log(this.tempPlaces);
        if (this.tempPlaces.length !== selectedPlaces.length) {
            //if (this.tempPlaces !== this.places) {                 
            for (var x = 0; x < selectedPlaces.length; x++) {
                this.tempPlaces.push(selectedPlaces[x]);
                this.placeNames += selectedPlaces[x].Name;
                this.placeNames += (x < selectedPlaces.length - 1) ? ',' : '';
            }
            if (this.indicator !== undefined) {
                this.getData(selectedPlaces);
            } else {
                console.log('INDICATOR UNDEFINED!!!!');
            }
        }
    }

    getData(selectedPlaces: SearchResult[]) {
        //get ResIDs for geoids param        
        this.chartOptions.title = { text: this.indicator };
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
        this._dataService.get(geoids, this.indicator).subscribe(
            data => {
                this.Data = data.length > 0 ? data : [];
                //clear chart series
                while (this.chart.series.length > 0) {
                    this.chart.series[0].remove(false);
                }
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
            },
            err => console.error(err),
            () => console.log('done loading data')
        );
    }

    saveInstance(chartInstance: any) {
        this.chart = chartInstance;
    }

    gotoDetails() {
        this._router.navigate(['Explore', { indicator: encodeURI(this.indicator), places: this.placeNames }]);
        window.scrollTo(0, 0);
    }

    ngOnInit() {
        this._indicatorDescService.getIndicator(this.indicator).subscribe(
            data => {
                console.log('got indicator description');
                //console.log(data);
            });

        this.subscription = this._selectedPlacesService.selectionChanged$.subscribe(
            data => {
                console.log('subscribe throwing event');
                console.log(data);
                this.onPlacesChanged(data);
            },
            err => console.error(err),
            () => console.log('done with subscribe event places selected')
        );
        this._selectedPlacesService.load();
        console.log('data-tile comp loaded. Indicator:  ' + this.indicator + '  Place(s):  ' + this.places.length);
        //this.places = this._selectedPlacesService.get();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}



