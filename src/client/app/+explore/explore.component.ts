import { Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router, RouteSegment, RouteTree, OnActivate} from '@angular/router';
//import {Router, RouteParams} from '@angular/router-deprecated';
import {Subscription}   from 'rxjs/Subscription';
import {TopicsComponent} from './topics/topics.select.component';
import {PlacesWrapperComponent} from './places_wrapper/places.wrapper.component';
import {DataComponent} from './data/data.wrapper.component';
import {DetailComponent} from './indicator_detail/indicator.detail.component';
import {SearchComponent} from '../shared/components/index';
import {SearchResult, Topic, Indicator} from '../shared/data_models/index';
import {SelectedPlacesService, CollectionsService} from '../shared/services/index';

declare var $: any;
declare var window: any;
declare var toastr: any;
declare let ga: Function;

interface QueryStringParams {
    key: string;
    value: string;
}

/**
 * This class represents the lazy loaded ExploreComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'explore',
    templateUrl: 'explore.component.html',
    styleUrls: ['explore.component.css'],
    directives: [SearchComponent, TopicsComponent, PlacesWrapperComponent, DataComponent, DetailComponent],
    providers: [SelectedPlacesService,CollectionsService]
})

export class ExploreComponent implements OnInit, OnActivate, OnDestroy {
    //export class ExploreComponent implements OnInit {
    @ViewChild(DataComponent) dataComp: DataComponent;
    @ViewChild(TopicsComponent) topicsComp: TopicsComponent;
    @ViewChild(DetailComponent) detailComp: DetailComponent;
    urlCollection: any = 'Show All';
    urlFilter: any = '';
    selectedTopics: any;
    selectedIndicators: any;
    selectedIndicator: any;
    selectedPlaces: any;
    selectedPlacesUrl: any;
    selectedCollection: any;
    allIndicators: Indicator[];
    allTopics: Topic[] = [];
    indicatorDetailView: boolean = false;
    initialIndicator: boolean;
    selectedSearchResult: SearchResult;
    collections: any[] = [];
    subscription: Subscription;
    showTopicsExpanded: boolean = false;
    showPlacesExpanded: boolean = false;
    drillDownCategory: any = '';
    initLoad: boolean = true;
    hideAll: any = { hide: false, trigger: null };

    constructor(
        public _selectedPlacesService: SelectedPlacesService,
        public _collectionsService: CollectionsService,
        private _router: Router
    ) {
        this.initialIndicator = true;
    }

    routerOnActivate(curr: RouteSegment, prev?: RouteSegment,
        currTree?: RouteTree, prevTree?: RouteTree): void {
        this.selectedTopics = decodeURI(curr.getParam('topics'));
        this.selectedTopics = this.selectedTopics ? this.selectedTopics : 'All Topics';
        this.selectedIndicator = decodeURI(curr.getParam('indicator'));
        this.selectedIndicators = decodeURI(curr.getParam('indicators'));
        this.selectedPlaces = decodeURI(curr.getParam('places'));
        this.urlCollection = decodeURI(curr.getParam('collection'));
        this.urlFilter = decodeURI(curr.getParam('filter'));
        this.showTopicsExpanded = curr.getParam('show') === 'Topics';
        this.showPlacesExpanded = curr.getParam('show') === 'Places';
        this.drillDownCategory = curr.getParam('ddCat') ? decodeURI(curr.getParam('ddCat')) : 'All';
        //console.log('routercheck', this.drillDownCategory, this.selectedTopics);
        this.indicatorDetailView = this.selectedIndicator !== null && this.selectedIndicator !== 'undefined' ? true : false;
    }
    onHideAll(evt: any) {
        console.log('onhideall', evt);
        if (evt.filter !== undefined) {
            console.log('shark');
            //update url string for use with back and reloads
            var newState = '';
            if (evt.filter === '') {
                var baseUrl = [location.protocol, '//', location.host, location.pathname.split(';')[0]].join('');
                var urlQueryString = location.pathname.replace(location.pathname.split(';')[0], '').replace('/Explore', '');
                console.log('onhideallqs', urlQueryString);
                let splitQS = urlQueryString.split(';');
                urlQueryString = '';
                splitQS.forEach((qs: any, index:number) => {
                    urlQueryString += qs.indexOf('filter=') === -1 ? (index !== 0 ? ';' : '') + qs : '';
                });
                newState = baseUrl + urlQueryString;
                newState = '<%= ENV %>' !== 'prod' ? newState.replace(new RegExp('\\.', 'g'), '%2E') : newState;
            } else {
                var qsParams: QueryStringParams[] = [];
                var filterParam: QueryStringParams = { key: 'filter', value: evt.filter };
                qsParams.push(filterParam);
                newState = this.updateQueryStringParam(qsParams);
            }
            console.log('pushing state for filter', newState);
            window.history.pushState({}, '', newState);
            if ('<%= ENV %>' === 'prod') {
                ga('send', 'pageview', window.location.href);
            }
        }
        this.hideAll = evt;
    }
    //emitted from search component
    onSelectedSearchResult(results: SearchResult) {
        this.selectedSearchResult = results;
        if (this.selectedSearchResult !== undefined) {
            if (results.Type.toLowerCase() === 'indicator') {
                window['detailBackUrl'] = window.location.href;
                this._router.navigate(['/Explore', {
                    indicator: encodeURI(results.Name)
                        .replace('(', '%28')
                        .replace(')', '%29')
                        .replace(/\+/g, '%2B')
                        .replace(/\&/g, '%26')
                        .replace(/\=/g, '%3D'),
                    places: this.selectedPlacesUrl
                }]);
            }
        }
    }
    //bubble up from topics component selection
    onGetSelectedTopicsFromComp(results: any) {
        console.log('emitted selected topics ' + results);
        this.selectedTopics = results;
        var queryString = '';
        if (this.selectedTopics.length > 0) {
            for (var x = 0; x < this.selectedTopics.length; x++) {
                queryString += this.selectedTopics[x].replace('&', '%26');
                if (x < this.selectedTopics.length - 1) {
                    queryString += ',';
                }
            }
        } else {
            //queryString = 'All Topics';
            queryString = '';
        }
        var qsParams: QueryStringParams[] = [];
        var topicsParam: QueryStringParams = { key: 'topics', value: queryString };
        qsParams.push(topicsParam);

        if (this.initialIndicator) {
            this.initialIndicator = false;
        } else {
            //clear out indicator selection
            this.selectedIndicators = '';
            var indicatorParam: QueryStringParams = { key: 'indicators', value: '' };
            qsParams.push(indicatorParam);
        }
        var newState = this.updateQueryStringParam(qsParams);
        console.log('NEW STATE TOPICs!!!!!!!!!!!', newState);
        window.history.pushState({}, '', newState);
        if ('<%= ENV %>' === 'prod') {
            if (ga) {
                ga('send', 'pageview', window.location.href);
            }
        }
    }

    onGetAllTopicsFromComp(results: any) {
        //console.log('Got All Topics From COMP! ' + results);
        this.allTopics = results;
    }
    onGetAllIndicatorsFromComp(results: any) {
        //console.log('Got All Indicators From COMP!');
        this.allIndicators = results;
    }

    onGetSelectedCollectionsFromComp(results: any) {
        console.log('selected collection changed explore', results);
        this.selectedCollection = results;
        this.dataComp.collections = results;
        let selColl = results.filter((coll: any) => coll.selected)[0].collection;
        this.dataComp.selectedCollection = selColl;
        this.dataComp.indTopListComps.toArray().forEach((child: any) => child.selCollections = results);
        var qsParams: QueryStringParams[] = [];
        var collectionParam: QueryStringParams = { key: 'collection', value: selColl.replace(/\ /g, '%20').replace(/\'/g, '%27') };
        qsParams.push(collectionParam);
        var newState = this.updateQueryStringParam(qsParams);
        console.log('new state!', newState);
        window.history.replaceState({}, '', newState);
    }

    onPopState(evt: any) {
        console.log('popping state', evt);
    }

    onPlacesChanged(selectedPlaces: SearchResult[]) {
        console.log('place added via explore comp', selectedPlaces);
        var qsParams: QueryStringParams[] = [];
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
            //places += encodeURIComponent(JSON.stringify(selectedPlaces[x]));
            //places += selectedPlaces[x].Name;
            if (x !== selectedPlaces.length - 1) {
                this.selectedPlacesUrl += ',';
            }
        }
        var placeParam: QueryStringParams = { key: 'places', value: this.selectedPlacesUrl };
        qsParams.push(placeParam);
        var newState = this.updateQueryStringParam(qsParams);
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

    onBlurExplorePage(evt: any) {
        //console.log('blurevt', $(evt.target).closest('.multiselect').length, $(evt.target).closest('.dataset-filter').length);
        //hide select dropdowns if showing.
        try {
            if (!$(evt.target).closest('.data-control-bar').length) {
                this.dataComp.shareLinkComp.showShare = false;
            }
            if (!$(evt.target).closest('.dataset-filter').length) {
                //this.topicsComp.showFilterIndicator = this.topicsComp.showFilterIndicator ? false : true;
                //$('#filteredIndicator').val = '';
                (<HTMLInputElement>document.getElementById('filteredIndicator')).value = '';
                this.topicsComp.showFilterIndicator = false;
                //this.topicsComp.chkBoxVisibile = false;
            }
            if (!$(evt.target).closest('.multiselect').length) {
                this.dataComp.indTopListComps.toArray().forEach((child: any) => child.chkBoxVisibile = false);
            }

        } catch (ex) {
            evt.preventDefault();
            console.log('failed to check/hide list boxes');
        }

    }

    ngOnInit() {
        //this.selectedTopics = this._routeParams.getParam('topics');
        //this.selectedTopics = this.getParameterByName('topics');
        console.log('topics from init?', this.selectedTopics);
        //throw 'fake error';
        this.subscription = this._selectedPlacesService.selectionChanged$.subscribe(
            data => {
                console.log('subscribe throwing event');
                console.log(data);
                this.onPlacesChanged(data);
            },
            err => console.error(err),
            () => console.log('done with subscribe event places selected')
        );
        console.log('crt collections', window.crt_collections);
        this._collectionsService.get().subscribe((c: any) => {
            this.collections = c;
            //console.log('collections?', c);
            //if (this.dataComp) {
            //    this.dataComp.dataTiles.forEach((dt: any) => {
            //        console.log('hearme', dt);
            //        dt.collections = c;
            //    });
            //}
            //if (this.detailComp) {
            //    this.detailComp.dataTiles.forEach((dt: any) => {
            //        if (dt.tileType === 'graph') {
            //            console.log('hearme', dt);
            //            dt.collections = c;
            //        }
            //    });
            //}
            window.crt_collections = c;
        });
        console.log('crt collections2', window.crt_collections);
        //window.history.pushState({}, '', window.location.href);
        //Sthis._selectedPlacesService
    }

    ngOnDestroy() {
        if (this.subscription !== undefined) {
            this.subscription.unsubscribe();
        }
    }
}

//$(window).on('popstate', function (event: any) {
//    console.log('popping', event);
//});


