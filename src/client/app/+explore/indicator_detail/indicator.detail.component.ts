import {Component, Input, ViewChild, ViewChildren, QueryList, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {JSONP_PROVIDERS}  from '@angular/http';
import {Router} from '@angular/router';
import {DataTileComponent,PlacesMapSelectComponent} from '../../shared/components/index';
import {IndicatorDescService, SelectedDataService} from '../../shared/services/index';
import {SearchResult} from '../../shared/data_models/index';
import {SearchComponent} from '../../shared/components/index';
import {TableViewComponent} from './table_view/table.view.component';

declare var $: any;
declare var window: any;
//declare var crt_globals: any;

@Component({
    moduleId: module.id,
    selector: 'indicator-detail',
    templateUrl: 'indicator.detail.component.html',
    styleUrls: ['indicator.detail.component.css'],
    providers: [JSONP_PROVIDERS, IndicatorDescService, SelectedDataService],
    directives: [PlacesMapSelectComponent, DataTileComponent, SearchComponent, TableViewComponent]
})

export class DetailComponent implements OnInit {
    @Input() inputIndicator: any;
    @Input() inputPlaces: any;
    @ViewChild(PlacesMapSelectComponent) placeMap: PlacesMapSelectComponent;
    @ViewChildren(DataTileComponent) dataTiles: QueryList<DataTileComponent>;
    indicatorDesc: any = [];
    _chartData: any = [];
    chartData: any = [];
    showMap: boolean;
    showGraph: boolean;
    showTable: boolean;
    isCustomChart: boolean = false;
    customChartSelections: any = {};
    _customChartSelections: any = {};
    selectedSearchResult: SearchResult;
    selectedPlaceType: any = 'Oregon';
    urlPlaces: SearchResult[] = [];
    visible: boolean = false;
    indInfo: string = 'desc';
    initialLoad: boolean = true;
    relatedIndicators: any[] = [];
    indicatorTitle: any = '';
    subTitle: any = '';
    isStatewide: boolean = false;
    isCountyLevel: boolean = false;
    isTOP: boolean = false;
    detailUrlChanges: number = 0;
    backToUrl: string;
    returnToPlaces: any;
    dateAccessed: any;
    pageUrl: any;
    selectedYear: any = '';


    constructor(private _indicatorDescService: IndicatorDescService,
        private _router: Router, private _location:Location
    ) { }

    //emitted from search component
    onSelectedSearchResult(results: SearchResult) {
        this.selectedSearchResult = results;
        if (this.selectedSearchResult !== undefined) {
            if (results.Type.toLowerCase() === 'indicator') {
                //this._router.navigate(['Explore', { indicator: encodeURIComponent(results.Name), topics: results.TypeCategory.split(';')[1] }]);
                console.log('search result change', this.placeMap.selectedPlaces, this.placeMap.selectedSearchResults);
                let places: string = '';
                this.placeMap.selectedSearchResults.forEach((place: any, idx:number) => {
                    let place_simple = {
                        Name: place.Name,
                        ResID: place.ResID,
                        TypeCategory: place.TypeCategory,
                        Desc: place.Desc,
                        Combined: place.Combined,
                        GroupName: place.GroupName
                    };
                    places += encodeURIComponent(JSON.stringify(place_simple));
                    places += idx !== this.placeMap.selectedSearchResults.length - 1 ? ',' : '';
                });
                console.log('indicator detail: places simple', places);

                this._router.navigate(['Explore', {
                    indicator: encodeURIComponent(results.Name.replace('(', '%28').replace(')', '%29')),
                    places: places
                    //places: encodeURIComponent(JSON.stringify(this.placeMap.selectedSearchResults).replace('[', '').replace(']', ''))
                }]);
                this.detailUrlChanges++;
            }
        }
    }

    getClass() {
        return this.visible ? 'glyphicon glyphicon-menu-up' : 'glyphicon glyphicon-menu-down';
    }
    toggleCommunitiesWrapper() {
        this.visible = !this.visible;
        if (this.initialLoad) {
            this.placeMap.leafletMap.refreshMap();
            this.initialLoad = false;
        }
    }

    setToggleView(viewType: any) {
        switch (viewType) {
            case 'map':
                this.showMap = !this.showMap;
                break;
            case 'graph':
                this.showGraph = !this.showGraph;
                this.dataTiles.forEach((dt: any) => dt.showMenuLeft = !this.showGraph);
                break;
            case 'table':
                this.showTable = !this.showTable;
                break;
            default:
                break;
        }
        this.windowRefresh();
    }

    windowRefresh() {
        var runInterval = setInterval(runCheck, 50);
        function runCheck() {
            window.dispatchEvent(new Event('resize'));
            clearInterval(runInterval);
        }
        //let temp: any = '';
        //this.dataTile.onResize(temp);
    }

    showToolTips() {
        this._router.navigate(['/HowTo']);
    }

    goBack(evt:any) {
        console.log('going back', window['detailBackUrl'], this.detailUrlChanges, window.history);

        if (window['detailBackUrl']) {
            //determine if coming from home or explore
            //this._router.navigateByUrl(window['detailBackUrl']);
            if (window.detailBackUrl.toUpperCase().indexOf('/EXPLORE;') !== -1) {
                //split apart the params and pass back via ng2 router
                console.log('coming from explore page', window.location);
                if (!window.location.origin) {
                    window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
                }
                let url = decodeURI(window.detailBackUrl.replace(window.location.origin + '<%= APP_BASE %>', ''));
                console.log('url is now :', url);
                this._router.navigateByUrl(url);
            } else {
                console.log('coming from home');
                this._router.navigate(['/']);
            }
            //window.location = window['detailBackUrl'];
            //this._router.navigate(['Explore', {
            //    indicator: encodeURIComponent(results.Name
            //        .replace('(', '%28')
            //        .replace(')', '%29')
            //    )
            //}]);
        } else {
            console.log('FREEEEEEEEEEEEEEEE');
            this._router.navigateByUrl('/Explore');
            //window.history.back(1 + this.detailUrlChanges);
            //window.history.go(-(this.detailUrlChanges));
        }

        //window.hist
        //this._location.back();
        //this._router.navigate(['/Explore']);
        window.scrollTo(0, 0);
        evt.stopPropagation();
        //evt.preventDefault();
    }

    onSelectedYearChange(year: any) {
        console.log('year changed!', year);
        this.selectedYear = year;
    }

    onChartDataUpdate(data: any) {
        console.log('Chart data emitted to indicator detail', data);
        this._chartData = data;
        this.detailUrlChanges++;
        this.pageUrl = decodeURI(window.location.href);
    }

    onBlurExplorePage(evt: any) {
        //hide select dropdowns if showing.
        if (!$(evt.target).closest('#map-menu').length && !$(evt.target).hasClass('hamburger-menu')) {
            console.log('ree', evt);
            this.dataTiles.forEach((dt: any) => {
                if (dt.hMapMenu) {
                    dt.hMapMenu.menuSelected = false;
                }
            });
        }
    }

    getDateAccessed() {
        var currentDate = new Date();
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        return month + '/' + day + '/' + year;
    }

    ngOnInit() {
        this.detailUrlChanges = 0;
        console.log('detailurlchanges', this.detailUrlChanges, history);
        this.showMap = true;
        this.showGraph = true;
        this.showTable = false;
        this.dateAccessed = this.getDateAccessed();
        this.pageUrl = decodeURI(window.location.href);
        this.chartData = [];
        this.inputIndicator = decodeURI(this.inputIndicator)
            //.replace(/\%2528/g, '(')
            .replace(/\%28/g, '(')
            //.replace(/\%2529/g, ')')
            .replace(/\%29/g, ')')
            .replace(/\%252C/g, ',')
            .replace(/\%2C/g, ',')
            .replace(/\%2524/g, '$')
            .replace(/\%24/g, '$')
            .replace(/\+/g, '%2B');
                    //.replace(/\%2B/g, '+');
        console.log('DECODED!', this.inputIndicator);
        this._indicatorDescService.getIndicator(this.inputIndicator).subscribe(
            (data: any) => {
                console.log('indicator detail repsonse from indicator description service:!', data);
                let indicator_info = data.Desc[0];
                if (indicator_info) {
                    this.indicatorDesc = data.Desc;// IndicatorDescSer
                    this.relatedIndicators = data.RelatedIndicators;
                    console.log('indicatorDesc service', data);
                    //this.indicatorTitle = indicator_info.Sub_Topic_ID !== null
                    //    ? indicator_info.Sub_Topic_Name + ' ('+ indicator_info.Variable + ')'
                    //    : indicator_info.Dashboard_Chart_Title
                    //        ? indicator_info.Dashboard_Chart_Title
                    //        : indicator_info.Variable;
                    this.indicatorTitle = indicator_info.Dashboard_Chart_Title
                            ? indicator_info.Dashboard_Chart_Title
                            : indicator_info.Variable;
                    this.subTitle = indicator_info.Dashboard_Chart_Y_Axis_Label ? indicator_info.Dashboard_Chart_Y_Axis_Label : '';
                    this.isStatewide = indicator_info.Geog_ID === 8 ? true : false;
                    this.isCountyLevel = indicator_info.CountyLevel;
                    this.isTOP = indicator_info.isTOP;
                    this.isCustomChart = indicator_info.ScriptName !== null;
                }
                this.windowRefresh();
            });
        this.inputIndicator = this.inputIndicator.replace(/\%2B/g, '+');
        console.log('indicator detail input places: ', this.inputPlaces);
        this.urlPlaces = this.inputPlaces !== 'undefined' ? JSON.parse('[' + decodeURIComponent(this.inputPlaces) + ']') : [];
        console.log('indicator detail url places: ', this.urlPlaces);
        //var urlQueryString = document.location.search;
        //var keyRegex = new RegExp('([\?&])places([^&]*|[^,]*)');
        //// If param exists already, update it
        //if (urlQueryString.match(keyRegex) !== null) {
        //    let temp = urlQueryString.match(keyRegex)[0];
        //    let tempPlaces: string[] = temp.replace(new RegExp('([\?&])places='), '').split(',');
        //    for (var x = 0; x < tempPlaces.length; x++) {
        //        let place: SearchResult = JSON.parse(decodeURIComponent(tempPlaces[x]));
        //        this.urlPlaces.push(place);
        //    }
        //}
    }
}


