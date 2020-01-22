import { Component, ViewChildren, ViewChild, QueryList, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router, RouteSegment, RouteTree } from '@angular/router';
import { DataTileComponent, SelectedPlacesService, SearchComponent, IndicatorDescService, SearchResult, ShareLinkComponent, IndicatorTitleComponent, IndicatorFooterComponent, CollectionsService } from '../shared/index';
import { EmbedsAdminComponent } from './admin/embeds.admin.component';
import { Subscription } from 'rxjs/Subscription';
//import { env } from 'gulp-util';
//import { windowWhen } from 'rxjs/operator/windowWhen';

declare let ga: Function;
declare var $: any;

interface QueryStringParams {
    key: string;
    value: string;
}
/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'embeds',
    templateUrl: 'embeds.component.html',
    styleUrls: ['embeds.component.css'],
    encapsulation: ViewEncapsulation.None,
    directives: [DataTileComponent, SearchComponent, EmbedsAdminComponent, ShareLinkComponent, IndicatorTitleComponent, IndicatorFooterComponent],
    providers: [SelectedPlacesService, IndicatorDescService, CollectionsService]
})

export class EmbedsComponent implements OnInit, OnDestroy {
    @ViewChildren(DataTileComponent) dataTiles: QueryList<DataTileComponent>;
    @ViewChild(ShareLinkComponent) shareLinkComp: ShareLinkComponent;
    //@ViewChild(IndicatorTitleComponent) titleComp: IndicatorTitleComponent;
    selectedIndicator: any;
    hasSelectedIndicator: boolean = false;
    selectedPlaces: any;
    drillDownCategory: any;
    selectedPlacesUrl: any;
    collections: any[] = [];
    selectedCollection: string = '';
    subscription: Subscription;
    indicatorDesc: any;
    indicatorData: any;
    relatedIndicators: any;
    isTextData: boolean;
    hasDrilldowns: boolean;
    showChart: boolean;
    showMap: boolean;
    showTitle: boolean;
    showDesc: boolean;
    defaultGeo: string;
    geoOptions: any[] = [];
    includeResponsiveCode: boolean = true;
    subTitle: string;
    isStatewide: boolean = false;
    isCountyLevel: boolean = false;
    isMobile: boolean = false;
    isTOP: boolean;
    isCustomChart: boolean;
    restricted_domains: any[] = [];
    isRestricted: boolean = false;
    isAuthorized: boolean = true;
    showAdmin: boolean = false;
    selectedYear: any = '';
    embedCode: string;
    width: string = '1000';
    height: string = '600';
    currentParams: any;
    initLoad: boolean = true;
    embedContent: HTMLDivElement;
    referrer: string;
    drillDowns: any[] = [];
    drillDownCategories: any[] = [];
    geo_aoi: any;

    constructor(
        public _selectedPlacesService: SelectedPlacesService,
        private _router: Router,
        private _indicatorDescService: IndicatorDescService,
        private _collectionsService: CollectionsService
    ) { }

    ngOnInit() {
        //console.log('pushState', window.location.href, window.history.state);
        //window.history.pushState({}, 'CRT Home', window.location.href);
        var thisScope = this;
        this.subscription = this._selectedPlacesService.selectionChanged$.subscribe(
            data => {
                console.log('subscribe throwing event');
                console.log(data);
                this.onPlacesChanged(data);
                this.updateEmbedCode();
            },
            err => console.error(err),
            () => console.log('done with subscribe event places selected')
        );

        console.log('what is the indicator? ', this.selectedIndicator);
        if (this.selectedIndicator !== 'undefined') {
            this.hasSelectedIndicator = true;
            this.selectedIndicator = decodeURI(this.selectedIndicator)
                .replace(/\%28/g, '(')
                .replace(/\%29/g, ')')
                .replace(/\%252C/g, ',')
                .replace(/\%2C/g, ',')
                .replace(/\%2524/g, '$')
                .replace(/\%24/g, '$')
                .replace(/\+/g, '%2B');

            this.getIndicatorInfo(this.selectedIndicator);
            this.selectedIndicator = this.selectedIndicator.replace(/\%2B/g, '+');
        } else {
            this.hasSelectedIndicator = false;
        }

        window.addEventListener('message', function (event: any) {
            console.log('recieved content!', event, thisScope.isRestricted, thisScope.restricted_domains);
            //if (thisScope.isRestricted && thisScope.restricted_domains.indexOf(event.origin) !== -1) {
            let embedHeight = $('.embed').height();
            //check if coming from admin tool
            thisScope.referrer = event.data.referrer ? event.data.referrer.match(/:\/\/(.[^/]+)/)[1] : '';
            let isAdminTool = event.data.referrer === 'http://oe.oregonexplorer.info/rural/cr_data_admin/Embeds.aspx';
            thisScope.authorize(isAdminTool);
            let returnMessage = { iframeID: event.data.iframeID, embedHeight: embedHeight };
            event.source.postMessage(returnMessage, event.origin);
            //}
        });

        this._collectionsService.getAll().subscribe((c: any) => {

            let _collections = c.map((collection: any) => {
                return {
                    collection_name: collection.collection_name,
                    selected: this.selectedCollection === collection.collection_name,
                    geoid: collection.geoid,
                    geo_type: collection.geo_type,
                    geo_name: collection.geo_name
                };
            })
                .sort((a: any, b: any) => {
                    return a.collection_name.localeCompare(b.collection_name);
                });
            _collections.unshift({ collection_name: '<-- Select a collection -->', selected: !this.selectedCollection });
            this.collections = _collections;
            this.updateGeoAoi();
            console.log('collections from embeds', c);
        });
    }

    updateGeoAoi() {
        this.collections.forEach((coll) => {
            if (coll.collection_name === this.selectedCollection && coll.geoid !== null) {
                this.geo_aoi = {
                    geoid: coll.geoid,
                    geo_type: coll.geo_type,
                    geo_name: coll.geo_name
                };
                let collectionGeoPlace = {
                        Name: this.geo_aoi.geo_name,
                        ResID: this.geo_aoi.geoid,
                        TypeCategory: this.geo_aoi.geo_type
                };
                this._selectedPlacesService.add(collectionGeoPlace);
            }
        });
    }

    getIndicatorInfo(selectedIndicator: any) {
        this._indicatorDescService.getIndicator(this.selectedIndicator).subscribe(
            (data: any) => {
                console.log('indicator detail repsonse from indicator description service:!', data);
                this.indicatorData = data;
                let indicator_info = data.Desc[0];
                if (indicator_info) {
                    this.indicatorDesc = data.Desc;
                    this.relatedIndicators = data.RelatedIndicators;
                    this.isTextData = indicator_info.Represented_ID === 10 ? true : false;

                    this.restricted_domains = indicator_info.restricted_domains ? indicator_info.restricted_domains.split(';') : [];
                    this.isRestricted = this.restricted_domains.length > 0;

                    this.referrer = (parent !== window) ? document.referrer : document.location.href;
                    if ('<%= ENV %>' !== 'prod') {
                        this.restricted_domains.push('localhost:5555');
                        this.referrer = 'localhost:5555';
                    }
                    console.log('this.referrer', this.referrer);
                    // if (this.referrer !== null && this.referrer !== '') {
                    //     try {
                    //         this.referrer = this.referrer.match(/:\/\/(.[^/]+)/)[1];
                    //         localStorage.setItem('referrer', this.referrer);
                    //     } catch (ex) {
                    //         this.referrer = localStorage.getItem('referrer');
                    //     }
                    // } else {
                    //     this.referrer = localStorage.getItem('referrer');
                    // }

                    this.authorize(false);// this.isAuthorized = this.restricted_domains.indexOf(this.referrer) !== -1 || !this.isRestricted;
                    this.subTitle = indicator_info.Dashboard_Chart_Y_Axis_Label ? indicator_info.Dashboard_Chart_Y_Axis_Label : '';
                    this.isStatewide = indicator_info.Geog_ID === 8 ? true : false;
                    this.isCountyLevel = indicator_info.CountyLevel;
                    this.isTOP = indicator_info.isTOP;
                    this.isCustomChart = indicator_info.ScriptName !== null && indicator_info.indicator_geo.indexOf('School') === -1;
                    this.createGeoOpts(indicator_info.indicator_geo);
                }
                //this.windowRefresh();
            });
    }

    createGeoOpts(geoTypes: string) {
        if (geoTypes.indexOf('Count') !== -1) {
            this.geoOptions.push('Counties');
        }
        if (geoTypes.indexOf('Tract') !== -1) {
            this.geoOptions.push('Tracts');
        }
        if (geoTypes.indexOf('Place') !== -1) {
            this.geoOptions.push('Cities');
        }
        if (geoTypes.indexOf('School') !== -1) {
            this.geoOptions.push('School Districts');
        }
        if (geoTypes.indexOf('State') !== -1) {
            this.geoOptions.push('State');
        }
        this.defaultGeo = this.defaultGeo
            ? this.defaultGeo
            : this.isStatewide
                ? 'State'
                : this.isCountyLevel
                    ? 'Counties'
                    : geoTypes.indexOf('School') !== -1
                        ? 'School Districts'
                        : 'Counties';
        console.log('defaultGeo!', this.defaultGeo);
    }

    onDrilldownOutput(drillDownObj: any) {
        this.drillDownCategories = drillDownObj.drillDownCategories;
        this.drillDowns = drillDownObj.drillDowns;
    }

    onIndicatorChange(indicator: any) {
        this.selectedIndicator = indicator;
        this.goToEmbded();
    }

    onSelectedCollectionFromCmp(collection: any) {
        this.selectedCollection = collection;
        this.updateGeoAoi();
        this.updateEmbedCode();
    }

    clearAll(event:any) {
        this._router.navigate(['Embeds']);
    }

    routerOnActivate(curr: RouteSegment, prev?: RouteSegment,
        currTree?: RouteTree, prevTree?: RouteTree): void {
        this.selectedIndicator = decodeURI(curr.getParam('indicator'));
        this.selectedPlaces = curr.getParam('places') ? decodeURIComponent(curr.getParam('places')) : '{"Name":"Oregon","ResID":"41","TypeCategory":"State","Desc":"Oregon"}';
        this.drillDownCategory = curr.getParam('ddCat') ? decodeURI(curr.getParam('ddCat')) : 'All';
        this.showChart = curr.getParam('showChart') ? curr.getParam('showChart') === 'true' ? true : false : true;
        this.showMap = curr.getParam('showMap') ? curr.getParam('showMap') === 'true' ? true : false : true;
        this.showTitle = curr.getParam('showTitle') ? curr.getParam('showTitle') === '0' ? false : true : true;
        this.showDesc = curr.getParam('showDesc') ? curr.getParam('showDesc') === '0' ? false : true : true;
        this.showAdmin = curr.getParam('showAdmin') ? curr.getParam('showAdmin') === 'true' : curr.getParam('indicator') ? false : true;
        this.width = curr.getParam('width') ? curr.getParam('width') : this.width;
        this.defaultGeo = curr.getParam('geo') ? curr.getParam('geo') : '';
        this.selectedCollection = curr.getParam('collection') ? decodeURIComponent(curr.getParam('collection')) : '';

        this.currentParams = curr;
        if (this.selectedPlaces) {
            console.log('frank?', this.selectedPlaces);
            let selectedPlacesObj = JSON.parse('[' + this.selectedPlaces + ']');
            console.log('selectedPlaceOBJ', selectedPlacesObj);
            selectedPlacesObj.forEach((place: any) => {
                this._selectedPlacesService.add(place, 'graph');
            });
        }
        this.updateEmbedCode();
    }

    authorize(isAdminTool:boolean) {
        isAdminTool = this.referrer === 'http://oe.oregonexplorer.info/rural/cr_data_admin/Embeds.aspx' ? true : isAdminTool;
        this.isAuthorized = this.restricted_domains.indexOf(this.referrer) !== -1 || !this.isRestricted || isAdminTool;
        console.log('is Authorized?: ', this.isAuthorized, this.referrer, this.restricted_domains, this.isRestricted);
    }

    createCurrentState() {
        var qsIndicator: QueryStringParams = {
            key: 'indicator', value: encodeURI(this.selectedIndicator
                .replace(/\(/g, '%28')
                .replace(/\)/g, '%29'))
                .replace('%252E', '%2E')
                .replace('%2528', '%28')
                .replace('%2529', '%29')
                .replace(/\+/g, '%2B')
                .replace(/\&/g, '%26')
        };
        var qsPlaces: QueryStringParams = { key: 'places', value: this.selectedPlacesUrl };
        var qsDDCat: QueryStringParams = { key: 'ddCat', value: this.drillDownCategory };
        var qsShowChart: QueryStringParams = { key: 'showChart', value: this.showChart.toString() };
        var qsShowMap: QueryStringParams = { key: 'showMap', value: this.showMap.toString() };
        var qsShowTitle: QueryStringParams = { key: 'showTitle', value: this.showTitle.toString() };
        var qsShowDesc: QueryStringParams = { key: 'showDesc', value: this.showDesc.toString() };
        var qsShowAdmin: QueryStringParams = { key: 'showAdmin', value: this.showAdmin.toString() };
        var qsWidth: QueryStringParams = { key: 'width', value: this.width };
        var qsGeo: QueryStringParams = { key: 'geo', value: this.defaultGeo };
        var qsCollection: QueryStringParams = { key: 'collection', value: this.selectedCollection };
        var qsParams: QueryStringParams[] = [qsIndicator, qsPlaces, qsDDCat, qsShowChart, qsShowMap, qsShowTitle, qsShowDesc, qsShowAdmin, qsWidth, qsGeo, qsCollection];
        return qsParams;
    }

    updateEmbedCode() {
        let _embedCode = document.URL.substr(0, document.URL.lastIndexOf('/')) + '/Embeds';
        //let params = this.currentParams.parameters;
        let params = this.createCurrentState();
        console.log('current params!', params);
        //var qsParams: QueryStringParams[] = [];
        params.forEach(param => {
            if (['showAdmin', 'width'].indexOf(param.key) === -1)
                _embedCode += ';' + param.key + '=' + param.value;
        });
        var newState = this.updateQueryStringParam(params);
        console.log('NEW STATE PLACE !!!!!!!!!!!', newState);
        if (this.initLoad) {
            this.initLoad = false;
            console.log('replacing state', newState);
            window.history.replaceState({}, '', newState);
        } else {
            console.log('pushing state', newState);
            window.history.pushState({}, '', newState);
            if ('<%= ENV %>' === 'prod') {
                ga('send', 'pageview', window.location.href);
            }
        }
        console.log('embedCode: ', _embedCode);
        if (this.selectedIndicator !== 'undefined') {
            let iframeID = this.selectedIndicator.replace(/\ /g, '').replace(/\'/g, '').replace(/\%/g, '');

            let embedCSS = '<style>.iframe-container{position:relative;overflow:hidden;padding-bottom:100%}.iframe-container iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:0}</style>';
            let embedHTML = '<div id="' + iframeID + '" class="iframe-container"><iframe src="' + _embedCode + '" scrolling="no" width="' + this.width + '" height="' + this.height + '" frameborder=0></iframe></div>';
            let embedScript = '<script type="text/javascript">function handleMessage(e) { if ("' + location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '" === e.origin) { let n = e.data; if (n.iframeID) { var t = document.getElementById(n.iframeID); t.style.paddingBottom = ((n.embedHeight + 50) / t.clientWidth * 100).toFixed(2).toString() + "%" } } } function resizeEmbed() { let e = document.getElementsByClassName("iframe-container"); for (var t = 0; t < e.length; t++) { e[t].querySelector("iframe").contentWindow.postMessage({ referrer: document.location.href, iframeID: e[t].id } , "*") } } window.addEventListener ? window.addEventListener("message", handleMessage, !1) : window.attachEvent && window.attachEvent("onmessage", handleMessage), document.body.onresize = function () { resizeEmbed() }, window.frames.onload = function () { window.setTimeout(resizeEmbed, 4e3) };</script>';

            this.embedCode = (this.includeResponsiveCode ? (embedScript + embedCSS) : '') + embedHTML;
        } else {
            this.embedCode = 'Please select an indicator first.';
        }

    }

    onPlacesChanged(selectedPlaces: SearchResult[]) {
        console.log('place added via explore comp', selectedPlaces, this.geo_aoi);
        this.selectedPlacesUrl = '';
        for (var x = 0; x < selectedPlaces.length; x++) {
            //console.log('PROCESSING PLACE CHANGE: EXPLORE.TS');
            let place_simple = {
                Name: selectedPlaces[x].Name,
                ResID: selectedPlaces[x].ResID,
                TypeCategory: selectedPlaces[x].TypeCategory,
                Desc: selectedPlaces[x].Desc,
                Combined: selectedPlaces[x].Combined,
                GroupName: selectedPlaces[x].GroupName
            };
            this.selectedPlacesUrl += encodeURIComponent(JSON.stringify(place_simple));
            if (x !== selectedPlaces.length - 1) {
                this.selectedPlacesUrl += ',';
            }
        }
    }

    updateQueryStringParam(qsParams: QueryStringParams[]) {
        var baseUrl = [location.protocol, '//', location.host, location.pathname.split(';')[0]].join('');
        var urlQueryString = location.pathname.replace(location.pathname.split(';')[0], '').replace('/Explore', '');
        var allParams: string = '';
        for (var x = 0; x < qsParams.length; x++) {
            var newParam = qsParams[x].value === '' ? '' : qsParams[x].key + '=' + qsParams[x].value;
            // If the 'search' string exists, then build params from it
            if (urlQueryString) {
                var keyRegex = new RegExp('([\;])' + qsParams[x].key + '([^;]*|[^,]*)');
                // If param exists already, update it
                if (urlQueryString.match(keyRegex) !== null) {
                    allParams = urlQueryString.replace(keyRegex, '$1' + newParam);
                } else { // Otherwise, add it to end of query string
                    allParams = urlQueryString + (qsParams[x].value !== '' ? ';' : '') + newParam;
                }
            } else {
                let pathname = document.location.pathname;
                var keyRegex = new RegExp('([\;])' + qsParams[x].key + '([^;]*|[^,]*)');
                if (pathname.match(keyRegex) !== null) {
                    allParams = pathname.replace(keyRegex, '$1' + newParam);
                } else {
                    allParams = (qsParams[x].value !== '' ? ';' : '') + newParam;
                }
            }
            urlQueryString = allParams;
        }
        let returnVal = (baseUrl + allParams).replace('?&', '?');
        returnVal = '<%= ENV %>' !== 'prod' ? returnVal.replace(new RegExp('\\.', 'g'), '%2E') : returnVal;
        return returnVal;
    };

    onSelectedIndicatorFromCmp(selectedIndicator: any) {
        this.selectedIndicator = selectedIndicator;
        this.hasSelectedIndicator = true;
        this.goToEmbded();
    }

    goToEmbded() {
        console.log("GOTO EMBED?", this.selectedPlaces)
        this._router.navigate(['Embeds', {
            indicator: encodeURI(this.selectedIndicator
                .replace(/\(/g, '%28')
                .replace(/\)/g, '%29'))
                .replace('%252E', '%2E')
                .replace('%2528', '%28')
                .replace('%2529', '%29')
                .replace(/\+/g, '%2B')
                .replace(/\&/g, '%26')
                , collection:this.selectedCollection
            , places: this.selectedPlaces
            , showAdmin: this.showAdmin.toString()
            , showDesc: this.showDesc.toString()
            , showMap: this.showMap.toString()
            , showTitle: this.showTitle.toString()
            , showChart: this.showChart.toString()
            , width: this.width
        }]);
    }

    onEmbedDimensionChange(dimensionObj: any) {
        switch (dimensionObj.dimension) {
            case 'width':
                this.width = dimensionObj.value;
                break;
            case 'height':
                this.height = dimensionObj.value;
                break;
            default:
                break;
        }
        this.updateEmbedCode();
        this.reflowCharts();
    }

    onResize(event: any) {
        console.log('resizing!', event.target.innerWidth);
        if (event.target.innerWidth) {
            this.width = (parseInt(event.target.innerWidth) - 30).toString();
            this.embedContent.classList.remove('centerEmbed');
            //this.height = event.target.innerHeight;
        } else {
            this.embedContent.classList.add('centerEmbed');
        }
    }

    onEmbedShowChange(showObj: any) {
        console.log('show Change fired!', showObj);
        switch (showObj.showType) {
            case 'map':
                this.showMap = showObj.value;
                break;
            case 'chart':
                this.showChart = showObj.value;
                break;
            case 'title':
                this.showTitle = showObj.value;
                break;
            case 'desc':
                this.showDesc = showObj.value;
                break;
            case 'responsive':
                this.includeResponsiveCode = showObj.value;
                break;
            default:
                break;
        }
        this.updateEmbedCode();
        this.reflowCharts();
    }

    onSelectedYearChange(year: any) {
        this.selectedYear = year;
    }

    reflowCharts() {
        this.dataTiles.forEach(dt => {
            dt.onResize(null);
            dt.reflowChart();
        });
        window.setTimeout(this.fireResize, 500);
    }

    fireResize() {
        // For a full list of event types: https://developer.mozilla.org/en-US/docs/Web/API/document.createEvent
        var el = document; // This can be your element on which to trigger the event
        var event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, false);
        el.dispatchEvent(event);
    }

    onChartDataUpdate(data: any) {
        console.log('Chart data emitted to indicator detail', data);
        this.reflowCharts();
    }

    closeAdmin() {
        this.showAdmin = false;
        this.updateEmbedCode();
    }


    onDownloadClick(clicked: any) {
        console.log('download clicked detail');
        //get data from graph or map?
        let data: any;
        let years: any;
        let places: any;
        this.dataTiles.forEach((dt: any) => {
            if (dt.tileType === 'graph') {
                data = dt.dataStore.indicatorData;
                years = dt._tickLabels;
                places = dt.places;
            }
        });
    }
    onEmbedGeoOptsChange(geoOpts: any) {
        console.log('got geoOpts', geoOpts);
        this.defaultGeo = geoOpts;
        this.updateEmbedCode();
    }

    ngOnDestroy() {
        if (this.subscription !== undefined) {
            this.subscription.unsubscribe();
        }
    }
}
